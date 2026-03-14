jest.mock('vscode', () => ({
  CompletionItemKind: {
    Function: 'function',
    Constant: 'constant',
    Keyword: 'keyword',
  },
  MarkdownString: class MarkdownString {
    constructor(value = '') {
      this.value = value;
    }

    appendCodeblock(code, language) {
      this.codeblock = { code, language };
      return this;
    }
  },
  SnippetString: class SnippetString {
    constructor(value = '') {
      this.value = value;
    }

    appendText(text) {
      this.value += text;
      return this;
    }

    appendPlaceholder(text) {
      this.value += text;
      return this;
    }

    appendChoice(choices) {
      this.value += choices.join('|');
      return this;
    }
  },
  workspace: {
    getConfiguration: jest.fn(() => ({
      get: jest.fn(() => false),
    })),
    onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
  },
}));

jest.mock('../../src/ai_config', () => ({
  __esModule: true,
  default: {
    findFilepath: jest.fn(() => ''),
  },
}));

import signatures from '../../src/signatures';

describe('signatures/index', () => {
  it('exports a merged signatures object', () => {
    expect(signatures).toBeDefined();
    expect(typeof signatures).toBe('object');
  });

  it('contains representative core and UDF signatures', () => {
    expect(signatures.Abs).toBeDefined();
    expect(signatures._ArrayAdd).toBeDefined();
    expect(signatures._DebugSetup).toBeDefined();
  });

  it('contains keyword signatures', () => {
    expect(signatures['#include']).toBeDefined();
    expect(signatures.If).toBeDefined();
  });

  it('contains many entries from merged modules', () => {
    expect(Object.keys(signatures).length).toBeGreaterThan(200);
  });
});
