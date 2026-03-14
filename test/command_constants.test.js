describe('command_constants module', () => {
  test('exports expected constant values', () => {
    const constants = require('../src/command_constants.js');

    expect(constants.HOTKEY_LINE_DELAY_MS).toBe(100);
    expect(constants.KEYBINDING_DEBOUNCE_MS).toBe(200);
    expect(constants.SETTINGS_TIMEOUT_MS).toBe(2000);
    expect(constants.HOTKEY_RESET_TIMEOUT_MS).toBe(10000);
    expect(constants.STATUS_MESSAGE_DURATION_MS).toBe(1500);
    expect(constants.ERROR_MESSAGE_TIMEOUT_MS).toBe(30000);
    expect(constants.KILL_SCRIPT_INFO_TIMEOUT_MS).toBe(10000);
    expect(constants.NO_BREAK_SPACE).toBe('\u00A0');
    expect(constants.OUTPUT_NAME_TEMPLATE).toBe('extension-output-${publisher}.${name}-#');
  });
});
