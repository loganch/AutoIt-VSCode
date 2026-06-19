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
    onDidChangeConfiguration: () => undefined,
  },
}));

jest.mock('../src/providers/ai_config', () => ({ findFilepath: () => undefined }));

import { signatureToCompletion, fillCompletions } from '../src/completionTransforms';

describe('signatureToCompletion requiredInclude', () => {
  test('stamps requiredInclude when detail contains #include <...>', () => {
    const signatures = {
      _ArrayDisplay: {
        documentation: 'Displays an array',
        label: '_ArrayDisplay ( $aArray )',
        params: [],
      },
    };
    const detail = '(Requires: `#include <Array.au3>`)';
    const result = signatureToCompletion(signatures, 3, detail);

    expect(result).toHaveLength(1);
    expect(result[0].requiredInclude).toBe('Array.au3');
  });

  test('does not stamp requiredInclude when detail has no #include', () => {
    const signatures = {
      MsgBox: {
        documentation: 'Displays a message box',
        label: 'MsgBox ( $iFlag, $sText )',
        params: [],
      },
    };
    const result = signatureToCompletion(signatures, 3, 'Built-in Function');

    expect(result).toHaveLength(1);
    expect(result[0].requiredInclude).toBeUndefined();
  });

  test('handles detail without angle-bracket include (e.g. Debug.au3 format)', () => {
    const signatures = {
      _DebugOut: {
        documentation: 'Debug output',
        label: '_DebugOut ( $sText )',
        params: [],
      },
    };
    const detail = '`#include <Debug.au3>`';
    const result = signatureToCompletion(signatures, 3, detail);

    expect(result[0].requiredInclude).toBe('Debug.au3');
  });
});

describe('fillCompletions requiredInclude', () => {
  test('stamps requiredInclude when requiredScript is provided', () => {
    const entries = [
      { label: '$MB_OK', documentation: 'OK button' },
      { label: '$MB_CANCEL', documentation: 'Cancel button' },
    ];
    const result = fillCompletions(entries, 13, '', 'MsgBoxConstants.au3');

    expect(result).toHaveLength(2);
    expect(result[0].requiredInclude).toBe('MsgBoxConstants.au3');
    expect(result[1].requiredInclude).toBe('MsgBoxConstants.au3');
  });

  test('does not stamp requiredInclude when requiredScript is empty', () => {
    const entries = [{ label: 'SomeKeyword', documentation: 'A keyword' }];
    const result = fillCompletions(entries, 3, 'Keyword', '');

    expect(result).toHaveLength(1);
    expect(result[0].requiredInclude).toBeUndefined();
  });
});
