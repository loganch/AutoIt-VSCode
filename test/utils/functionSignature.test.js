const { buildFunctionSignature, getParams } = require('../../src/utils/functionSignature');
const { REGEX_PATTERNS } = require('../../src/utils/regexPatterns');

/** Runs the real functionDefinitionRegex against source and returns the first match (with .index). */
function matchFunction(source) {
  REGEX_PATTERNS.functionDefinitionRegex.lastIndex = 0;
  return REGEX_PATTERNS.functionDefinitionRegex.exec(source);
}

describe('getParams', () => {
  test('strips ByRef from a parameter name', () => {
    const params = getParams('ByRef $arr', '', -1);
    expect(params).toHaveProperty('$arr');
    expect(params.$arr.label).toBe('$arr');
  });

  test('strips a default value from a parameter name', () => {
    const params = getParams('$flag = 0', '', -1);
    expect(Object.keys(params)).toEqual(['$flag']);
  });

  test('splits multiple comma-separated parameters', () => {
    const params = getParams('$a, $b, ByRef $c = 1', '', -1);
    expect(Object.keys(params)).toEqual(['$a', '$b', '$c']);
  });

  test("extracts a parameter's documentation from the header comment", () => {
    const text = '; $iFlag - Flags controlling the message box.\nFunc MsgBox($iFlag)\nEndFunc\n';
    const headerIndex = 0;

    const params = getParams('$iFlag', text, headerIndex);

    expect(params.$iFlag.documentation).toBe('Flags controlling the message box.');
  });

  test('returns an empty object for invalid input', () => {
    expect(getParams('', 'text', 0)).toEqual({});
    expect(getParams(null, 'text', 0)).toEqual({});
  });
});

describe('buildFunctionSignature', () => {
  test('builds a signature with a structured header block, extracting the description', () => {
    const source =
      '; Name...........: MsgBox\r\n' +
      '; Description....: Displays a message box\r\n' +
      '; Parameters ....: $iFlag - Flags\r\n' +
      'Func MsgBox($iFlag)\r\n' +
      'EndFunc\r\n';
    const functionMatch = matchFunction(source);

    const { functionName, functionObject } = buildFunctionSignature(
      functionMatch,
      source,
      'Msg.au3',
    );

    expect(functionName).toBe('MsgBox');
    expect(functionObject.description).toBe('Displays a message box');
    expect(functionObject.documentation).toBe('Displays a message box\rIncluded from Msg.au3');
    expect(functionObject.params).toHaveProperty('$iFlag');
  });

  test('falls back to consecutive comment lines above Func when there is no header block', () => {
    const source = '; A simple helper\n; that adds two numbers\nFunc Add($a, $b)\nEndFunc\n';
    const functionMatch = matchFunction(source);

    const { functionObject } = buildFunctionSignature(functionMatch, source, 'Math.au3');

    expect(functionObject.description).toBe('A simple helper\n\nthat adds two numbers');
  });

  test('handles multiple comma-separated parameters, including ByRef and defaults', () => {
    const source = 'Func Combine($a, ByRef $b, $c = 0)\nEndFunc\n';
    const functionMatch = matchFunction(source);

    const { functionObject } = buildFunctionSignature(functionMatch, source, 'Combine.au3');

    expect(Object.keys(functionObject.params)).toEqual(['$a', '$b', '$c']);
  });

  test('returns an empty signature for an invalid function match', () => {
    const { functionName, functionObject } = buildFunctionSignature(null, 'text', 'file.au3');

    expect(functionName).toBe('');
    expect(functionObject).toEqual({ label: '', description: '', documentation: '', params: {} });
  });
});
