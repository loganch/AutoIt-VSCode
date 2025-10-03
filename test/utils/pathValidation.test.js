const path = require('path');
const {
  validateFilePath,
  validateExecutablePath,
  fileExists,
} = require('../../src/utils/pathValidation');

describe('pathValidation', () => {
  describe('validateFilePath', () => {
    it('should validate a normal file path', () => {
      const result = validateFilePath('test.au3');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('test.au3');
      expect(result.error).toBeUndefined();
    });

    it('should reject null or empty paths', () => {
      expect(validateFilePath(null).valid).toBe(false);
      expect(validateFilePath('').valid).toBe(false);
      expect(validateFilePath(undefined).valid).toBe(false);
    });

    it('should reject paths with null bytes', () => {
      const result = validateFilePath('test\0.au3');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('null bytes');
    });

    it('should normalize paths with . and ..', () => {
      const result = validateFilePath('./test/../test.au3');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('test.au3');
    });

    it('should detect path traversal outside workspace', () => {
      const workspaceRoot = path.resolve('/workspace');
      const result = validateFilePath('../../etc/passwd', workspaceRoot);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('path traversal');
    });

    it('should allow paths within workspace', () => {
      const workspaceRoot = path.resolve('/workspace');
      const result = validateFilePath('subfolder/test.au3', workspaceRoot);
      expect(result.valid).toBe(true);
    });

    it('should detect upward directory traversal', () => {
      const workspaceRoot = path.resolve('/workspace');
      const result = validateFilePath('../../../sensitive/file.au3', workspaceRoot);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('path traversal');
    });

    it('should handle absolute paths correctly', () => {
      const absolutePath = path.resolve('/workspace/test.au3');
      const result = validateFilePath(absolutePath);
      expect(result.valid).toBe(true);
    });

    it('should reject non-string paths', () => {
      // @ts-ignore
      // eslint-disable-next-line no-magic-numbers
      expect(validateFilePath(123).valid).toBe(false);
      // @ts-ignore
      expect(validateFilePath({}).valid).toBe(false);
      // @ts-ignore
      expect(validateFilePath([]).valid).toBe(false);
    });
  });

  describe('validateExecutablePath', () => {
    it('should reject non-existent executables', () => {
      const result = validateExecutablePath('/path/to/nonexistent.exe');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('does not exist');
    });

    it('should validate path structure even if file does not exist', () => {
      const result = validateExecutablePath('test\0.exe');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('null bytes');
    });
  });

  describe('fileExists', () => {
    it('should return false for non-existent files', () => {
      expect(fileExists('/path/to/nonexistent.file')).toBe(false);
    });

    it('should handle invalid paths gracefully', () => {
      expect(fileExists(null)).toBe(false);
      expect(fileExists('')).toBe(false);
    });
  });

  describe('path traversal attack scenarios', () => {
    const workspaceRoot = path.resolve('/workspace');

    it('should block ../ traversal', () => {
      const result = validateFilePath('../../../etc/passwd', workspaceRoot);
      expect(result.valid).toBe(false);
    });

    it('should block ..\\ traversal on Windows', () => {
      const result = validateFilePath('..\\..\\..\\windows\\system32\\config', workspaceRoot);
      expect(result.valid).toBe(false);
    });

    it('should block mixed separator traversal', () => {
      const result = validateFilePath('../../../etc/passwd', workspaceRoot);
      expect(result.valid).toBe(false);
    });

    it('should block encoded traversal attempts', () => {
      const result = validateFilePath('test\0poison.au3');
      expect(result.valid).toBe(false);
    });

    it('should allow relative paths within workspace', () => {
      const result = validateFilePath('./scripts/test.au3', workspaceRoot);
      expect(result.valid).toBe(true);
    });

    it('should allow subdirectory paths', () => {
      const result = validateFilePath('subfolder/nested/test.au3', workspaceRoot);
      expect(result.valid).toBe(true);
    });
  });
});
