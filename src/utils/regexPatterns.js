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
  parameterDoc: /** @param {string} paramEntry */ paramEntry => {
    const normalizedParam =
      typeof paramEntry === 'string' ? paramEntry.trim().replace(/^\$/, '') : '';
    const escapedParam = escapeRegexLiteral(normalizedParam);

    if (!escapedParam) return /$^/;

    return new RegExp(
      `;\\s*(?:Parameters\\s*\\.+:)?\\s*(?:\\$${escapedParam})\\s+-\\s(?<documentation>.+)`,
    );
  },
  headerRegex: /** @param {string} functionName */ functionName => {
    const escapedFunctionName = escapeRegexLiteral(functionName);
    if (!escapedFunctionName) return /$^/;

    // Allow Description to be on same line as Name OR on the next line
    return new RegExp(
      `;\\s*Name\\s*\\.+:\\s+${escapedFunctionName}\\s*` +
        `(?:(?:\\r\\n|\\n)?\\s*;\\s+Description\\s*\\.+:[ \\t]+(?<description>\\S.*))?` +
        `(?:\\r\\n|\\n|$)`,
    );
  },
});

/**
 * Creates a new regular expression with different flags while preserving the original pattern.
 * @param {RegExp} regex - Source regular expression to copy the pattern from
 * @param {string} flags - New regex flags to apply (e.g., "gi" for global + case-insensitive)
 * @returns {RegExp} New RegExp instance with the same pattern but different flags, or safe default if invalid input
 */
export const setRegExpFlags = (regex, flags) => {
  if (!(regex instanceof RegExp) || typeof flags !== 'string') {
    return regex || /(?:)/;
  }
  return new RegExp(regex.source, flags);
};
