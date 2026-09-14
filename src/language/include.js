import path from 'path';
import { REGEX_PATTERNS } from '../utils/regexPatterns';
import { DEFAULT_MAX_INCLUDE_DEPTH } from '../constants';
import { safeFileExists, safeReadFile } from '../utils/fsCache';

// Include-capability layering (see config/pathResolution.js for the full
// list): unlike utils/includeResolution.js's function-based helpers, this is
// a stateful class (workspace root + max depth) built specifically for
// services/TrackingServiceBase.js's recursive include-graph walk — it owns
// cycle detection and per-service configuration, not general-purpose lookup.

/**
 * Resolves AutoIt #include directives to file paths
 */
export default class IncludeResolver {
  constructor(workspaceRoot, autoitIncludePaths = [], maxDepth = DEFAULT_MAX_INCLUDE_DEPTH) {
    this.workspaceRoot = workspaceRoot;
    this.autoitIncludePaths = autoitIncludePaths;
    this.maxDepth = maxDepth;
  }

  /**
   * Parse include directives from source
   * @param {string} source - AutoIt source code
   * @param {string} _currentFile - Path to current file
   * @returns {Array<{type: string, path: string, line: number}>}
   */
  parseIncludes(source, _currentFile) {
    const includes = [];

    const collect = (regex, type) => {
      for (const match of source.matchAll(regex)) {
        const line = source.slice(0, match.index).split('\n').length - 1;
        includes.push({ type, path: match[1], line });
      }
    };

    // Matches: #include "file.au3" or #include <file.au3> via the shared
    // patterns used by includeResolution.js, so the two implementations
    // can't silently diverge on edge cases (see F10 in tech-debt-assessment.md).
    collect(REGEX_PATTERNS.relativeInclude, 'relative');
    collect(REGEX_PATTERNS.libraryInclude, 'library');

    return includes.sort((a, b) => a.line - b.line);
  }

  /**
   * Resolve include directive to absolute file path
   * @param {object} include - Include object from parseIncludes
   * @param {string} currentFile - Path to current file
   * @returns {string|null} Resolved absolute path or null if not found
   */
  resolveIncludePath(include, currentFile) {
    if (include.type === 'relative') {
      // Resolve relative to current file's directory
      const currentDir = path.dirname(currentFile);
      const absolutePath = path.resolve(currentDir, include.path);

      if (safeFileExists(absolutePath)) {
        return absolutePath;
      }
      return null;
    }

    if (include.type === 'library') {
      // Try each AutoIt include path
      for (const includePath of this.autoitIncludePaths) {
        const absolutePath = path.join(includePath, include.path);
        if (safeFileExists(absolutePath)) {
          return absolutePath;
        }
      }
      return null;
    }

    return null;
  }

  /**
   * Resolve all includes recursively with circular detection
   * @param {string} filePath - Starting file path
   * @param {Set} visited - Set of already visited files (for circular detection)
   * @param {number} depth - Current recursion depth
   * @returns {string[]} Array of resolved file paths
   */
  resolveAllIncludes(filePath, visited = new Set(), depth = 0) {
    // Resolve to absolute path for consistent comparison
    const absolutePath = path.resolve(filePath);

    if (visited.has(absolutePath)) {
      return []; // Circular include detected
    }

    visited.add(absolutePath);
    const resolvedFiles = [];

    // safeFileExists/safeReadFile never throw (both safeExecute-backed, same
    // strategy as utils/includeResolution.js) -- a read failure just yields no
    // includes for this file rather than needing its own catch here.
    if (!safeFileExists(filePath)) {
      return [];
    }

    const source = safeReadFile(filePath);
    const includes = this.parseIncludes(source, filePath);

    for (const include of includes) {
      const resolved = this.resolveIncludePath(include, filePath);
      if (resolved) {
        const absoluteResolved = path.resolve(resolved);
        if (!visited.has(absoluteResolved)) {
          // Check depth limit before adding
          if (depth < this.maxDepth) {
            resolvedFiles.push(resolved);

            // Recursively resolve includes in the included file
            const nested = this.resolveAllIncludes(resolved, visited, depth + 1);
            resolvedFiles.push(...nested);
          }
        }
      }
    }

    return resolvedFiles;
  }
}
