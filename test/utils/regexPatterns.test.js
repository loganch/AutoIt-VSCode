const { setRegExpFlags } = require('../../src/utils/regexPatterns');

describe('regexPatterns', () => {
  test('setRegExpFlags preserves the original pattern', () => {
    const baseRegex = /autoit/i;
    const updatedRegex = setRegExpFlags(baseRegex, 'gm');

    expect(updatedRegex.source).toBe(baseRegex.source);
    expect(updatedRegex.flags).toBe('gm');
  });
});
