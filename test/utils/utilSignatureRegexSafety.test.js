jest.mock('vscode', () => ({
  CompletionItemKind: {
    Function: 3,
    Variable: 6,
    Constant: 20,
  },
  MarkdownString: class {
    constructor(value = '') {
      this.value = value;
    }

    appendCodeblock() {
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

const { buildFunctionSignature, patterns } = require('../../src/util');

describe('util signature regex safety', () => {
  test('buildFunctionSignature does not throw for malformed parameter token', () => {
    const fileText = [
      '; Name...........: MyFunc',
      '; Description....: malformed param regression',
      '; Parameters.....: $UBOUND_ROWS) -1)) - rows to process',
      'Func MyFunc($UBOUND_ROWS) -1))',
      'EndFunc',
    ].join('\r\n');

    const functionMatch = /** @type {RegExpExecArray} */ (
      /** @type {unknown} */ ([
        'Func MyFunc($UBOUND_ROWS) -1))',
        'MyFunc($UBOUND_ROWS) -1))',
        'MyFunc',
        '$UBOUND_ROWS) -1))',
      ])
    );
    functionMatch.index = 0;
    functionMatch.input = fileText;

    expect(() => buildFunctionSignature(functionMatch, fileText, 'regression.au3')).not.toThrow();

    const result = buildFunctionSignature(functionMatch, fileText, 'regression.au3');
    expect(result.functionName).toBe('MyFunc');
    expect(result.functionObject.params).toHaveProperty('$UBOUND_ROWS) -1))');
  });

  test('headerRegex escapes regex metacharacters in function names', () => {
    expect(() => patterns.headerRegex('Bad)Name')).not.toThrow();
    expect(() => patterns.headerRegex('Fn[Name]+')).not.toThrow();
  });

  test('parameterDoc escapes regex metacharacters in parameter names', () => {
    expect(() => patterns.parameterDoc('UBOUND_ROWS) -1))')).not.toThrow();
    expect(() => patterns.parameterDoc('param.*+?^${}()|[]\\')).not.toThrow();
  });
});
