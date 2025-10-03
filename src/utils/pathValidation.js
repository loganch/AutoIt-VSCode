const path = require('path');
const fs = require('fs');

/**
 * Validates that a file path is safe and doesn't contain path traversal attempts.
 * This prevents malicious paths like "../../sensitive/file" from being executed.
 *
 * @param {string} filePath - The file path to validate
 * @param {string} [workspaceRoot] - Optional workspace root to ensure file is within workspace
 * @returns {{valid: boolean, normalized: string, error?: string}} Validation result
 */
function validateFilePath(filePath, workspaceRoot = null) {
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

  // If workspace root is provided, ensure the file is within the workspace
  if (workspaceRoot) {
    const normalizedRoot = path.normalize(workspaceRoot);
    const resolved = path.resolve(normalizedRoot, normalized);

    // Ensure the resolved path is within the workspace
    if (!resolved.startsWith(normalizedRoot)) {
      return {
        valid: false,
        normalized,
        error: 'Invalid file path: path traversal detected (outside workspace)',
      };
    }
  }

  // Additional check: ensure no upward traversal in the original path
  // that would escape the working directory
  if (filePath.includes('..') && workspaceRoot) {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(workspaceRoot, filePath);
    const normalizedAbsolute = path.normalize(absolutePath);

    if (!normalizedAbsolute.startsWith(path.normalize(workspaceRoot))) {
      return {
        valid: false,
        normalized,
        error: 'Invalid file path: path traversal detected (upward directory traversal)',
      };
    }
  }

  return { valid: true, normalized };
}

/**
 * Validates that a file exists and is accessible
 * @param {string} filePath - The file path to check
 * @returns {boolean} True if file exists and is accessible
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

/**
 * Validates that an executable path is safe to run
 * Checks for path traversal and ensures the file exists
 *
 * @param {string} execPath - The executable path to validate
 * @param {string} [allowedDir] - Optional directory where executable must reside
 * @returns {{valid: boolean, normalized: string, error?: string}} Validation result
 */
function validateExecutablePath(execPath, allowedDir = null) {
  const validation = validateFilePath(execPath, allowedDir);

  if (!validation.valid) {
    return validation;
  }

  // Check if executable exists
  if (!fileExists(validation.normalized)) {
    return {
      valid: false,
      normalized: validation.normalized,
      error: 'Invalid executable path: file does not exist',
    };
  }

  return validation;
}

module.exports = {
  validateFilePath,
  validateExecutablePath,
  fileExists,
};
