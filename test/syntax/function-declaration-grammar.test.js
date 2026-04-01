const grammar = require('../../syntaxes/autoit.tmLanguage.json');

function getFunctionRule() {
  return grammar.patterns.find(pattern => pattern.name === 'meta.function.autoit');
}

function toJsRegex(onigurumaPattern, { global = false, multiline = false } = {}) {
  let source = onigurumaPattern;
  let flags = '';

  if (source.includes('(?i:')) {
    source = source.replace(/\(\?i:/g, '(?:');
    flags += 'i';
  }

  if (global) flags += 'g';
  if (multiline) flags += 'm';

  return new RegExp(source, flags);
}

function findDeclarationClosingParen(source, startIndex) {
  const openParenIndex = source.indexOf('(', startIndex);
  if (openParenIndex === -1) return -1;

  let depth = 0;
  let inDoubleQuote = false;
  let inSingleQuote = false;

  for (let index = openParenIndex + 1; index < source.length; index += 1) {
    const char = source[index];
    const nextChar = source[index + 1];

    if (inDoubleQuote) {
      if (char === '"' && nextChar === '"') {
        index += 1;
        continue;
      }

      if (char === '"') {
        inDoubleQuote = false;
      }
      continue;
    }

    if (inSingleQuote) {
      if (char === "'" && nextChar === "'") {
        index += 1;
        continue;
      }

      if (char === "'") {
        inSingleQuote = false;
      }
      continue;
    }

    if (char === '"') {
      inDoubleQuote = true;
      continue;
    }

    if (char === "'") {
      inSingleQuote = true;
      continue;
    }

    if (char === '(') {
      depth += 1;
      continue;
    }

    if (char === ')') {
      if (depth === 0) {
        return index;
      }
      depth -= 1;
    }
  }

  return -1;
}

function getDeclarationEndIndex(source, startIndex, endPattern) {
  // We intentionally model both forms so this test suite catches regressions
  // if the declaration scope accidentally reverts to line-end behavior.
  if (endPattern === '(?<=\\))') {
    const closeParen = findDeclarationClosingParen(source, startIndex);
    return closeParen === -1 ? -1 : closeParen + 1;
  }

  if (endPattern === '(?<=\\))|$') {
    const closeParen = findDeclarationClosingParen(source, startIndex);
    const eol = source.indexOf('\n', startIndex);
    const lineEnd = eol === -1 ? source.length : eol;

    if (closeParen !== -1 && closeParen < lineEnd) {
      return closeParen + 1;
    }

    return lineEnd;
  }

  return -1;
}

function extractFunctionDeclarationSegment(source, functionRule) {
  const beginRegex = toJsRegex(functionRule.begin);
  const beginMatch = beginRegex.exec(source);

  if (!beginMatch) return '';

  const startIndex = beginMatch.index;
  const endIndex = getDeclarationEndIndex(source, startIndex, functionRule.end);

  if (endIndex === -1) return '';

  return source.slice(startIndex, endIndex);
}

describe('AutoIt grammar function declaration parameter scopes', () => {
  test('uses dedicated parameter scope within meta.function', () => {
    const functionRule = getFunctionRule();

    expect(functionRule).toBeDefined();

    const parameterPattern = functionRule.patterns.find(
      pattern => pattern.name === 'variable.parameter.autoit',
    );

    expect(parameterPattern).toBeDefined();
    expect(parameterPattern.match).toBe('(\\$)[a-zA-Z_]\\w*');
    expect(parameterPattern.captures?.['1']?.name).toBe(
      'punctuation.definition.variable.parameter.autoit',
    );
  });

  test('keeps declaration scope open until closing parenthesis', () => {
    const functionRule = getFunctionRule();
    expect(functionRule.end).toBe('(?<=\\))');
  });

  test('parses quoted strings inside function declarations', () => {
    const functionRule = getFunctionRule();

    const hasDoubleQuotedPattern = functionRule.patterns.some(
      pattern => pattern.name === 'string.quoted.double.autoit',
    );
    const hasSingleQuotedPattern = functionRule.patterns.some(
      pattern => pattern.name === 'string.quoted.single.autoit',
    );

    expect(hasDoubleQuotedPattern).toBe(true);
    expect(hasSingleQuotedPattern).toBe(true);
  });

  test('single-line declarations capture all parameter variables', () => {
    const functionRule = getFunctionRule();
    const parameterPattern = functionRule.patterns.find(
      pattern => pattern.name === 'variable.parameter.autoit',
    );

    const source = 'Func Example($first, ByRef $second = 42)\nEndFunc';
    const declarationSegment = extractFunctionDeclarationSegment(source, functionRule);

    const parameterRegex = toJsRegex(parameterPattern.match, { global: true });
    const matches = [...declarationSegment.matchAll(parameterRegex)].map(match => match[0]);

    expect(matches).toEqual(['$first', '$second']);
  });

  test('multiline declarations capture parameter variables across continued lines', () => {
    const functionRule = getFunctionRule();
    const parameterPattern = functionRule.patterns.find(
      pattern => pattern.name === 'variable.parameter.autoit',
    );

    const source = [
      'Func Example($first, _',
      '    ByRef $second = 42, _',
      '    $third = "x")',
      'EndFunc',
    ].join('\n');

    const declarationSegment = extractFunctionDeclarationSegment(source, functionRule);
    const parameterRegex = toJsRegex(parameterPattern.match, { global: true });
    const matches = [...declarationSegment.matchAll(parameterRegex)].map(match => match[0]);

    expect(matches).toEqual(['$first', '$second', '$third']);
  });

  test('declaration with closing parenthesis in quoted default does not truncate parameters', () => {
    const functionRule = getFunctionRule();
    const parameterPattern = functionRule.patterns.find(
      pattern => pattern.name === 'variable.parameter.autoit',
    );

    const source = 'Func _File_ListNewestToArray($sgName = ")*\'", $flag = Default)\nEndFunc';
    const declarationSegment = extractFunctionDeclarationSegment(source, functionRule);

    const parameterRegex = toJsRegex(parameterPattern.match, { global: true });
    const matches = [...declarationSegment.matchAll(parameterRegex)].map(match => match[0]);

    expect(matches).toEqual(['$sgName', '$flag']);
  });
});
