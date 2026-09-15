const {
  setRegExpFlags,
  escapeRegexLiteral,
  buildParameterDocRegex,
  buildHeaderRegex,
} = require('../../src/utils/regexPatterns');

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

describe('escapeRegexLiteral', () => {
  test('escapes every regex metacharacter', () => {
    expect(escapeRegexLiteral('.*+?^${}()|[]\\')).toBe(
      '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\',
    );
  });

  test('leaves a plain string unchanged', () => {
    expect(escapeRegexLiteral('_ArrayDisplay')).toBe('_ArrayDisplay');
  });

  test('returns an empty string for non-string input', () => {
    expect(escapeRegexLiteral(undefined)).toBe('');
    expect(escapeRegexLiteral(null)).toBe('');
    expect(escapeRegexLiteral(42)).toBe('');
  });
});

describe('buildParameterDocRegex', () => {
  test('matches a parameter documentation line, capturing the documentation', () => {
    const regex = buildParameterDocRegex('$iFlag');
    const match = regex.exec('; $iFlag - Flags controlling the message box.');

    expect(match.groups.documentation).toBe('Flags controlling the message box.');
  });

  test('normalizes a leading $ and trims whitespace from the param name', () => {
    const withDollar = buildParameterDocRegex('$sText');
    const withoutDollar = buildParameterDocRegex('  sText  ');

    expect(withDollar.source).toBe(withoutDollar.source);
  });

  test('escapes regex metacharacters in the parameter name', () => {
    const regex = buildParameterDocRegex('$a.b');
    expect(regex.test('; $aXb - should not match')).toBe(false);
    expect(regex.test('; $a.b - should match')).toBe(true);
  });

  test('returns null for an invalid parameter name', () => {
    expect(buildParameterDocRegex('')).toBeNull();
    expect(buildParameterDocRegex('   ')).toBeNull();
    expect(buildParameterDocRegex(null)).toBeNull();
  });
});

describe('buildHeaderRegex', () => {
  test('matches a Name/Description header on the same line', () => {
    const regex = buildHeaderRegex('_ArrayDisplay');
    const match = regex.exec(
      '; Name...........: _ArrayDisplay\r\n; Description....: Displays an array\r\n',
    );

    expect(match).not.toBeNull();
    expect(match.groups.description).toBe('Displays an array');
  });

  test('matches a Name header with no Description present', () => {
    const regex = buildHeaderRegex('_ArrayDisplay');
    const match = regex.exec('; Name...........: _ArrayDisplay\n');

    expect(match).not.toBeNull();
    expect(match.groups.description).toBeUndefined();
  });

  test('escapes regex metacharacters in the function name', () => {
    const regex = buildHeaderRegex('_Array.Display');
    expect(regex.test('; Name...........: _ArrayXDisplay\n')).toBe(false);
    expect(regex.test('; Name...........: _Array.Display\n')).toBe(true);
  });

  test('returns null for an invalid function name', () => {
    expect(buildHeaderRegex('')).toBeNull();
    expect(buildHeaderRegex(null)).toBeNull();
  });
});
