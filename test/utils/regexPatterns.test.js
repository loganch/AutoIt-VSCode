const { setRegExpFlags } = require('../../src/utils/regexPatterns');

describe('regexPatterns', () => {
  test('setRegExpFlags preserves the original pattern', () => {
    const baseRegex = /autoit/i;
    const updatedRegex = setRegExpFlags(baseRegex, 'gm');

    expect(updatedRegex.source).toBe(baseRegex.source);
    expect(updatedRegex.flags).toBe('gm');
  });

  test('setRegExpFlags always returns a RegExp, even for invalid input', () => {
    expect(setRegExpFlags('not a regex', 'gm')).toBeInstanceOf(RegExp);
    expect(setRegExpFlags(/autoit/, 42)).toBeInstanceOf(RegExp);
    expect(setRegExpFlags(null, null)).toBeInstanceOf(RegExp);
  });
});
