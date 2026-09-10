import path from 'path';
import { safeFileExists } from './fsCache';

/**
 * Validates that a file path is well-formed: a non-empty string, normalized,
 * and free of null bytes. Does not enforce workspace/directory containment —
 * no caller currently restricts paths to a workspace root.
 *
 * @param {string} filePath - The file path to validate
 * @returns {{valid: boolean, normalized: string, error?: string}} Validation result
 */
function validateFilePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return {
      valid: false,
      normalized: '',
      error: 'Invalid file path: path is empty or not a string',
    };
  }

  // Normalize the path to resolve any .. or . segments
  const normalized = path.normalize(filePath);

  // Check for null bytes (common in path traversal attacks)
  if (normalized.includes('\0')) {
    return { valid: false, normalized, error: 'Invalid file path: contains null bytes' };
  }

  return { valid: true, normalized };
}

/**
 * Validates that an executable path is well-formed and that the file exists.
 * Does not enforce directory containment — no caller currently restricts
 * executables to an allowed directory.
 *
 * @param {string} execPath - The executable path to validate
 * @returns {{valid: boolean, normalized: string, error?: string}} Validation result
 */
function validateExecutablePath(execPath) {
  const validation = validateFilePath(execPath);

  if (!validation.valid) {
    return validation;
  }

  // Check if executable exists
  if (!safeFileExists(validation.normalized)) {
    return {
      valid: false,
      normalized: validation.normalized,
      error: 'Invalid executable path: file does not exist',
    };
  }

  return validation;
}

export { validateFilePath, validateExecutablePath, safeFileExists as fileExists };
