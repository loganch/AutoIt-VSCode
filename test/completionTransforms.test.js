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
  setDetail,
  signatureToHover,
  completionToHover,
  registerParenTriggerListener,
} = require('../src/completionTransforms');

describe('fillCompletions', () => {
  test('maps entries to completion items with kind, detail, and requiredInclude', () => {
    const entries = [{ label: '_ArrayDisplay', documentation: 'Displays an array' }];
    const result = fillCompletions(
      entries,
      vscode.CompletionItemKind.Function,
      ' (UDF)',
      'Array.au3',
    );

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

describe('setDetail', () => {
  test('replaces detail and appends doc text without mutating the input array', () => {
    const original = [{ label: 'a', documentation: 'orig doc' }];

    const result = setDetail(original, 'New Detail', 'Extra doc');

    expect(result).not.toBe(original);
    expect(result[0].detail).toBe('New Detail');
    expect(result[0].documentation).toBe('orig doc\n\n*Extra doc*');
    expect(original[0].detail).toBeUndefined();
  });

  test('returns an empty array for non-array input', () => {
    expect(setDetail(undefined, 'x', 'y')).toEqual([]);
  });
});

describe('completionToHover', () => {
  test('maps completion item labels to their documentation', () => {
    const completions = [
      { label: 'MsgBox', documentation: 'Displays a message box' },
      { notLabel: true },
    ];

    expect(completionToHover(completions)).toEqual({ MsgBox: 'Displays a message box' });
  });

  test('returns an empty object for non-array input', () => {
    expect(completionToHover(null)).toEqual({});
  });
});

describe('parenCommitCharacters / isParenTriggerOn', () => {
  const mockVscodeWithSetting = enabled =>
    jest.doMock('vscode', () => ({
      CompletionItemKind: { Function: 3, Variable: 6 },
      workspace: {
        getConfiguration: () => ({ get: jest.fn(() => enabled) }),
        onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
      },
    }));

  beforeEach(() => {
    jest.resetModules();
  });

  test("returns ['('] for Function kind when the paren-trigger setting is enabled", () => {
    mockVscodeWithSetting(true);
    const transforms = require('../src/completionTransforms');
    const { CompletionItemKind } = require('vscode');

    expect(transforms.isParenTriggerOn()).toBe(true);
    expect(transforms.parenCommitCharacters(CompletionItemKind.Function)).toEqual(['(']);
  });

  test('returns [] for non-Function kinds and when the setting is disabled', () => {
    mockVscodeWithSetting(false);
    const transforms = require('../src/completionTransforms');
    const { CompletionItemKind } = require('vscode');

    expect(transforms.parenCommitCharacters(CompletionItemKind.Function)).toEqual([]);
    expect(transforms.parenCommitCharacters(CompletionItemKind.Variable)).toEqual([]);
  });

  test('caches the resolved setting after the first read', () => {
    const getSpy = jest.fn(() => true);
    jest.doMock('vscode', () => ({
      CompletionItemKind: { Function: 3 },
      workspace: {
        getConfiguration: () => ({ get: getSpy }),
        onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
      },
    }));
    const { isParenTriggerOn } = require('../src/completionTransforms');

    isParenTriggerOn();
    isParenTriggerOn();

    expect(getSpy).toHaveBeenCalledTimes(1);
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
