jest.mock('vscode', () => ({
  window: {
    showErrorMessage: jest.fn(),
  },
}));

import { window } from 'vscode';
import { handleError, safeExecute } from '../src/errorUtils';

describe('handleError', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('logs Error instances using their message, with the original error as a second arg', () => {
    const error = new Error('boom');
    handleError('parseFile', error);
    expect(consoleErrorSpy).toHaveBeenCalledWith('[AutoIt Extension] parseFile: boom', error);
  });

  test('stringifies non-Error values without a second console.error argument', () => {
    handleError('parseFile', 'plain failure');
    expect(consoleErrorSpy).toHaveBeenCalledWith('[AutoIt Extension] parseFile: plain failure');
  });

  test('appends JSON context when provided', () => {
    const error = new Error('boom');
    handleError('parseFile', error, false, { line: 3 });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[AutoIt Extension] parseFile: boom (Context: {"line":3})',
      error,
    );
  });

  test('does not notify the user by default', () => {
    handleError('parseFile', new Error('boom'));
    expect(window.showErrorMessage).not.toHaveBeenCalled();
  });

  test('shows a user-facing message when showUser is true', () => {
    handleError('parseFile', new Error('boom'), true);
    expect(window.showErrorMessage).toHaveBeenCalledWith('AutoIt: parseFile failed');
  });
});

describe('safeExecute', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('returns the operation result on success', () => {
    expect(safeExecute('compute', () => 42, 0)).toBe(42);
  });

  test('returns the default value and logs when the operation throws', () => {
    const result = safeExecute(
      'riskyOp',
      () => {
        throw new Error('kaboom');
      },
      'fallback',
    );
    expect(result).toBe('fallback');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[AutoIt Extension] riskyOp: kaboom',
      expect.any(Error),
    );
  });
});
