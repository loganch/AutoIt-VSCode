import path from 'path';
import aiConfig from '../providers/ai_config';
import { safeExecute } from '../errorUtils';
import { REGEX_PATTERNS } from './regexPatterns';
import {
  validateString,
  isValidDocument,
  safeFileExists,
  normalizePath,
  getIncludeText,
} from './fsCache';

const { findFilepath } = aiConfig;

/**
 * Determines if a text line should be skipped during AutoIt code analysis by checking for
 * empty lines, whitespace-only lines, comment lines (starting with ;), and most preprocessor
 * directives (starting with #). Comment block delimiters (#cs/#ce) are not skipped as they
 * affect parsing state.
 *
 * @param {import('vscode').TextLine} line - VSCode text line object to analyze
 * @returns {boolean} True if the line should be ignored during code parsing, false if it contains relevant code
 */
export const isSkippableLine = line => {
  if (!line || line.isEmptyOrWhitespace) return true;

  const firstChar = line.text.charAt(line.firstNonWhitespaceCharacterIndex);

  // Skip comment lines
  if (firstChar === ';') return true;

  // Handle preprocessor directives
  if (firstChar === '#') {
    return (
      !REGEX_PATTERNS.commentBlockStart.test(line.text) &&
      !REGEX_PATTERNS.commentBlockEnd.test(line.text)
    );
  }

  return false;
};

/**
 * Resolves AutoIt include file paths to absolute file system paths, handling both library includes
 * (with angle brackets) and relative includes (with quotes). Uses AutoIt's include search paths
 * and the current document's directory to locate files. Supports both `#include <file.au3>`
 * and `#include "file.au3"` formats.
 *
 * @param {string} fileOrPath - Include path from AutoIt source (e.g., "<Array.au3>" or "helper.au3")
 * @param {import('vscode').TextDocument} document - Current VSCode document for resolving relative paths
 * @returns {string} Absolute file system path to the include file, or empty string if not found or invalid
 */
export const getIncludePath = (fileOrPath, document) => {
  const rawPath = validateString(fileOrPath);
  if (!rawPath) return '';

  // Parse include format (angle brackets vs quotes)
  const hasAngle = REGEX_PATTERNS.hasAngleBrackets.test(rawPath);
  const isQuoted = REGEX_PATTERNS.hasQuotes.test(rawPath);
  const cleanPath = rawPath.replace(/^[<""]|[>"]$/g, '');

  // Return early if already absolute
  if (path.isAbsolute(cleanPath)) {
    return normalizePath(cleanPath);
  }

  // Library include resolution (angle brackets or simple .au3 files)
  if (hasAngle || (!isQuoted && cleanPath.endsWith('.au3') && !cleanPath.includes(path.sep))) {
    const libPath = safeExecute(
      () => findFilepath(cleanPath, true),
      null,
      `Library path resolution for ${cleanPath}`,
    );

    if (libPath && typeof libPath === 'string') {
      return normalizePath(libPath);
    }
  }

  // Relative include resolution
  if (isValidDocument(document)) {
    const docPath = document.uri?.fsPath || document.fileName || '';
    if (docPath) {
      const baseDir = path.dirname(docPath);
      const resolved = path.resolve(baseDir, cleanPath);

      if (safeFileExists(resolved)) {
        return normalizePath(resolved);
      }
    }
  }

  // Fallback to include search paths
  const fallbackPath = safeExecute(
    () => findFilepath(cleanPath, false),
    null,
    `Fallback path resolution for ${cleanPath}`,
  );

  return fallbackPath && typeof fallbackPath === 'string'
    ? normalizePath(fallbackPath)
    : normalizePath(cleanPath);
};

/**
 * Recursively collects all AutoIt include file paths referenced in a document and its nested includes.
 * Prevents circular dependencies by tracking visited files. Processes both relative includes
 * (`#include "file.au3"`) and library includes (`#include <file.au3>`). The results are accumulated
 * in the provided array, maintaining order while ensuring uniqueness.
 *
 * @param {import('vscode').TextDocument} document - Current VSCode document being analyzed
 * @param {string} docText - Complete text content of the document to scan for includes
 * @param {string[]} scriptsToSearch - Array that will be populated with resolved absolute paths to include files
 */
export const getIncludeScripts = (document, docText, scriptsToSearch) => {
  if (!isValidDocument(document) || !docText || !Array.isArray(scriptsToSearch)) {
    return;
  }

  // Maintain visited set for circular dependency protection
  // @ts-ignore - Adding custom property for tracking
  let visited = scriptsToSearch.__visitedSet;
  if (!visited) {
    visited = new Set();
    // @ts-ignore - Adding custom property for tracking
    Object.defineProperty(scriptsToSearch, '__visitedSet', {
      value: visited,
      enumerable: false,
      configurable: true,
      writable: false,
    });
  }

  /**
   * Process individual include with enhanced error handling
   * @param {string} includePath - Path to process
   * @param {boolean} isLibrary - Whether this is a library include
   */
  const processInclude = (includePath, isLibrary = false) => {
    if (!includePath) return;

    // Resolve path with appropriate format hints
    const pathToResolve = isLibrary ? `<${includePath}>` : includePath;
    let resolvedPath = getIncludePath(pathToResolve, document);

    // Fallback resolution if needed
    if (!resolvedPath) {
      const fallback = safeExecute(
        () => findFilepath(includePath, isLibrary),
        null,
        `Include resolution for ${includePath}`,
      );
      resolvedPath = typeof fallback === 'string' ? fallback : null;
    }

    if (!resolvedPath) return;

    const normalized = normalizePath(resolvedPath);
    if (!normalized || path.extname(normalized).toLowerCase() !== '.au3') return;

    // Prevent circular dependencies
    if (visited.has(normalized)) return;

    // Verify file accessibility
    if (!safeFileExists(normalized)) return;

    // Add to collection (maintain order and uniqueness)
    if (!scriptsToSearch.includes(normalized)) {
      scriptsToSearch.push(normalized);
    }
    visited.add(normalized);

    // Recursive processing
    const includeContent = getIncludeText(normalized);
    if (includeContent) {
      getIncludeScripts(document, includeContent, scriptsToSearch);
    }
  };

  // Process relative includes
  const relativeMatches = [...docText.matchAll(REGEX_PATTERNS.relativeInclude)];
  relativeMatches.forEach(match => processInclude(match[1], false));

  // Process library includes
  const libraryMatches = [...docText.matchAll(REGEX_PATTERNS.libraryInclude)];
  libraryMatches.forEach(match => processInclude(match[1], true));
};
