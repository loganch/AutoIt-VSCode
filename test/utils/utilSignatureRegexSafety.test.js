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

jest.mock('../../src/providers/ai_config', () => ({
  __esModule: true,
  default: {
    findFilepath: jest.fn(() => ''),
  },
}));

const { buildFunctionSignature, getParams, patterns } = require('../../src/util');

const EXPECTED_PARAMETER_COUNT = 2;

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

  test('buildFunctionSignature leaves documentation blank when Description is empty', () => {
    const fileText = [
      '; #FUNCTION# ====================================================================================================================',
      '; Name ..........: _InRegion_B',
      '; Description ...:',
      '; Syntax ........: _InRegion_B($firstParam)',
      '; Parameters ....: $firstParam          - The first parameter',
      'Func _InRegion_B($firstParam)',
      'EndFunc',
    ].join('\r\n');

    const functionMatch = /** @type {RegExpExecArray} */ (
      /** @type {unknown} */ ([
        'Func _InRegion_B($firstParam)',
        '_InRegion_B($firstParam)',
        '_InRegion_B',
        '$firstParam',
      ])
    );
    functionMatch.index = fileText.indexOf('Func _InRegion_B');
    functionMatch.input = fileText;

    const result = buildFunctionSignature(functionMatch, fileText, 'regression.au3');

    expect(result.functionObject.documentation).not.toContain('Syntax');
    expect(result.functionObject.documentation).toBe('Included from regression.au3');
  });

  test('buildFunctionSignature uses single-line comment above Func when no header block', () => {
    const fileText = ['; Validates the user input', 'Func ValidateInput($val)', 'EndFunc'].join(
      '\r\n',
    );
    const functionMatch = /** @type {RegExpExecArray} */ (
      /** @type {unknown} */ ([
        'Func ValidateInput($val)',
        'ValidateInput($val)',
        'ValidateInput',
        '$val',
      ])
    );
    functionMatch.index = fileText.indexOf('Func ValidateInput');
    functionMatch.input = fileText;

    const result = buildFunctionSignature(functionMatch, fileText, 'test.au3');
    expect(result.functionObject.documentation).toContain('Validates the user input');
  });

  test('buildFunctionSignature concatenates multiple comment lines above Func', () => {
    const fileText = ['; First line.', '; Second line.', 'Func MyHelper($x)', 'EndFunc'].join(
      '\r\n',
    );
    const functionMatch = /** @type {RegExpExecArray} */ (
      /** @type {unknown} */ (['Func MyHelper($x)', 'MyHelper($x)', 'MyHelper', '$x'])
    );
    functionMatch.index = fileText.indexOf('Func MyHelper');
    functionMatch.input = fileText;

    const result = buildFunctionSignature(functionMatch, fileText, 'test.au3');
    expect(result.functionObject.documentation).toContain('First line.');
    expect(result.functionObject.documentation).toContain('Second line.');
  });

  test('parameterDoc escapes regex metacharacters in parameter names', () => {
    expect(() => patterns.parameterDoc('UBOUND_ROWS) -1))')).not.toThrow();
    expect(() => patterns.parameterDoc('param.*+?^${}()|[]\\')).not.toThrow();
  });

  test('buildFunctionSignature exposes description as own field on functionObject', () => {
    const fileText = ['; Cleans up resources', 'Func Cleanup()', 'EndFunc'].join('\r\n');
    const functionMatch = /** @type {RegExpExecArray} */ (
      /** @type {unknown} */ (['Func Cleanup()', 'Cleanup()', 'Cleanup', ''])
    );
    functionMatch.index = fileText.indexOf('Func Cleanup');
    functionMatch.input = fileText;

    const result = buildFunctionSignature(functionMatch, fileText, 'test.au3');
    expect(result.functionObject.description).toBe('Cleans up resources');
  });

  test('getParams handles nested defaults with commas and closing parenthesis', () => {
    const params = getParams('$name = StringFormat(")%s", "x"), ByRef $flag = Default', '', -1);

    expect(params).toHaveProperty('$name');
    expect(params).toHaveProperty('$flag');
    expect(Object.keys(params)).toHaveLength(EXPECTED_PARAMETER_COUNT);
  });
});
