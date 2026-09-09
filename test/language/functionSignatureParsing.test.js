import {
  parseFunctionBoundaries,
  parseFunctionDeclarationLine,
  parseParameterNames,
  splitTopLevel,
} from '../../src/language/functionSignatureParsing.js';

describe('splitTopLevel', () => {
  test('splits on the default comma delimiter', () => {
    expect(splitTopLevel('$a, $b, $c')).toEqual(['$a', '$b', '$c']);
  });

  test('trims whitespace around tokens', () => {
    expect(splitTopLevel('  $a ,   $b  ')).toEqual(['$a', '$b']);
  });

  test('filters out empty tokens', () => {
    expect(splitTopLevel('$a,, $b,')).toEqual(['$a', '$b']);
    expect(splitTopLevel('   ')).toEqual([]);
  });

  test('returns empty array for non-string input', () => {
    expect(splitTopLevel('')).toEqual([]);
    expect(splitTopLevel(null)).toEqual([]);
    expect(splitTopLevel(undefined)).toEqual([]);
    expect(splitTopLevel(42)).toEqual([]);
  });

  test('does not split inside nested parentheses', () => {
    expect(splitTopLevel('Foo(1, 2), Bar(3)')).toEqual(['Foo(1, 2)', 'Bar(3)']);
  });

  test('does not split inside nested brackets', () => {
    expect(splitTopLevel('$arr[1, 2], $b')).toEqual(['$arr[1, 2]', '$b']);
  });

  test('does not split inside nested braces', () => {
    expect(splitTopLevel('{a, b}, c')).toEqual(['{a, b}', 'c']);
  });

  test('does not split inside double-quoted strings', () => {
    expect(splitTopLevel('"a, b", c')).toEqual(['"a, b"', 'c']);
  });

  test('does not split inside single-quoted strings', () => {
    expect(splitTopLevel("'a, b', c")).toEqual(["'a, b'", 'c']);
  });

  test('handles doubled-quote escapes inside strings', () => {
    expect(splitTopLevel('"He said ""hi, there""", $b')).toEqual([
      '"He said ""hi, there"""',
      '$b',
    ]);
    expect(splitTopLevel("'Don''t, panic', $b")).toEqual(["'Don''t, panic'", '$b']);
  });

  test('supports a custom delimiter', () => {
    expect(splitTopLevel('$a = 1 = 2', '=')).toEqual(['$a', '1', '2']);
  });

  test('unbalanced delimiters are tolerated', () => {
    expect(splitTopLevel('Foo(1, 2')).toEqual(['Foo(1, 2']);
    expect(splitTopLevel('$arr[1, 2')).toEqual(['$arr[1, 2']);
  });
});

describe('parseFunctionDeclarationLine', () => {
  test('parses a simple Func declaration', () => {
    const result = parseFunctionDeclarationLine('Func MyFunc($a, $b)');
    expect(result).toEqual({
      functionName: 'MyFunc',
      paramsText: '$a, $b',
      paramsStartIndex: 'Func MyFunc('.length,
      closingParenIndex: 'Func MyFunc($a, $b)'.length - 1,
    });
  });

  test('parses a Volatile Func declaration', () => {
    const result = parseFunctionDeclarationLine('Volatile Func MyFunc()');
    expect(result?.functionName).toBe('MyFunc');
    expect(result?.paramsText).toBe('');
  });

  test('is case-insensitive on the Func keyword', () => {
    expect(parseFunctionDeclarationLine('func myfunc($x)')?.functionName).toBe('myfunc');
    expect(parseFunctionDeclarationLine('FUNC myfunc($x)')?.functionName).toBe('myfunc');
  });

  test('handles leading whitespace', () => {
    expect(parseFunctionDeclarationLine('   Func Indented()')?.functionName).toBe('Indented');
  });

  test('handles quoted strings and nested parens in default values', () => {
    const result = parseFunctionDeclarationLine('Func F($a = "x, (y)", $b = Default)');
    expect(result?.paramsText).toBe('$a = "x, (y)", $b = Default');
  });

  test('returns null for non-declaration lines', () => {
    expect(parseFunctionDeclarationLine('Local $x = 1')).toBeNull();
    expect(parseFunctionDeclarationLine('EndFunc')).toBeNull();
    expect(parseFunctionDeclarationLine('; Func in a comment')).toBeNull();
  });

  test('returns null for non-string input', () => {
    expect(parseFunctionDeclarationLine(null)).toBeNull();
    expect(parseFunctionDeclarationLine(undefined)).toBeNull();
    expect(parseFunctionDeclarationLine(42)).toBeNull();
  });

  test('returns null when the closing paren is missing', () => {
    expect(parseFunctionDeclarationLine('Func Broken($a')).toBeNull();
  });
});

