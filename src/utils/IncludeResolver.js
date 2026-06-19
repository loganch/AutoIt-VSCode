import path from 'path';
import fs from 'fs';
import { REGEX_PATTERNS } from './regexPatterns';
import { DEFAULT_MAX_INCLUDE_DEPTH } from '../constants';

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

      if (fs.existsSync(absolutePath)) {
        return absolutePath;
      }
      return null;
    }

    if (include.type === 'library') {
      // Try each AutoIt include path
      for (const includePath of this.autoitIncludePaths) {
        const absolutePath = path.join(includePath, include.path);
        if (fs.existsSync(absolutePath)) {
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

    try {
      if (!fs.existsSync(filePath)) {
        return [];
      }

      const source = fs.readFileSync(filePath, 'utf8');
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
    } catch (error) {
      // Gracefully handle file read errors
      console.warn(`Failed to resolve includes for ${filePath}:`, error.message);
    }

    return resolvedFiles;
  }
}
