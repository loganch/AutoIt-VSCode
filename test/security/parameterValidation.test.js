/**
 * Security tests for parameter validation warnings.
 *
 * These tests ensure that potentially dangerous parameter patterns are detected
 * and warned about, while still allowing developers to proceed with their testing.
 */

const {
  validateParameter,
  validateParameterString,
} = require('../../src/utils/parameterValidation');

describe('Parameter Validation - Security Warning Tests', () => {
  describe('validateParameter', () => {
    describe('Safe parameters (no warnings)', () => {
      test('should accept simple alphanumeric parameter', () => {
        const result = validateParameter('param123');
        expect(result.hasWarnings).toBe(false);
        expect(result.sanitized).toBe('param123');
        expect(result.warnings).toEqual([]);
      });

      test('should accept parameter with hyphens', () => {
        const result = validateParameter('my-parameter-name');
        expect(result.hasWarnings).toBe(false);
        expect(result.sanitized).toBe('my-parameter-name');
      });

      test('should accept parameter with spaces', () => {
        const result = validateParameter('my param value');
        expect(result.hasWarnings).toBe(false);
        expect(result.sanitized).toBe('my param value');
      });

      test('should accept negative numbers', () => {
        const result = validateParameter('-123');
        expect(result.hasWarnings).toBe(false);
        expect(result.sanitized).toBe('-123');
      });

      test('should accept flags', () => {
        const result = validateParameter('-q');
        expect(result.hasWarnings).toBe(false);
        expect(result.sanitized).toBe('-q');
      });

      test('should accept file paths', () => {
        const result = validateParameter('C:/path/to/file.txt');
        expect(result.hasWarnings).toBe(false);
        expect(result.sanitized).toBe('C:/path/to/file.txt');
      });
    });

    describe('Potentially dangerous patterns (warnings)', () => {
      test('should warn about semicolon', () => {
        const result = validateParameter('param; calc.exe');
        expect(result.hasWarnings).toBe(true);
        expect(result.warnings[0]).toContain('shell metacharacters');
      });

      test('should warn about pipe', () => {
        const result = validateParameter('param | calc.exe');
        expect(result.hasWarnings).toBe(true);
        expect(result.warnings[0]).toContain('shell metacharacters');
      });

      test('should warn about path traversal', () => {
        const result = validateParameter('../../../etc/passwd');
        expect(result.hasWarnings).toBe(true);
        expect(result.warnings).toContainEqual(expect.stringContaining('path traversal'));
      });

      test('should warn about null byte', () => {
        const result = validateParameter('param\0malicious');
        expect(result.hasWarnings).toBe(true);
        expect(result.warnings).toContainEqual(expect.stringContaining('null bytes'));
      });
    });
  });

  describe('validateParameterString', () => {
    describe('Safe parameter strings (no warnings)', () => {
      test('should accept AutoIt3Wrapper-style flags', () => {
        const result = validateParameterString('-q -d -w 1 -w 2 --verbose /run');
        expect(result.hasWarnings).toBe(false);
        expect(result.sanitized).toEqual(['-q', '-d', '-w', '1', '-w', '2', '--verbose', '/run']);
      });

      test('should accept quoted parameters', () => {
        const result = validateParameterString('"first param" "second param"');
        expect(result.hasWarnings).toBe(false);
        expect(result.sanitized).toEqual(['first param', 'second param']);
      });
    });

    describe('Potentially dangerous parameter strings (warnings)', () => {
      test('should warn about shell metacharacters', () => {
        const result = validateParameterString('param1; calc.exe');
        expect(result.hasWarnings).toBe(true);
        expect(result.warnings.length).toBeGreaterThan(0);
      });

      test('should warn about command chaining', () => {
        const result = validateParameterString('normal_param && calc.exe');
        expect(result.hasWarnings).toBe(true);
        expect(result.warnings[0]).toContain('shell metacharacters');
      });

      test('should still return sanitized parameters with warnings', () => {
        const result = validateParameterString('param1 "test; ls"');
        expect(result.hasWarnings).toBe(true);
        expect(result.sanitized).toEqual(['param1', 'test; ls']);
      });
    });
  });
});
