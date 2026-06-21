import fs from 'fs';
import path from 'path';
import { safeExecute } from '../errorUtils';
import { REGEX_PATTERNS } from './regexPatterns';

/**
 * Validates and normalizes string input
 * @param {any} value - Value to validate
 * @param {string} [defaultValue=''] - Default value if invalid
 * @returns {string} Validated string
 */
export const validateString = (value, defaultValue = '') => {
  return typeof value === 'string' && value.length > 0 ? value.trim() : defaultValue;
};

/**
 * Validates file path input
 * @param {any} filePath - Path to validate
 * @returns {boolean} True if valid path
 */
export const isValidFilePath = filePath => {
  return typeof filePath === 'string' && filePath.length > 0 && filePath.trim().length > 0;
};

/**
 * Validates VSCode document object
 * @param {any} document - Document to validate
 * @returns {boolean} True if valid document
 */
export const isValidDocument = document => {
  return (
    document &&
    (document.uri?.fsPath || document.fileName) &&
    typeof document.getText === 'function'
  );
};

/**
 * Module-level cache for include file contents
 * Key: normalized absolute path
 * Value: { mtimeMs: number, content: string, statCheckedAt: number }
 */
const includeCache = new Map();

/** Cap on includeCache size; oldest entry is evicted once exceeded. */
const MAX_INCLUDE_CACHE_SIZE = 200;

/**
 * Drops all cached include file contents. Exposed for `deactivate()` and tests.
 */
export const clearIncludeCache = () => includeCache.clear();

/**
 * Grace period (ms) during which a cached include file is returned without an
 * fs.statSync call. Avoids 30+ synchronous stat syscalls per F12 on Windows
 * when nothing has changed on disk. After the window lapses the mtime is
 * re-verified and the entry refreshed if the file was modified.
 */
const STAT_GRACE_MS = 5_000;

/**
 * Safely check if file exists with proper error handling
 * @param {string} filePath - Path to check
 * @returns {boolean} True if file exists and is accessible
 */
export const safeFileExists = filePath => {
  if (!isValidFilePath(filePath)) return false;

  return safeExecute(() => fs.existsSync(filePath), false, `File existence check for ${filePath}`);
};

/**
 * Safely read file with proper error handling and encoding
 * @param {string} filePath - Path to read
 * @param {'utf8'|'utf-8'|'ascii'|'latin1'|'base64'|'hex'} [encoding='utf8'] - File encoding
 * @returns {string} File contents or empty string
 */
export const safeReadFile = (filePath, encoding = 'utf8') => {
  if (!isValidFilePath(filePath)) return '';

  return safeExecute(() => fs.readFileSync(filePath, encoding), '', `Read file ${filePath}`);
};

/**
 * Safely get file stats with proper error handling
 * @param {string} filePath - Path to stat
 * @returns {fs.Stats|null} File stats or null
 */
export const safeFileStat = filePath => {
  if (!isValidFilePath(filePath)) return null;

  return safeExecute(() => fs.statSync(filePath), null, `File stat for ${filePath}`);
};

/**
 * Converts a file path to a normalized, absolute path format that works consistently across operating systems.
 * This function ensures paths can be used safely as Map/Set keys by standardizing path separators,
 * making relative paths absolute, and normalizing drive letter casing on Windows.
 *
 * @param {any} inputPath - The file path to normalize (string expected, other types return empty string)
 * @returns {string} Normalized absolute path with consistent separators, or empty string if input is invalid
 */
export const normalizePath = inputPath => {
  const rawPath = validateString(inputPath);
  if (!rawPath) return '';

  return safeExecute(
    () => {
      let normalized = path.normalize(rawPath);

      // Make absolute if necessary
      if (!path.isAbsolute(normalized)) {
        normalized = path.resolve(process.cwd(), normalized);
      }

      // Standardize path separators
      normalized = normalized.replace(/[/\\]+/g, path.sep);

      // Lowercase drive letter on Windows for consistency
      if (process.platform === 'win32' && REGEX_PATTERNS.windowsDriveLetter.test(normalized)) {
        normalized = normalized.charAt(0).toLowerCase() + normalized.slice(1);
      }

      return normalized;
    },
    '',
    'Path normalization',
  );
};

/**
 * Reads the contents of an AutoIt (.au3) file with intelligent caching based on file modification time.
 * Only processes .au3 files for security. Uses a module-level cache to avoid re-reading unchanged files,
 * significantly improving performance when the same include file is accessed multiple times.
 *
 * @param {string} filePath - Absolute or relative path to the .au3 file to read
 * @returns {string} Complete file contents as UTF-8 string, or empty string if file doesn't exist, isn't .au3, or read fails
 */
export const getIncludeText = filePath => {
  const normalized = normalizePath(filePath);
  if (!normalized) return '';

  // Only process .au3 files for security and performance
  const ext = path.extname(normalized).toLowerCase();
  if (ext !== '.au3') return '';

  // Return cached content immediately when within the grace period — skips
  // the synchronous fs.statSync call that would otherwise fire on every F12.
  const now = Date.now();
  const cached = includeCache.get(normalized);
  if (cached && now - cached.statCheckedAt < STAT_GRACE_MS) {
    return cached.content;
  }

  // Grace period lapsed (or no entry yet) — stat the file to check freshness.
  const stat = safeFileStat(normalized);
  if (!stat) return '';

  const mtimeMs = stat.mtimeMs || 0;

  // Still fresh: update the timestamp so the grace period resets.
  if (cached?.mtimeMs === mtimeMs) {
    cached.statCheckedAt = now;
    return cached.content;
  }

  // File changed (or not cached yet): read and store.
  const content = safeReadFile(normalized);
  if (content) {
    if (!includeCache.has(normalized) && includeCache.size >= MAX_INCLUDE_CACHE_SIZE) {
      // ponytail: FIFO eviction (oldest insertion), not true LRU; upgrade if access patterns need it
      includeCache.delete(includeCache.keys().next().value);
    }
    includeCache.set(normalized, { mtimeMs, content, statCheckedAt: now });
  }

  return content;
};
