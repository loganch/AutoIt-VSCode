jest.mock('vscode', () => ({
  CompletionItemKind: {
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

describe('macros signature module', () => {
  test('exports signatures, hovers and variable completions', () => {
    const { completions, default: signatures, hovers } = require('../../src/signatures/macros.js');

    expect(signatures).toEqual(expect.any(Object));
    expect(signatures['@AutoItVersion']).toEqual(
      expect.objectContaining({
        documentation: expect.any(String),
      }),
    );

    expect(hovers['@AutoItVersion']).toBeDefined();

    expect(Array.isArray(completions)).toBe(true);
    expect(completions.length).toBeGreaterThan(0);
    expect(completions[0]).toEqual(
      expect.objectContaining({
        kind: 'variable',
        label: expect.stringContaining('@'),
      }),
    );
  });
});
