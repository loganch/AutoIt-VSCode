/**
 * Generic input validators shared across utils. Deliberately free of fs/vscode
 * caching concerns so this module's name matches what it exports.
 */

/**
 * Validates and normalizes string input
 * @param {any} value - Value to validate
 * @param {string} [defaultValue=''] - Default value if invalid
 * @returns {string} Validated string
 */
export const validateString = (value, defaultValue = '') => {
  return typeof value === 'string' && value.length > 0 ? value.trim() : defaultValue;
};

/**
 * Validates VSCode document object
 * @param {any} document - Document to validate
 * @returns {boolean} True if valid document
 */
export const isValidDocument = document => {
  return (
    document &&
    (document.uri?.fsPath || document.fileName) &&
    typeof document.getText === 'function'
  );
};