describe('parseParameterNames', () => {
  test('parses simple parameter names', () => {
    expect(parseParameterNames('$a, $b, $c')).toEqual(['$a', '$b', '$c']);
  });

  test('strips default values', () => {
    expect(parseParameterNames('$a = 1, $b = "x"')).toEqual(['$a', '$b']);
  });

  test('strips ByRef keyword', () => {
    expect(parseParameterNames('ByRef $a, $b')).toEqual(['$a', '$b']);
  });

  test('adds dollar prefix when ensureDollarPrefix is set', () => {
    expect(parseParameterNames('a, b', true)).toEqual(['$a', '$b']);
    expect(parseParameterNames('$a, b', true)).toEqual(['$a', '$b']);
  });

  test('does not add prefix by default', () => {
    expect(parseParameterNames('a, b')).toEqual(['a', 'b']);
  });

  test('handles nested delimiters in defaults', () => {
    expect(parseParameterNames('$a = Foo(1, 2), $b')).toEqual(['$a', '$b']);
  });

  test('returns empty array for empty or invalid input', () => {
    expect(parseParameterNames('')).toEqual([]);
    expect(parseParameterNames(null)).toEqual([]);
    expect(parseParameterNames(undefined)).toEqual([]);
  });

  test('filters out blank tokens', () => {
    expect(parseParameterNames('$a, , $b')).toEqual(['$a', '$b']);
  });
});

describe('parseFunctionBoundaries', () => {
  test('extracts a single function with parameters', () => {
    const lines = ['Func Add($a, $b)', '  Return $a + $b', 'EndFunc'];
    expect(parseFunctionBoundaries(lines)).toEqual([
      {
        name: 'Add',
        startLine: 0,
        endLine: 2,
        parameters: ['$a', '$b'],
      },
    ]);
  });

  test('extracts multiple functions', () => {
    const lines = [
      'Func First()',
      'EndFunc',
      'Local $x = 1',
      'Func Second($p)',
      'EndFunc',
    ];
    const result = parseFunctionBoundaries(lines);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ name: 'First', startLine: 0, endLine: 1 });
    expect(result[1]).toMatchObject({ name: 'Second', startLine: 3, endLine: 4 });
  });

  test('propagates ensureDollarPrefix to parameters', () => {
    const lines = ['Func F(a, ByRef b)', 'EndFunc'];
    expect(parseFunctionBoundaries(lines, true)[0].parameters).toEqual(['$a', '$b']);
  });

  test('ignores EndFunc without a matching Func', () => {
    const lines = ['EndFunc', 'Func F()', 'EndFunc'];
    const result = parseFunctionBoundaries(lines);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ name: 'F', startLine: 1, endLine: 2 });
  });

  test('leaves unterminated functions out of the result', () => {
    const lines = ['Func F()', '  Return 1'];
    expect(parseFunctionBoundaries(lines)).toEqual([]);
  });

  test('matches EndFunc case-insensitively', () => {
    const lines = ['Func F()', 'ENDFUNC'];
    expect(parseFunctionBoundaries(lines)[0].endLine).toBe(1);
  });

  test('handles empty input', () => {
    expect(parseFunctionBoundaries([])).toEqual([]);
  });
});
