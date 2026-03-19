/**
 * Singleton service for tracking variable declarations across the workspace
 * Based on MapTrackingService.js structure
 */

import VariableParser from '../parsers/VariableParser.js';
import IncludeResolver from '../utils/IncludeResolver.js';
import debounce from '../utils/debounce.js';
import fs from 'fs';
import { DEFAULT_MAX_INCLUDE_DEPTH, DEFAULT_PARSE_DEBOUNCE_MS } from '../constants.js';

/**
 * Singleton service for tracking variable declarations across workspace
 */
class VariableTrackingService {
  /**
   * @type {VariableTrackingService | null}
   */
  static instance = null;

  constructor(
    workspaceRoot = '',
    autoitIncludePaths = [],
    maxIncludeDepth = DEFAULT_MAX_INCLUDE_DEPTH,
  ) {
    if (VariableTrackingService.instance) {
      return VariableTrackingService.instance;
    }

    this.fileParsers = new Map(); // filePath -> VariableParser
    this.includeResolver = new IncludeResolver(workspaceRoot, autoitIncludePaths, maxIncludeDepth);
    this.workspaceRoot = workspaceRoot;

    // Debouncing state
    this.pendingParses = new Map(); // filePath -> { source, timestamp }
    this.parseDebounceMs = DEFAULT_PARSE_DEBOUNCE_MS;
    this.ongoingParses = new Set(); // Track files currently being parsed
    this.latestQueuedSource = new Map(); // filePath -> source (for queuing during concurrent parse)

    // Create debounced parse function per file
    this.debouncedParseByFile = new Map(); // filePath -> debounced function

    VariableTrackingService.instance = this;
  }

  /**
   * Get singleton instance
   * @param {string} [workspaceRoot] - Only used on first call
   * @param {string[]} [autoitIncludePaths] - Only used on first call
   * @param {number} [maxIncludeDepth] - Only used on first call
   * @returns {VariableTrackingService}
   */
  static getInstance(workspaceRoot, autoitIncludePaths, maxIncludeDepth) {
    if (!VariableTrackingService.instance) {
      VariableTrackingService.instance = new VariableTrackingService(
        workspaceRoot,
        autoitIncludePaths,
        maxIncludeDepth,
      );
    } else if (
      workspaceRoot !== undefined ||
      autoitIncludePaths !== undefined ||
      maxIncludeDepth !== undefined
    ) {
      // Warn if parameters provided don't match stored config
      const { instance } = VariableTrackingService;
      const hasChanges =
        (workspaceRoot !== undefined && workspaceRoot !== instance.workspaceRoot) ||
        (autoitIncludePaths !== undefined &&
          JSON.stringify(autoitIncludePaths) !==
            JSON.stringify(instance.includeResolver.autoitIncludePaths)) ||
        (maxIncludeDepth !== undefined && maxIncludeDepth !== instance.includeResolver.maxDepth);

      if (hasChanges) {
        console.warn(
          '[VariableTrackingService] getInstance called with different parameters than initial instance. ' +
            'Use updateConfiguration() to modify singleton settings.',
        );
      }
    }
    return VariableTrackingService.instance;
  }

  /**
   * Update configuration for the singleton instance
   * @param {string} workspaceRoot - New workspace root directory
   * @param {string[]} autoitIncludePaths - New AutoIt include paths
   * @param {number} maxIncludeDepth - New maximum include depth
   */
  updateConfiguration(workspaceRoot, autoitIncludePaths, maxIncludeDepth) {
    this.workspaceRoot = workspaceRoot;
    this.includeResolver = new IncludeResolver(workspaceRoot, autoitIncludePaths, maxIncludeDepth);
    // Cancel all pending debounced parses
    for (const debouncedParse of this.debouncedParseByFile.values()) {
      if (debouncedParse.cancel) {
        debouncedParse.cancel();
      }
    }
    // Clear all cached state to force re-parsing with new include paths
    this.fileParsers.clear();
    this.debouncedParseByFile.clear();
    this.pendingParses.clear();
    this.ongoingParses.clear();
    this.latestQueuedSource.clear();
  }
  /**
   * Reset singleton instance (for testing)
   * @internal
   */
  static resetInstance() {
    VariableTrackingService.instance = null;
  }

  /**
   * Update parsed data for a file (immediate, no debouncing)
   * @param {string} filePath - Absolute file path
   * @param {string} source - File source code
   */
  updateFile(filePath, source) {
    const parser = new VariableParser(source, filePath);
    parser.parseFunctionBoundaries();
    parser.parseVariableDeclarations();
    this.fileParsers.set(filePath, parser);
  }

  /**
   * Update file with debouncing
   * @param {string} filePath - Absolute file path
   * @param {string} source - File source code
   */
  updateFileDebounced(filePath, source) {
    // Get or create debounced parser for this file
    if (!this.debouncedParseByFile.has(filePath)) {
      this.debouncedParseByFile.set(
        filePath,
        debounce((path, src) => {
          this._parseFile(path, src);
        }, this.parseDebounceMs),
      );
    }

    // Store pending parse data
    this.pendingParses.set(filePath, { source, timestamp: Date.now() });

    // Trigger debounced parse
    const debouncedParse = this.debouncedParseByFile.get(filePath);
    debouncedParse(filePath, source);
  }

