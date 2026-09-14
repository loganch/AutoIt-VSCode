import { REGEX_PATTERNS as CORE_REGEX_PATTERNS } from './coreConstants';

/**
 * Escapes special regex metacharacters in a dynamic string so it can be used
 * safely as a literal inside RegExp constructors.
 * @param {any} value - Value to escape
 * @returns {string} Escaped regex-safe string
 */
export const escapeRegexLiteral = value => {
  if (typeof value !== 'string') return '';
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Cached regex patterns to avoid recreation, extending the frozen core set
// with patterns specific to include resolution and signature/header parsing.
// Static patterns only; regex-building functions live below as their own
// exports so this table's values are all RegExp, never a mix of RegExp and
// (string) => RegExp.
export const REGEX_PATTERNS = Object.freeze({
  ...CORE_REGEX_PATTERNS,
  includePattern: /^#include\s+"([^"]+)"/gm,
  relativeInclude: /^\s*#include\s+"([^"]+)"/gm,
  libraryInclude: /^\s*#include\s+<([^>]+)>/gm,
  libraryIncludePattern: /^#include\s+<([\w.]+\.au3)>/gm,
  functionDefinitionRegex: /^[\t ]*(?:volatile[\t ]+)?Func[\t ]+((\w+)[\t ]*\((.*)\))/gim,
  hasAngleBrackets: /^<.+>$/,
  hasQuotes: /^".+"$/,
  windowsDriveLetter: /^[A-Z]:[\\/]/,
});

/**
 * Builds a regex that finds a parameter's documentation line in a function header comment.
 * @param {string} paramEntry - Parameter name (with or without leading $)
 * @returns {RegExp|null} Regex with a `documentation` capture group, or null if paramEntry is invalid
 */
export const buildParameterDocRegex = paramEntry => {
  const normalizedParam =
    typeof paramEntry === 'string' ? paramEntry.trim().replace(/^\$/, '') : '';
  const escapedParam = escapeRegexLiteral(normalizedParam);

  if (!escapedParam) return null;

  return new RegExp(
    `;\\s*(?:Parameters\\s*\\.+:)?\\s*(?:\\$${escapedParam})\\s+-\\s(?<documentation>.+)`,
  );
};

/**
 * Builds a regex that finds a function's Name/Description header comment block.
 * @param {string} functionName - Function name to match in the header's Name field
 * @returns {RegExp|null} Regex with an optional `description` capture group, or null if functionName is invalid
 */
export const buildHeaderRegex = functionName => {
  const escapedFunctionName = escapeRegexLiteral(functionName);
  if (!escapedFunctionName) return null;

  // Allow Description to be on same line as Name OR on the next line
  return new RegExp(
    `;\\s*Name\\s*\\.+:\\s+${escapedFunctionName}\\s*` +
      `(?:(?:\\r\\n|\\n)?\\s*;\\s+Description\\s*\\.+:[ \\t]+(?<description>\\S.*))?` +
      `(?:\\r\\n|\\n|$)`,
  );
};

/**
 * Creates a new regular expression with different flags while preserving the original pattern.
 * @param {RegExp} regex - Source regular expression to copy the pattern from
 * @param {string} flags - New regex flags to apply (e.g., "gi" for global + case-insensitive)
 * @returns {RegExp} New RegExp instance with the same pattern but different flags, or /(?:)/ if either argument is invalid
 */
export const setRegExpFlags = (regex, flags) => {
  if (!(regex instanceof RegExp) || typeof flags !== 'string') {
    return /(?:)/;
  }
  return new RegExp(regex.source, flags);
};
