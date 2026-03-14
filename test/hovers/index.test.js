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

import hovers from '../../src/hovers';

describe('hovers/index', () => {
  it('exports a lowercase-keyed hover map', () => {
    expect(hovers).toBeDefined();
    expect(typeof hovers).toBe('object');

    const keys = Object.keys(hovers);
    expect(keys.length).toBeGreaterThan(100);
    keys.slice(0, 20).forEach(key => {
      expect(key).toBe(key.toLowerCase());
    });
  });

  it('contains representative function, keyword, and udf hover entries', () => {
    expect(hovers.abs).toBeDefined();
    expect(hovers['#include']).toBeDefined();
    expect(hovers._arrayadd).toBeDefined();
  });
});
