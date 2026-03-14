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

jest.mock('../../src/ai_config', () => ({
  __esModule: true,
  default: {
    findFilepath: jest.fn(() => ''),
  },
}));

const resolveDefault = moduleExports => moduleExports.default ?? moduleExports;

describe('general completion modules', () => {
  test('mainFunctions exports function completions', () => {
    const items = resolveDefault(require('../../src/completions/mainFunctions.js'));

    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toEqual(
      expect.objectContaining({
        kind: 'function',
        label: expect.any(String),
      }),
    );
  });

  test('udf_WinAPITheme exports function completions', () => {
    const items = resolveDefault(require('../../src/completions/udf_WinAPITheme.js'));

    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toEqual(
      expect.objectContaining({
        kind: 'function',
        label: expect.stringContaining('_WinAPI_'),
      }),
    );
  });

  test('directives exports multiple directive completion sets and hovers', () => {
    const directivesModule = require('../../src/completions/directives.js');

    expect(Array.isArray(directivesModule.default)).toBe(true);
    expect(directivesModule.default.length).toBeGreaterThan(0);
    expect(Array.isArray(directivesModule.au3StripperDirectivesCompletionItems)).toBe(true);
    expect(Array.isArray(directivesModule.au3CheckDirectivesCompletionItems)).toBe(true);
    expect(Array.isArray(directivesModule.versioningDirectivesCompletionItems)).toBe(true);

    const firstDirective = directivesModule.default[0];
    expect(firstDirective).toEqual(
      expect.objectContaining({
        kind: 'keyword',
        label: expect.stringContaining('#AutoIt3Wrapper_'),
      }),
    );
  });

  test('completions index exports merged completion list', () => {
    const items = resolveDefault(require('../../src/completions/index.js'));

    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(100);

    const labels = items.map(item => item.label);
    expect(labels).toContain('#AutoIt3Wrapper_testing');
    expect(labels.some(label => String(label).toLowerCase().includes('winapi'))).toBe(true);
  });
});
