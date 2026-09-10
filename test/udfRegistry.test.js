jest.mock('vscode', () => ({
  CompletionItemKind: {
    Function: 'function',
    Keyword: 'keyword',
    Constant: 'constant',
    Variable: 'variable',
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

    appendPlaceholder(value) {
      this.value += `${value}`;
      return this;
    }

    appendText(value) {
      this.value += `${value}`;
      return this;
    }

    appendChoice(values) {
      this.value += `${Array.isArray(values) ? values.join('|') : values}`;
      return this;
    }
  },
  window: {
    showErrorMessage: jest.fn(),
  },
  workspace: {
    getConfiguration: jest.fn(() => ({
      get: jest.fn(() => false),
    })),
    onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
  },
}));

jest.mock('../src/config/ai_config', () => ({
  __esModule: true,
  default: {
    findFilepath: jest.fn(() => ''),
  },
}));

import { completions, hovers } from '../src/udfRegistry';

describe('udfRegistry', () => {
  test('aggregates a large completions list from all modules', () => {
    expect(Array.isArray(completions)).toBe(true);
    expect(completions.length).toBeGreaterThan(1000);
  });

  test('every completion item has a label', () => {
    const unlabeled = completions.filter(item => !item || !item.label);
    expect(unlabeled).toEqual([]);
  });

  test('includes keyword completions', () => {
    const labels = new Set(completions.map(item => item.label));
    expect(labels.has('And')).toBe(true);
    expect(labels.has('ByRef')).toBe(true);
  });

  test('includes UDF function completions', () => {
    const labels = new Set(completions.map(item => item.label));
    expect([...labels].some(label => typeof label === 'string' && label.startsWith('_Array'))).toBe(
      true,
    );
  });

  test('includes directive completions', () => {
    const labels = new Set(completions.map(item => item.label));
    expect([...labels].some(label => typeof label === 'string' && label.startsWith('#'))).toBe(
      true,
    );
  });

  test('aggregates a non-empty hovers map', () => {
    expect(typeof hovers).toBe('object');
    expect(Object.keys(hovers).length).toBeGreaterThan(100);
  });

  test('hover keys include known keywords and UDF functions', () => {
    expect('And' in hovers).toBe(true);
    expect(Object.keys(hovers).some(key => key.startsWith('_Array'))).toBe(true);
  });
});
