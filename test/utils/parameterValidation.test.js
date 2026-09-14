const {
  validateParameter,
  validateParameterString,
} = require('../../src/utils/parameterValidation');

describe('validateParameter', () => {
  test('returns no warnings for falsy or non-string input', () => {
    expect(validateParameter('')).toEqual({ hasWarnings: false, sanitized: '', warnings: [] });
    expect(validateParameter(null)).toEqual({ hasWarnings: false, sanitized: '', warnings: [] });
    expect(validateParameter(undefined)).toEqual({
      hasWarnings: false,
      sanitized: '',
      warnings: [],
    });
    expect(validateParameter(42)).toEqual({ hasWarnings: false, sanitized: '', warnings: [] });
  });

  test('returns no warnings for a whitespace-only parameter', () => {
    expect(validateParameter('   ')).toEqual({ hasWarnings: false, sanitized: '', warnings: [] });
  });

  test('returns no warnings and trims a plain benign parameter', () => {
    expect(validateParameter('  hello  ')).toEqual({
      hasWarnings: false,
      sanitized: 'hello',
      warnings: [],
    });
  });

  test('flags null bytes', () => {
    const result = validateParameter('foo\0bar');
    expect(result.hasWarnings).toBe(true);
    expect(result.warnings).toContain('Contains null bytes');
  });

  test.each([';', '|', '&', '$', '`', '<', '>', '(', ')', '[', ']', '{', '}', '*', '?', '\\'])(
    'flags the shell metacharacter %s',
    char => {
      const result = validateParameter(`foo${char}bar`);
      expect(result.hasWarnings).toBe(true);
      expect(result.warnings.some(w => w.startsWith('Contains shell metacharacters'))).toBe(true);
    },
  );

  test('flags forward-slash path traversal', () => {
    const result = validateParameter('../secret');
    expect(result.hasWarnings).toBe(true);
    expect(result.warnings).toContain('Contains path traversal pattern (../)');
  });

  test('flags backslash path traversal', () => {
    const result = validateParameter('..\\secret');
    expect(result.hasWarnings).toBe(true);
    expect(result.warnings).toContain('Contains path traversal pattern (../)');
  });

  test('flags control characters', () => {
    const result = validateParameter('foo\x01bar');
    expect(result.hasWarnings).toBe(true);
    expect(result.warnings).toContain('Contains control characters');
  });

  test('does not flag newline or tab as control characters', () => {
    const result = validateParameter('foo\tbar\nbaz');
    expect(result.hasWarnings).toBe(false);
  });

  test('collects multiple warnings for a parameter with several issues', () => {
    const result = validateParameter('../foo;bar\0');
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        'Contains null bytes',
        'Contains control characters',
        'Contains path traversal pattern (../)',
        expect.stringContaining('shell metacharacters'),
      ]),
    );
  });
});

describe('validateParameterString', () => {
  test('returns no warnings for falsy or non-string input', () => {
    expect(validateParameterString('')).toEqual({
      hasWarnings: false,
      sanitized: [],
      warnings: [],
    });
    expect(validateParameterString(null)).toEqual({
      hasWarnings: false,
      sanitized: [],
      warnings: [],
    });
    expect(validateParameterString(undefined)).toEqual({
      hasWarnings: false,
      sanitized: [],
      warnings: [],
    });
  });

  test('splits space-separated parameters', () => {
    const result = validateParameterString('foo bar baz');
    expect(result.sanitized).toEqual(['foo', 'bar', 'baz']);
    expect(result.hasWarnings).toBe(false);
  });

  test('preserves quoted strings as a single parameter, including internal spaces', () => {
    const result = validateParameterString('"hello world" foo');
    expect(result.sanitized).toEqual(['hello world', 'foo']);
  });

  test('collapses repeated spaces outside quotes without producing empty parameters', () => {
    const result = validateParameterString('foo   bar');
    expect(result.sanitized).toEqual(['foo', 'bar']);
  });

  test('reports a warning naming the offending parameter when a param is dangerous', () => {
    const result = validateParameterString('safe ../etc/passwd');
    expect(result.hasWarnings).toBe(true);
    expect(result.warnings[0]).toContain('../etc/passwd');
    expect(result.warnings[0]).toContain('path traversal');
  });
});
