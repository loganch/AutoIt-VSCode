import path from 'path';
import fs from 'fs';

/**
 * Resolves AutoIt #include directives to file paths
 */
export default class IncludeResolver {
  constructor(workspaceRoot, autoitIncludePaths = []) {
    this.workspaceRoot = workspaceRoot;
    this.autoitIncludePaths = autoitIncludePaths;
  }

  /**
   * Parse include directives from source
   * @param {string} source - AutoIt source code
   * @param {string} currentFile - Path to current file
   * @returns {Array<{type: string, path: string, line: number}>}
   */
  parseIncludes(source, currentFile) {
    const includes = [];
    const lines = source.split('\n');

    // Matches: #include "file.au3" or #include <file.au3>
    const includePattern = /^\s*#include\s+([<"])([^>"]+)[>"]/i;

    lines.forEach((line, index) => {
      // Skip comments
      if (line.trim().startsWith(';')) return;

      const match = line.match(includePattern);
      if (match) {
        const bracket = match[1];
        const includePath = match[2];

        includes.push({
          type: bracket === '<' ? 'library' : 'relative',
          path: includePath,
          line: index
        });
      }
    });

    return includes;
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
}
