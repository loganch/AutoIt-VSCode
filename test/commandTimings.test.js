const EXPECTED_HOTKEY_LINE_DELAY_MS = 100;
const EXPECTED_KEYBINDING_DEBOUNCE_MS = 200;
const EXPECTED_SETTINGS_TIMEOUT_MS = 2000;
const EXPECTED_HOTKEY_RESET_TIMEOUT_MS = 10000;
const EXPECTED_STATUS_MESSAGE_DURATION_MS = 1500;
const EXPECTED_ERROR_MESSAGE_TIMEOUT_MS = 30000;
const EXPECTED_KILL_SCRIPT_INFO_TIMEOUT_MS = 10000;

describe('commandTimings module', () => {
  test('exports expected constant values', () => {
    const constants = require('../src/commandTimings.js');

    expect(constants.HOTKEY_LINE_DELAY_MS).toBe(EXPECTED_HOTKEY_LINE_DELAY_MS);
    expect(constants.KEYBINDING_DEBOUNCE_MS).toBe(EXPECTED_KEYBINDING_DEBOUNCE_MS);
    expect(constants.SETTINGS_TIMEOUT_MS).toBe(EXPECTED_SETTINGS_TIMEOUT_MS);
    expect(constants.HOTKEY_RESET_TIMEOUT_MS).toBe(EXPECTED_HOTKEY_RESET_TIMEOUT_MS);
    expect(constants.STATUS_MESSAGE_DURATION_MS).toBe(EXPECTED_STATUS_MESSAGE_DURATION_MS);
    expect(constants.ERROR_MESSAGE_TIMEOUT_MS).toBe(EXPECTED_ERROR_MESSAGE_TIMEOUT_MS);
    expect(constants.KILL_SCRIPT_INFO_TIMEOUT_MS).toBe(EXPECTED_KILL_SCRIPT_INFO_TIMEOUT_MS);
    expect(constants.NO_BREAK_SPACE).toBe('\u00A0');
    expect(constants.OUTPUT_NAME_TEMPLATE).toBe('extension-output-${publisher}.${name}-#');
  });
});
