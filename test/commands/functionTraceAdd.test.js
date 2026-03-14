jest.mock('vscode', () => ({
  window: {
    activeTextEditor: null,
    showErrorMessage: jest.fn(),
  },
  Range: class Range {
    constructor(start, end) {
      this.start = start;
      this.end = end;
    }
  },
}));

jest.mock('../../src/commands/commandUtils', () => jest.fn(() => Promise.resolve(0)));

import functionTraceAdd from '../../src/commands/functionTraceAdd';
import searchAndReplace from '../../src/commands/commandUtils';

describe('functionTraceAdd', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const vscode = require('vscode');
    vscode.window.activeTextEditor = null;
  });

  it('shows an error when no active editor exists', async () => {
    const vscode = require('vscode');

    await functionTraceAdd();

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('No active editor');
    expect(searchAndReplace).toHaveBeenCalledWith(expect.any(RegExp));
  });

  it('replaces function declarations with appended trace lines', async () => {
    const vscode = require('vscode');
    const source = 'Func MyFunc($a)\r\n  Return $a\r\nEndFunc';

    let replacedText = '';
    const editBuilder = {
      replace: jest.fn((range, text) => {
        replacedText = text;
      }),
    };

    const document = {
      getText: jest.fn(() => source),
      positionAt: jest.fn(index => ({ index })),
    };

    vscode.window.activeTextEditor = {
      document,
      edit: jest.fn(callback => {
        callback(editBuilder);
        return Promise.resolve(true);
      }),
    };

    await functionTraceAdd();

    expect(searchAndReplace).toHaveBeenCalledWith(expect.any(RegExp));
    expect(editBuilder.replace).toHaveBeenCalled();
    expect(replacedText).toContain('ConsoleWrite(');
    expect(replacedText).toContain('MyFunc()');
    expect(replacedText).toContain(';### Trace Function');
  });
});
