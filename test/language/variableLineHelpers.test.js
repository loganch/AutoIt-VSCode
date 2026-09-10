import { isCommentLine, cleanLine } from '../../src/language/variable.js';

describe('isCommentLine', () => {
  test('detects comment lines', () => {
    expect(isCommentLine('; this is comment')).toBe(true);
    expect(isCommentLine('   ; padded comment')).toBe(true);
    expect(isCommentLine('Local $x = 1')).toBe(false);
  });
});

describe('cleanLine', () => {
  test('removes string contents with AutoIt escaping', () => {
    expect(cleanLine('Local $a = "hello"')).toBe('Local $a = ""');
    expect(cleanLine("Local $a = 'Don''t'")).toBe('Local $a = ""');
    expect(cleanLine('Local $a = "He said ""hi"""')).toBe('Local $a = ""');
  });

  test('strips trailing comments', () => {
    expect(cleanLine('Local $a = 1 ; comment')).toBe('Local $a = 1 ');
    expect(cleanLine('Local $a = 1')).toBe('Local $a = 1');
  });

  test('removes strings and comments together', () => {
    const input = 'Local $msg = "hello" ; trailing note';
    expect(cleanLine(input)).toBe('Local $msg = "" ');
  });
});