  /**
   * Update file immediately without debouncing (for file save)
   * @param {string} filePath - Absolute file path
   * @param {string} source - File source code
   */
  updateFileImmediate(filePath, source) {
    // Cancel any pending debounced parse
    if (this.debouncedParseByFile.has(filePath)) {
      const debouncedParse = this.debouncedParseByFile.get(filePath);
      if (debouncedParse.cancel) {
        debouncedParse.cancel();
      }
    }

    // Clean up pending parse entry
    this.pendingParses.delete(filePath);

    this._parseFile(filePath, source);
  }

  /**
   * Internal method to parse file (called after debounce)
   * @param {string} filePath - Absolute file path
   * @param {string} source - File source code
   * @private
   */
  _parseFile(filePath, source) {
    // If a parse is already ongoing, save this source and return
    if (this.ongoingParses.has(filePath)) {
      this.latestQueuedSource.set(filePath, source);
      return;
    }

    this.ongoingParses.add(filePath);

    try {
      const parser = new VariableParser(source, filePath);
      parser.parseFunctionBoundaries();
      parser.parseVariableDeclarations();
      this.fileParsers.set(filePath, parser);
    } finally {
      this.ongoingParses.delete(filePath);
      this.pendingParses.delete(filePath);

      // Check if a newer source was queued while we were parsing
      if (this.latestQueuedSource.has(filePath)) {
        const queuedSource = this.latestQueuedSource.get(filePath);
        this.latestQueuedSource.delete(filePath);

        // Schedule async re-parse to avoid stack overflow with rapid edits
        setImmediate(() => {
          this._parseFile(filePath, queuedSource);
        });
      }
    }
  }

  /**
   * Remove file from cache
   * @param {string} filePath - Absolute file path
   */
  removeFile(filePath) {
    // Retrieve the debounced entry from this.debouncedParseByFile for the given filePath
    const debounced = this.debouncedParseByFile.get(filePath);

    // If the entry exists and has a cancel method (indicating it's a debounced function), call debounced.cancel()
    if (debounced && typeof debounced.cancel === 'function') {
      debounced.cancel();
    }
    // Otherwise, if the entry is a numeric timeout ID, call clearTimeout(debounced)
    else if (typeof debounced === 'number') {
      clearTimeout(debounced);
    }

    // Only after canceling the pending operation should you proceed to delete the entries
    this.fileParsers.delete(filePath);
    this.debouncedParseByFile.delete(filePath);
    this.pendingParses.delete(filePath);
    this.latestQueuedSource.delete(filePath);
  }

  /**
   * Clear all cached data
   */
  clear() {
    // Cancel all pending debounced parses
    for (const debouncedParse of this.debouncedParseByFile.values()) {
      if (debouncedParse.cancel) {
        debouncedParse.cancel();
      }
    }
    this.fileParsers.clear();
    this.debouncedParseByFile.clear();
    this.pendingParses.clear();
    this.ongoingParses.clear();
    this.latestQueuedSource.clear();
  }
  /**
   * Get variables at a specific position in a file
   * @param {string} filePath - Absolute file path
   * @param {number} line - Line number (0-based)
   * @returns {Array} Array of variable objects
   */
  getVariablesAtPosition(filePath, line) {
    const parser = this.fileParsers.get(filePath);
    if (!parser) {
      return [];
    }

    return parser.getVariablesAtLine(line);
  }

  /**
   * Get variables at a position including variables from #include files
   * Note: Only global variables from included files are accessible
   * @param {string} filePath - Absolute file path
   * @param {number} line - Line number (0-based)
   * @returns {Promise<Array>} Promise resolving to array of variable objects
   */
  async getVariablesWithIncludes(filePath, line) {
    // Get variables from current file
    const currentVariables = this.getVariablesAtPosition(filePath, line);

    // Get variables from included files (only global variables)
    const includedFiles = this.includeResolver.resolveAllIncludes(filePath);
    const allVariables = [...currentVariables];

    for (const includedFile of includedFiles) {
      // Parse included file if not already cached
      if (!this.fileParsers.has(includedFile)) {
        try {
          const source = await this._readFile(includedFile);
          this.updateFile(includedFile, source);
        } catch (error) {
          console.warn(
            `[VariableTrackingService] Failed to read included file ${includedFile}:`,
            error.message,
          );
          continue;
        }
      }

      const includedVariables = this.getVariablesAtPosition(includedFile, Infinity);

      // Only include global variables from included files
      const globalVariables = includedVariables.filter(v => v.scope === 'global');
      allVariables.push(...globalVariables);
    }

    // Remove duplicates (keep first occurrence)
    const seen = new Set();
    return allVariables.filter(variable => {
      const key = `${variable.name}_${variable.functionName || 'global'}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Read file asynchronously
   * @param {string} filePath - Absolute file path
   * @returns {Promise<string>} Promise resolving to file contents
   * @private
   */
  _readFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}

export default VariableTrackingService;
