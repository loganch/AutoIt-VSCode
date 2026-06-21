/// <reference types="vscode" />
import { window } from 'vscode';

// ============================================================================
// ERROR HANDLING AND LOGGING
// ============================================================================
//
// Leaf module: depends only on the VS Code `window` API. Extracted from
// util.js so completionTransforms.js (and other focused modules) can share
// error handling without creating a cycle back through util.js.

/**
 * Centralized error handler for consistent logging and user feedback
 * @param {string} operation - The operation that failed
 * @param {Error|string} error - The error object or message
 * @param {boolean} [showUser=false] - Whether to show error to user
 * @param {any} [context] - Additional context for debugging
 */
const handleError = (operation, error, showUser = false, context = null) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const fullMessage = context
    ? `${operation}: ${errorMessage} (Context: ${JSON.stringify(context)})`
    : `${operation}: ${errorMessage}`;

  // Always log to console for debugging
  console.error(`[AutoIt Extension] ${fullMessage}`);

  // Optionally show to user (reduced verbosity)
  if (showUser) {
    window.showErrorMessage(`AutoIt: ${operation} failed`);
  }
};

/**
 * Safe wrapper for operations that might throw
 * @template T
 * @param {() => T} operation - Function to execute safely
 * @param {T} defaultValue - Default value on error
 * @param {string} operationName - Name for error logging
 * @returns {T} Result or default value
 */
const safeExecute = (operation, defaultValue, operationName) => {
  try {
    return operation();
  } catch (error) {
    handleError(operationName, error, false);
    return defaultValue;
  }
};

export { handleError, safeExecute };
