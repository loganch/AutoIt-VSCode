import {
  DEFAULT_UDFS,
  DEFAULT_MAX_INCLUDE_DEPTH,
  DEFAULT_PARSE_DEBOUNCE_MS,
  FORMATTER,
} from '../src/constants';

describe('constants', () => {
  describe('DEFAULT_UDFS', () => {
    it('is an array', () => {
      expect(Array.isArray(DEFAULT_UDFS)).toBe(true);
    });

    it('contains expected UDF names', () => {
      expect(DEFAULT_UDFS).toContain('Array');
      expect(DEFAULT_UDFS).toContain('Math');
      expect(DEFAULT_UDFS).toContain('WinAPI');
      expect(DEFAULT_UDFS).toContain('String');
      expect(DEFAULT_UDFS).toContain('File');
    });

    it('has more than 50 entries', () => {
      expect(DEFAULT_UDFS.length).toBeGreaterThan(50);
    });

    it('contains only strings', () => {
      DEFAULT_UDFS.forEach(udf => expect(typeof udf).toBe('string'));
    });
  });

  describe('FORMATTER', () => {
    it('defines TEMP_FILE_PREFIX', () => {
      expect(typeof FORMATTER.TEMP_FILE_PREFIX).toBe('string');
    });

    it('defines BACKUP_DIR_NAME', () => {
      expect(typeof FORMATTER.BACKUP_DIR_NAME).toBe('string');
    });

    it('defines BACKUP_FILE_SUFFIX', () => {
      expect(typeof FORMATTER.BACKUP_FILE_SUFFIX).toBe('string');
    });

    it('defines BACKUP_FILE_SUFFIX_PATTERN as a RegExp', () => {
      expect(FORMATTER.BACKUP_FILE_SUFFIX_PATTERN).toBeInstanceOf(RegExp);
    });

    it('BACKUP_FILE_SUFFIX_PATTERN matches backup filenames', () => {
      expect(FORMATTER.BACKUP_FILE_SUFFIX_PATTERN.test('script_old1.au3')).toBe(true);
      expect(FORMATTER.BACKUP_FILE_SUFFIX_PATTERN.test('script_old42.au3')).toBe(true);
      expect(FORMATTER.BACKUP_FILE_SUFFIX_PATTERN.test('script.au3')).toBe(false);
    });

    it('defines TIDY_TIMEOUT_MS as a positive number', () => {
      expect(typeof FORMATTER.TIDY_TIMEOUT_MS).toBe('number');
      expect(FORMATTER.TIDY_TIMEOUT_MS).toBeGreaterThan(0);
    });

    it('defines FILE_EXTENSION', () => {
      expect(FORMATTER.FILE_EXTENSION).toBe('.au3');
    });
  });

  describe('DEFAULT_MAX_INCLUDE_DEPTH', () => {
    it('is a positive number', () => {
      expect(typeof DEFAULT_MAX_INCLUDE_DEPTH).toBe('number');
      expect(DEFAULT_MAX_INCLUDE_DEPTH).toBeGreaterThan(0);
    });
  });

  describe('DEFAULT_PARSE_DEBOUNCE_MS', () => {
    it('is a positive number', () => {
      expect(typeof DEFAULT_PARSE_DEBOUNCE_MS).toBe('number');
      expect(DEFAULT_PARSE_DEBOUNCE_MS).toBeGreaterThan(0);
    });
  });
});
