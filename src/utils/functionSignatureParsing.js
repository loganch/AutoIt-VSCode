/**
 * Utility helpers for parsing AutoIt function declarations safely.
 * Handles quoted strings and nested delimiters in default parameter values.
 */

const FUNCTION_START_PATTERN = /^\s*(?:Volatile\s+)?Func\s+(\w+)\s*\(/i;

const scanForClosingParen = (text, startIndex) => {
  let depth = 0;
  let inDoubleQuote = false;
  let inSingleQuote = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (inDoubleQuote) {
      // AutoIt escapes a quote inside double-quoted strings using doubled quotes.
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
      // AutoIt escapes a quote inside single-quoted strings using doubled quotes.
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
};

const splitTopLevel = (text, delimiter = ',') => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const parts = [];
  let current = '';
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;
  let inDoubleQuote = false;
  let inSingleQuote = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (inDoubleQuote) {
      current += char;
      if (char === '"' && nextChar === '"') {
        current += nextChar;
        index += 1;
        continue;
      }

      if (char === '"') {
        inDoubleQuote = false;
      }
      continue;
    }

    if (inSingleQuote) {
      current += char;
      if (char === "'" && nextChar === "'") {
        current += nextChar;
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
      current += char;
      continue;
    }

    if (char === "'") {
      inSingleQuote = true;
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

const parseParameterNames = (paramsText, ensureDollarPrefix = false) => {
  if (!paramsText || typeof paramsText !== 'string') {
    return [];
  }

  return splitTopLevel(paramsText, ',')
    .map(token => normalizeParameterName(token, ensureDollarPrefix))
    .filter(Boolean);
};

export { parseFunctionDeclarationLine, parseParameterNames, splitTopLevel };
