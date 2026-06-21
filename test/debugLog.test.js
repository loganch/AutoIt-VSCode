const mockGet = jest.fn();
const mockAppendLine = jest.fn();
const mockCreateOutputChannel = jest.fn(() => ({ appendLine: mockAppendLine }));

jest.mock('vscode', () => ({
  workspace: {
    getConfiguration: () => ({ get: (...args) => mockGet(...args) }),
  },
  window: {
    createOutputChannel: (...args) => mockCreateOutputChannel(...args),
  },
}));

import { debugLog } from '../src/debugLog';

describe('debugLog', () => {
  let consoleDebug;

  beforeEach(() => {
    consoleDebug = jest.spyOn(console, 'debug').mockImplementation(() => {});
    mockCreateOutputChannel.mockImplementation(() => ({ appendLine: mockAppendLine }));
  });

  afterEach(() => {
    consoleDebug.mockRestore();
  });

  test('writes to the AutoIt output channel when debugLogging is enabled', () => {
    mockGet.mockReturnValue(true);

    debugLog('hello');

    expect(mockCreateOutputChannel).toHaveBeenCalledWith('AutoIt');
    expect(mockAppendLine).toHaveBeenCalledWith('hello');
  });

  test('does nothing when debugLogging is disabled', () => {
    mockGet.mockReturnValue(false);

    debugLog('hello');

    expect(mockAppendLine).not.toHaveBeenCalled();
    expect(consoleDebug).not.toHaveBeenCalled();
  });

  test('falls back to console.debug when no output channel is available', () => {
    mockGet.mockReturnValue(true);
    mockCreateOutputChannel.mockReturnValue(undefined);

    debugLog('fallback');

    expect(consoleDebug).toHaveBeenCalledWith('fallback');
  });

  test('never throws even if reading configuration fails', () => {
    mockGet.mockImplementation(() => {
      throw new Error('boom');
    });

    expect(() => debugLog('safe')).not.toThrow();
  });
});
