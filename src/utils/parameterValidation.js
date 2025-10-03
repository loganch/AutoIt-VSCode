/**
 * Parameter validation utilities to detect potentially dangerous patterns in user parameters.
 *
 * These functions check user-supplied parameters passed to AutoIt scripts and warn
 * about potentially dangerous patterns, but allow developers to proceed.
 */

/**
 * Checks a single parameter for potentially dangerous patterns.
 *
 * Since parameters are passed after /UserParams to the user's script (not to the shell
 * or AutoIt3Wrapper), and developers often need to test how their scripts handle
 * various inputs, this function warns but doesn't block.
 *
 * Parameters are passed via Node's spawn() as an array, which prevents shell interpretation.
 * However, we still warn about patterns that could be problematic in certain contexts.
 *
 * Warning patterns:
 * - Shell metacharacters for command chaining/injection: ; | & $ ` < > ( ) [ ] { }
 * - Glob/wildcards that could expand: * ?
 * - Path traversal patterns: ../
 * - Control characters and null bytes
 *
 * @param {string} param - The parameter to check
 * @returns {{hasWarnings: boolean, sanitized: string, warnings: string[]}} Validation result
 */
function validateParameter(param) {
  const warnings = [];

  if (!param || typeof param !== 'string') {
    return {
      hasWarnings: false,
      sanitized: '',
      warnings: [],
    };
  }

  // Trim whitespace
  const trimmed = param.trim();

  if (trimmed.length === 0) {
    return {
      hasWarnings: false,
      sanitized: '',
      warnings: [],
    };
  }

  // Check for null bytes (common injection technique)
  if (trimmed.includes('\0')) {
    warnings.push('Contains null bytes');
  }

  // Check for shell metacharacters that could enable command injection
  // These characters allow breaking out of the command context:
  // ; (command chaining)
  // | (piping)
  // & (background/chaining)
  // $ (variable expansion in some shells)
  // ` (command substitution)
  // < > (redirection)
  // ( ) [ ] { } (grouping/subshells)
  // * ? (glob expansion)
  // \ (escape sequences - can be used to bypass filters)
  const dangerousChars = /[;|&$`\\<>()[\]{}*?]/;
  if (dangerousChars.test(trimmed)) {
    warnings.push('Contains shell metacharacters (; | & $ ` \\ < > ( ) [ ] { } * ?)');
  }

  // Check for path traversal patterns
  if (trimmed.includes('../') || trimmed.includes('..\\')) {
    warnings.push('Contains path traversal pattern (../)');
  }

  // Check for control characters (except newline and tab which we reject)
  // eslint-disable-next-line no-control-regex
  const controlChars = /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/;
  if (controlChars.test(trimmed)) {
    warnings.push('Contains control characters');
  }

  return {
    hasWarnings: warnings.length > 0,
    sanitized: trimmed,
    warnings,
  };
}

/**
 * Checks a parameter string containing multiple parameters for potentially dangerous patterns.
 * Parameters can be space-separated or quoted.
 *
 * @param {string} paramsString - The parameter string from configuration
 * @returns {{hasWarnings: boolean, sanitized: string[], warnings: string[]}} Validation result
 */
function validateParameterString(paramsString) {
  if (!paramsString || typeof paramsString !== 'string') {
    return {
      hasWarnings: false,
      sanitized: [],
      warnings: [],
    };
  }

  // Parse parameters by splitting on spaces, but preserve quoted strings
  // This captures ALL content including dangerous characters so we can check them
  const paramArray = [];
  let current = '';
  let inQuote = false;

  for (let i = 0; i < paramsString.length; i++) {
    const char = paramsString[i];

    if (char === '"') {
      if (inQuote) {
        // End of quoted string - add it
        paramArray.push(current);
        current = '';
        inQuote = false;
      } else {
        // Start of quoted string
        inQuote = true;
      }
    } else if (char === ' ' && !inQuote) {
      // Space outside quotes - separator
      if (current.length > 0) {
        paramArray.push(current);
        current = '';
      }
    } else {
      // Regular character
      current += char;
    }
  }

  // Add any remaining content
  if (current.length > 0) {
    paramArray.push(current);
  }

  if (paramArray.length === 0) {
    return {
      hasWarnings: false,
      sanitized: [],
      warnings: [],
    };
  }

  const sanitized = [];
  const allWarnings = [];

  for (const param of paramArray) {
    const validation = validateParameter(param);
    sanitized.push(validation.sanitized);

    if (validation.hasWarnings) {
      allWarnings.push(`Parameter "${param}": ${validation.warnings.join(', ')}`);
    }
  }

  return {
    hasWarnings: allWarnings.length > 0,
    sanitized,
    warnings: allWarnings,
  };
}

module.exports = {
  validateParameter,
  validateParameterString,
};
