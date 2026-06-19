/**
 * @fileoverview Constants extracted from ai_commands.js to improve maintainability and readability.
 * This module contains magic numbers and hardcoded values used throughout the application.
 */

/**
 * Delay for incomplete line processing in milliseconds.
 * Used to buffer incomplete output lines before displaying them.
 * @type {number}
 */
const HOTKEY_LINE_DELAY_MS = 100;

/**
 * Debounce time for keybinding file reads in milliseconds.
 * Prevents excessive file system operations when keybindings are updated.
 * @type {number}
 */
const KEYBINDING_DEBOUNCE_MS = 200;

/**
 * Timeout for settings initialization in milliseconds.
 * Allows time for settings to be properly loaded and applied.
 * @type {number}
 */
const SETTINGS_TIMEOUT_MS = 2000;

/**
 * Fallback timeout for hotkey reset in milliseconds.
 * Ensures hotkeys are reset even if the normal reset process fails.
 * @type {number}
 */
const HOTKEY_RESET_TIMEOUT_MS = 10000;

/**
 * Duration for status bar messages in milliseconds.
 * Controls how long informational messages are displayed in the status bar.
 * @type {number}
 */
const STATUS_MESSAGE_DURATION_MS = 1500;

/**
 * Timeout for error messages in milliseconds.
 * Determines how long error notifications remain visible to the user.
 * @type {number}
 */
const ERROR_MESSAGE_TIMEOUT_MS = 30000;

/**
 * Timeout for kill script info messages in milliseconds.
 * Sets the duration for informational messages related to script termination.
 * @type {number}
 */
const KILL_SCRIPT_INFO_TIMEOUT_MS = 10000;

/**
 * Unicode character for non-breaking space.
 * Used for spacing in output formatting to avoid unwanted line breaks.
 * @type {string}
 */
const NO_BREAK_SPACE = '\u00A0';

/**
 * Template for output channel naming.
 * Used to generate unique names for output channels based on publisher and extension name.
 * @type {string}
 */
const OUTPUT_NAME_TEMPLATE = 'extension-output-${publisher}.${name}-#';

export {
  HOTKEY_LINE_DELAY_MS,
  KEYBINDING_DEBOUNCE_MS,
  SETTINGS_TIMEOUT_MS,
  HOTKEY_RESET_TIMEOUT_MS,
  STATUS_MESSAGE_DURATION_MS,
  ERROR_MESSAGE_TIMEOUT_MS,
  KILL_SCRIPT_INFO_TIMEOUT_MS,
  NO_BREAK_SPACE,
  OUTPUT_NAME_TEMPLATE,
};
