import VariablePatterns from '../../src/utils/VariablePatterns.js';

describe('VariablePatterns', () => {
  let patterns;

  beforeEach(() => {
    patterns = new VariablePatterns();
  });

  test('extractVariables parses comma-separated variable names', () => {
    expect(patterns.extractVariables('$a, $b , $c')).toEqual(['$a', '$b', '$c']);
  });

  test('extractVariables filters out non-variable values and handles empty input', () => {
    expect(patterns.extractVariables('$a, abc, $b,')).toEqual(['$a', '$b']);
    expect(patterns.extractVariables('')).toEqual([]);
    expect(patterns.extractVariables(null)).toEqual([]);
  });

  test('isComment detects comment lines', () => {
    expect(patterns.isComment('; this is comment')).toBe(true);
    expect(patterns.isComment('   ; padded comment')).toBe(true);
    expect(patterns.isComment('Local $x = 1')).toBe(false);
  });

  test('removeStrings removes single and double quoted strings with AutoIt escaping', () => {
    expect(patterns.removeStrings('Local $a = "hello"')).toBe('Local $a = ""');
    expect(patterns.removeStrings("Local $a = 'Don''t'")).toBe('Local $a = ""');
    expect(patterns.removeStrings('Local $a = "He said ""hi"""')).toBe('Local $a = ""');
  });

  test('removeComments strips trailing comments', () => {
    expect(patterns.removeComments('Local $a = 1 ; comment')).toBe('Local $a = 1 ');
    expect(patterns.removeComments('Local $a = 1')).toBe('Local $a = 1');
  });

  test('cleanLine removes strings and comments together', () => {
    const input = 'Local $msg = "hello" ; trailing note';
    expect(patterns.cleanLine(input)).toBe('Local $msg = "" ');
  });

  test('core declaration regexes match expected declarations', () => {
    patterns.global.lastIndex = 0;
    patterns.local.lastIndex = 0;
    patterns.static.lastIndex = 0;
    patterns.dim.lastIndex = 0;

    expect(patterns.global.exec('Global $a, $b')?.[1]).toBe('$a, $b');
    expect(patterns.local.exec('Local $x, $y')?.[1]).toBe('$x, $y');
    expect(patterns.static.exec('Static $s1, $s2')?.[1]).toBe('$s1, $s2');
    expect(patterns.dim.exec('Dim $d1, $d2')?.[1]).toBe('$d1, $d2');
  });
});
