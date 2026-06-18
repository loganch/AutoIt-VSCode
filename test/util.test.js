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

jest.mock('../src/ai_config', () => ({ findFilepath: () => undefined }));

import { signatureToCompletion } from '../src/util';

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
