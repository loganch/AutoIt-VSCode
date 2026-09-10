import { escapeRegexLiteral } from '../utils/regexPatterns';

// ============================================================================
// VARIABLE DECLARATION MATCHING (single source of truth)
// ============================================================================
//
// Canonical "is this line a variable definition site" matcher, shared by the
// same-document scan in ai_definition.js and the warm symbol index in
// services/symbolIndex.js. Keeping the template + keywords here (rather than
// in ai_definition.js) lets symbolIndex reuse them without an import cycle
// (ai_definition imports symbolIndex, so symbolIndex must not import
// ai_definition).
//
// VARIABLE_PATTERN_TEMPLATE - simple, O(n) per line:
//   ^[ \t]*                                    leading whitespace
//   (?:(?:{keywords})[ \t]+(?:.*,[ \t]*)?)?   optional declaration keyword;
//                                              when present, greedily skips
//                                              any leading comma-separated
//                                              siblings with one backtrack pass
//   ({escaped})\b                              the actual target variable
export const VARIABLE_KEYWORDS = ['Local', 'Global', 'Const'];
export const VARIABLE_PATTERN_TEMPLATE =
  '^[ \\t]*(?:(?:{keywords})[ \\t]+(?:.*,[ \\t]*)?)?({escaped})\\b';
export const VARIABLE_REGEX_FLAGS = 'mi';

/**
 * Build the canonical variable-definition regex for a given variable name.
 * Used by both ai_definition.js (createVariableRegex) and symbolIndex.js so the
 * "is this a declaration site" semantics live in exactly one place.
 * @param {string} variableName - Variable name (including the leading `$`).
 * @returns {RegExp} Compiled regex (case-insensitive, multiline).
 */
export const buildVariableRegex = variableName => {
  const escaped = escapeRegexLiteral(variableName);
  const keywords = VARIABLE_KEYWORDS.join('|');
  const pattern = VARIABLE_PATTERN_TEMPLATE.replace('{keywords}', keywords).replace(
    '{escaped}',
    escaped,
  );
  return new RegExp(pattern, VARIABLE_REGEX_FLAGS);
};

/**
 * Returns true iff `lineText` is a definition site for `variableName`, using the
 * same pattern semantics as ai_definition's createVariableRegex. A bare usage
 * (e.g. `ConsoleWrite($g_Config & @CRLF)`) is NOT a declaration.
 * @param {string} lineText - The source line to test.
 * @param {string} variableName - Variable name (including the leading `$`).
 * @returns {boolean}
 */
export const isVariableDeclarationLine = (lineText, variableName) => {
  if (typeof lineText !== 'string' || !variableName || typeof variableName !== 'string') {
    return false;
  }
  return buildVariableRegex(variableName).test(lineText);
};

// ============================================================================
// LINE CLEANING HELPERS
// ============================================================================
// Used by VariableParser to strip noise (comments, string contents) before
// matching declaration keywords against a line.

const COMMENT_PATTERN = /^\s*;/;
// AutoIt string pattern: handles double-character escaping ("" or '')
// Matches: "He said ""hello""" and 'Don''t'
const STRING_PATTERN = /"(?:[^"]|"")*"|'(?:[^']|'')*'/g;

/**
 * @param {string} line - The line to check
 * @returns {boolean} True if the line is a comment
 */
export const isCommentLine = line => COMMENT_PATTERN.test(line);

/**
 * Remove comments and string contents from a line so pattern matching
 * doesn't trip on `;` or quote characters inside them.
 * @param {string} line - The line to clean
 * @returns {string} Cleaned line
 */
export const cleanLine = line => {
  const withoutStrings = line.replace(STRING_PATTERN, '""');
  const commentIdx = withoutStrings.indexOf(';');
  return commentIdx !== -1 ? withoutStrings.substring(0, commentIdx) : withoutStrings;
};
