/**
 * Generic input validators shared across utils. Deliberately free of fs/vscode
 * caching concerns so this module's name matches what it exports.
 */

export const validateString = (value, defaultValue = '') => {
  return typeof value === 'string' && value.length > 0 ? value.trim() : defaultValue;
};

export const isValidDocument = document => {
  return Boolean(
    document &&
      (document.uri?.fsPath || document.fileName) &&
      typeof document.getText === 'function',
  );
};
