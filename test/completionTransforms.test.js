jest.mock('vscode', () => ({
  CompletionItemKind: {
    Function: 3,
    Variable: 6,
    Constant: 13,
  },
  MarkdownString: class {
    constructor(value = '') {
      this.value = value;
    }
    appendCodeblock(text) {
      this.value += `\n\`\`\`\n${text}\n\`\`\``;
      return this;
    }
  },
  workspace: {
    getConfiguration: () => ({
      get: () => undefined,
      update: () => undefined,
    }),
    onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
  },
}));

const vscode = require('vscode');
const {
  fillCompletions,
  signatureToHover,
  registerParenTriggerListener,
} = require('../src/completionTransforms');

describe('fillCompletions', () => {
  test('maps entries to completion items with kind, detail, and requiredInclude', () => {
    const entries = [{ label: '_ArrayDisplay', documentation: 'Displays an array' }];
    const result = fillCompletions(entries, vscode.CompletionItemKind.Function, ' (UDF)', 'Array.au3');

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('_ArrayDisplay');
    expect(result[0].kind).toBe(vscode.CompletionItemKind.Function);
    expect(result[0].detail).toBe(' (UDF)');
    expect(result[0].requiredInclude).toBe('Array.au3');
    expect(result[0].documentation.value).toContain('#include <Array.au3>');
  });

  test('drops invalid entries instead of passing them through', () => {
    const entries = [{ label: 'valid', documentation: 'ok' }, { notLabel: true }, null];
    const result = fillCompletions(entries, vscode.CompletionItemKind.Variable);

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('valid');
  });

  test('returns an empty array for non-array input', () => {
    expect(fillCompletions(undefined, vscode.CompletionItemKind.Function)).toEqual([]);
  });
});

describe('signatureToHover', () => {
  test('converts signature entries into [documentation, code block] pairs', () => {
    const signatures = {
      MsgBox: { documentation: 'Displays a message box', label: 'MsgBox ( $iFlag, $sText )' },
    };

    const result = signatureToHover(signatures);

    expect(Object.keys(result)).toEqual(['MsgBox']);
    expect(result.MsgBox[0]).toBe('Displays a message box');
    expect(result.MsgBox[1]).toBe('```\rMsgBox ( $iFlag, $sText )\r```');
  });

  test('returns an empty object for invalid input', () => {
    expect(signatureToHover(null)).toEqual({});
  });
});

describe('registerParenTriggerListener', () => {
  test('registers a configuration-change listener and returns its disposable', () => {
    const fakeDisposable = { dispose: jest.fn() };
    vscode.workspace.onDidChangeConfiguration.mockReturnValue(fakeDisposable);

    const disposable = registerParenTriggerListener();

    expect(vscode.workspace.onDidChangeConfiguration).toHaveBeenCalledTimes(1);
    expect(disposable).toBe(fakeDisposable);
  });
});
