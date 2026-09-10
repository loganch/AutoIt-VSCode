import { Range } from 'vscode';
import { escapeRegexLiteral } from './regexPatterns';

/**
 * Strips a trailing `;` line comment from a line of AutoIt code, respecting quoted strings.
 * @param {string} line - Source line to strip
 * @returns {string} The line with any trailing comment removed
 */
function stripLineComment(line) {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === ';' && !inSingle && !inDouble) return line.slice(0, i);
  }
  return line;
}

/**
 * Builds a boolean mask marking which characters of a line fall inside a quoted string.
 * @param {string} line - Source line to analyze
 * @returns {boolean[]} Mask array the same length as `line`; true where the character is inside a string
 */
function stringMask(line) {
  const mask = new Array(line.length).fill(false);
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      mask[i] = true;
    } else if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      mask[i] = true;
    } else {
      mask[i] = inSingle || inDouble;
    }
  }
  return mask;
}

/**
 * Replaces the contents of quoted strings in a line with spaces, preserving length and layout.
 * @param {string} line - Source line to blank
 * @returns {string} The line with string contents replaced by spaces
 */
function blankStrings(line) {
  const mask = stringMask(line);
  return line
    .split('')
    .map((ch, i) => (mask[i] ? ' ' : ch))
    .join('');
}

/**
 * Finds the Func/EndFunc block enclosing a given position in a document.
 * @param {import('vscode').TextDocument} document - Document to search
 * @param {import('vscode').Position} position - Position to find the enclosing function for
 * @returns {import('vscode').Range|null} Range spanning the enclosing function, or null if none is found
 */
function findEnclosingFunctionInDocument(document, position) {
  const funcStartRe = /^\s*(?:volatile\s+)?Func\b/i;
  const funcEndRe = /^\s*EndFunc\b/i;
  let startLine = null;

  for (let lineNum = 0; lineNum <= position.line; lineNum += 1) {
    const code = blankStrings(stripLineComment(document.lineAt(lineNum).text));
    if (funcStartRe.test(code)) startLine = lineNum;
    if (funcEndRe.test(code)) startLine = null;
  }

  if (startLine === null) return null;

  let endLine = null;
  for (let lineNum = startLine + 1; lineNum < document.lineCount; lineNum += 1) {
    const code = blankStrings(stripLineComment(document.lineAt(lineNum).text));
    if (funcEndRe.test(code)) {
      endLine = lineNum;
      break;
    }
  }

  if (endLine === null) return null;
  return new Range(document.lineAt(startLine).range.start, document.lineAt(endLine).range.end);
}

// Block-comment markers: #cs/#ce or #comments-start/#comments-end (see comment.block.autoit in autoit.tmLanguage.json)
const COMMENT_BLOCK_START = /^\s*#c(?:omments-start|s)\b/i;
const COMMENT_BLOCK_END = /^\s*#c(?:omments-end|e)\b/i;

/**
 * Determines whether a position falls inside a line comment or #cs/#ce block comment.
 * @param {import('vscode').TextDocument} document - Document to check
 * @param {import('vscode').Position} position - Position to test
 * @returns {boolean} True if the position is inside a comment
 */
function isInComment(document, position) {
  const currentLine = document.lineAt(position.line);
  if (currentLine.text.charAt(currentLine.firstNonWhitespaceCharacterIndex) === ';') return true;

  let inBlock = false;
  for (let i = 0; i < position.line; i++) {
    const lineText = document.lineAt(i).text;
    if (inBlock) {
      if (COMMENT_BLOCK_END.test(lineText)) inBlock = false;
    } else if (COMMENT_BLOCK_START.test(lineText)) {
      inBlock = true;
    }
  }

  return inBlock || COMMENT_BLOCK_START.test(currentLine.text);
}

/**
 * Checks whether one range fully contains another.
 * @param {import('vscode').Range} outerRange - Candidate containing range
 * @param {import('vscode').Range} innerRange - Candidate contained range
 * @returns {boolean} True if `innerRange` lies entirely within `outerRange`
 */
function rangeContainsRange(outerRange, innerRange) {
  return (
    (outerRange.start.line < innerRange.start.line ||
      (outerRange.start.line === innerRange.start.line &&
        outerRange.start.character <= innerRange.start.character)) &&
    (outerRange.end.line > innerRange.end.line ||
      (outerRange.end.line === innerRange.end.line &&
        outerRange.end.character >= innerRange.end.character))
  );
}

/**
 * Checks whether a variable name is declared Local/Static/Dim or appears as a function parameter
 * within a function body's source text.
 * @param {string} bodyText - Source text of the function body
 * @param {string} name - Variable name to look for
 * @returns {boolean} True if the name is declared or is a parameter in `bodyText`
 */
function isLocalDeclaredInBody(bodyText, name) {
  const escaped = escapeRegexLiteral(name);
  const codeOnly = bodyText
    .split(/\r?\n/)
    .map(l => blankStrings(stripLineComment(l)))
    .join('\n');
  const declRe = new RegExp(`\\b(?:Local|Static|Dim)\\b[^\\n]*?${escaped}\\b`, 'i');
  if (declRe.test(codeOnly)) return true;
  const sigRe = new RegExp(`^\\s*(?:volatile\\s+)?Func\\b[^\\n(]*\\([^)]*${escaped}\\b`, 'i');
  return sigRe.test(codeOnly);
}

export {
  blankStrings,
  findEnclosingFunctionInDocument,
  isInComment,
  isLocalDeclaredInBody,
  rangeContainsRange,
  stringMask,
  stripLineComment,
};
