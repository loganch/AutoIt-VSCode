/**
 * Utility helpers for parsing AutoIt function declarations safely.
 * Handles quoted strings and nested delimiters in default parameter values.
 */

const FUNCTION_START_PATTERN = /^\s*(?:Volatile\s+)?Func\s+(\w+)\s*\(/i;

/**
 * @typedef {Object} FunctionDeclarationMatch
 * @property {string} functionName - Name of the declared function
 * @property {string} paramsText - Raw text between the parentheses, trimmed
 * @property {number} paramsStartIndex - Index in `line` where paramsText begins
 * @property {number} closingParenIndex - Index in `line` of the matching closing paren
 */

/**
 * @typedef {Object} FunctionBoundary
 * @property {string} name - Function name
 * @property {number} startLine - Zero-based index of the `Func` line
 * @property {number} endLine - Zero-based index of the matching `EndFunc` line
 * @property {string[]} parameters - Normalized parameter names
 */

/**
 * Yields each character with its quoted context so callers never reimplement
 * AutoIt string tracking (including doubled-quote escapes). Quote characters
 * themselves yield as quoted; callers gate delimiter/depth logic on !quoted.
 */
const walkQuoteAware = function* (text, startIndex = 0) {
  let inDoubleQuote = false;
  let inSingleQuote = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];
    const inQuotes = inDoubleQuote || inSingleQuote;

    if (inQuotes) {
      const activeQuote = inDoubleQuote ? '"' : "'";
      // AutoIt escapes a quote inside same-quoted strings using doubled quotes.
      if (char === activeQuote && nextChar === activeQuote) {
        yield { char, index, quoted: true };
        index += 1;
        yield { char: nextChar, index, quoted: true };
        continue;
      }
      if (char === activeQuote) {
        inDoubleQuote = false;
        inSingleQuote = false;
      }
      yield { char, index, quoted: true };
      continue;
    }

    if (char === '"') {
      inDoubleQuote = true;
      yield { char, index, quoted: true };
      continue;
    }

    if (char === "'") {
      inSingleQuote = true;
      yield { char, index, quoted: true };
      continue;
    }

    yield { char, index, quoted: false };
  }
};

const scanForClosingParen = (text, startIndex) => {
  let depth = 0;

  for (const { char, index, quoted } of walkQuoteAware(text, startIndex)) {
    if (quoted) {
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
};

/**
 * Splits `text` on `delimiter`, but only at top-level nesting -- occurrences
 * inside quoted strings or nested (), [], {} are not treated as splits.
 * @param {string} text - Source text to split
 * @param {string} [delimiter] - Delimiter character to split on
 * @returns {string[]} Trimmed, non-empty top-level tokens
 */
const splitTopLevel = (text, delimiter = ',') => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const parts = [];
  let current = '';
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;

  for (const { char, quoted } of walkQuoteAware(text)) {
    if (quoted) {
      current += char;
      continue;
    }

    if (char === '(') {
      parenDepth += 1;
      current += char;
      continue;
    }

    if (char === ')') {
      if (parenDepth > 0) {
        parenDepth -= 1;
      }
      current += char;
      continue;
    }

    if (char === '[') {
      bracketDepth += 1;
      current += char;
      continue;
    }

    if (char === ']') {
      if (bracketDepth > 0) {
        bracketDepth -= 1;
      }
      current += char;
      continue;
    }

    if (char === '{') {
      braceDepth += 1;
      current += char;
      continue;
    }

    if (char === '}') {
      if (braceDepth > 0) {
        braceDepth -= 1;
      }
      current += char;
      continue;
    }

    if (char === delimiter && parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
      const token = current.trim();
      if (token) {
        parts.push(token);
      }
      current = '';
      continue;
    }

    current += char;
  }

  const tail = current.trim();
  if (tail) {
    parts.push(tail);
  }

  return parts;
};

const splitTopLevelAssignment = text => {
  const parts = splitTopLevel(text, '=');
  if (parts.length <= 1) {
    return { left: text, right: '' };
  }

  return {
    left: parts[0],
    right: parts.slice(1).join('='),
  };
};

/**
 * Parses a single line as a `Func Name(...)` declaration, respecting quoted
 * strings and nested delimiters when locating the closing parenthesis.
 * @param {string} line - Source line to parse
 * @returns {FunctionDeclarationMatch|null} Match details, or null if `line`
 *   isn't a function declaration or has no matching closing paren
 */
const parseFunctionDeclarationLine = line => {
  if (typeof line !== 'string') {
    return null;
  }

  const startMatch = line.match(FUNCTION_START_PATTERN);
  if (!startMatch) {
    return null;
  }

  const functionName = startMatch[1];
  const paramsStartIndex = startMatch[0].length;
  const closingParenIndex = scanForClosingParen(line, paramsStartIndex);

  if (closingParenIndex === -1) {
    return null;
  }

  return {
    functionName,
    paramsText: line.slice(paramsStartIndex, closingParenIndex).trim(),
    paramsStartIndex,
    closingParenIndex,
  };
};

const normalizeParameterName = (paramToken, ensureDollarPrefix = false) => {
  const { left } = splitTopLevelAssignment(paramToken.trim());
  const withoutByRef = left.replace(/^ByRef\s+/i, '').trim();

  if (!withoutByRef) {
    return '';
  }

  if (ensureDollarPrefix && !withoutByRef.startsWith('$')) {
    return `$${withoutByRef}`;
  }

  return withoutByRef;
};

/**
 * Splits a parameter-list string into normalized parameter names (ByRef and
 * default-value parts stripped).
 * @param {string} paramsText - Raw parameter-list text between the parens
 * @param {boolean} [ensureDollarPrefix] - Add a leading $ to names missing one
 * @returns {string[]} Normalized, non-empty parameter names
 */
const parseParameterNames = (paramsText, ensureDollarPrefix = false) => {
  if (!paramsText || typeof paramsText !== 'string') {
    return [];
  }

  return splitTopLevel(paramsText, ',')
    .map(token => normalizeParameterName(token, ensureDollarPrefix))
    .filter(Boolean);
};

/**
 * Scans document lines for Func/EndFunc boundaries, collecting each
 * function's name, line range, and normalized parameter names.
 * @param {string[]} lines - Document lines to scan
 * @param {boolean} [ensureDollarPrefix] - Add a leading $ to parameter names missing one
 * @returns {FunctionBoundary[]} One entry per matched Func/EndFunc pair
 */
const parseFunctionBoundaries = (lines, ensureDollarPrefix = false) => {
  const funcEndPattern = /^\s*EndFunc/i;
  const functions = [];
  let currentFunc = null;

  lines.forEach((line, index) => {
    const funcDeclaration = parseFunctionDeclarationLine(line);
    if (funcDeclaration) {
      const parameters = parseParameterNames(funcDeclaration.paramsText, ensureDollarPrefix);
      currentFunc = {
        name: funcDeclaration.functionName,
        startLine: index,
        endLine: -1,
        parameters,
      };
      return;
    }

    const funcEnd = line.match(funcEndPattern);
    if (funcEnd && currentFunc) {
      currentFunc.endLine = index;
      functions.push(currentFunc);
      currentFunc = null;
    }
  });

  return functions;
};

export {
  parseFunctionBoundaries,
  parseFunctionDeclarationLine,
  parseParameterNames,
  splitTopLevel,
};
