import { AI_CONSTANTS, AUTOIT_MODE, REGEX_PATTERNS } from '../src/utils/coreConstants';

describe('coreConstants', () => {
  test('AI_CONSTANTS lists the MsgBox constants used by snippets', () => {
    expect(AI_CONSTANTS).toEqual([
      '$MB_ICONERROR',
      '$MB_ICONINFORMATION',
      '$MB_YESNO',
      '$MB_TASKMODAL',
      '$IDYES',
      '$IDNO',
    ]);
  });

  test('AUTOIT_MODE targets the autoit language on file schemes', () => {
    expect(AUTOIT_MODE).toEqual({ language: 'autoit', scheme: 'file' });
  });

  test('REGEX_PATTERNS is frozen', () => {
    expect(Object.isFrozen(REGEX_PATTERNS)).toBe(true);
  });

  test('functionPattern matches Func declarations including Volatile', () => {
    expect('Func MyFunc($a)').toMatch(REGEX_PATTERNS.functionPattern);
    expect('  volatile Func _Hidden()').toMatch(REGEX_PATTERNS.functionPattern);
    expect('Local $x = 1').not.toMatch(REGEX_PATTERNS.functionPattern);
  });

  test('variablePattern captures variables outside strings and comments', () => {
    const source = 'Local $a = "text $notvar" ; comment $alsonot\nLocal $b';
    const matches = [...source.matchAll(REGEX_PATTERNS.variablePattern)]
      .map(m => m[1])
      .filter(Boolean);
    expect(matches).toEqual(['$a', '$b']);
  });

  test('regionPattern captures the region label', () => {
    const match = '  #region - Setup stuff'.match(REGEX_PATTERNS.regionPattern);
    expect(match?.[1]).toBe('Setup stuff');
    expect('#endregion').not.toMatch(REGEX_PATTERNS.regionPattern);
  });

  test('comment block patterns match both long and short forms', () => {
    expect('#comments-start').toMatch(REGEX_PATTERNS.commentBlockStart);
    expect('  #cs').toMatch(REGEX_PATTERNS.commentBlockStart);
    expect('#comments-end').toMatch(REGEX_PATTERNS.commentBlockEnd);
    expect('  #ce').toMatch(REGEX_PATTERNS.commentBlockEnd);
  });
});
