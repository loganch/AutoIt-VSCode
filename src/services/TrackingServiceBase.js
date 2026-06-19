import IncludeResolver from '../utils/IncludeResolver.js';
import updateFileDebounced from './debouncedFileUpdate.js';
import fs from 'fs';
import { DEFAULT_MAX_INCLUDE_DEPTH, DEFAULT_PARSE_DEBOUNCE_MS } from '../constants.js';

// ponytail: WeakMap keyed by constructor gives each subclass its own singleton
// slot without per-subclass static fields or getInstance/resetInstance wrappers.
const instances = new WeakMap();

/**
 * Generic singleton base for workspace tracking services (maps, variables, ...).
 * Owns singleton lifecycle, debounced/immediate parse, concurrent-parse
 * re-queueing, include-file fan-out, and cancel-aware remove/clear.
 *
 * Subclasses must implement {@link TrackingServiceBase#createParser} and the
 * type-specific public query/merge methods (`getKeysForMap*` / `getVariablesAtPosition*`).
 */
class TrackingServiceBase {
  constructor(
    workspaceRoot = '',
    autoitIncludePaths = [],
    maxIncludeDepth = DEFAULT_MAX_INCLUDE_DEPTH,
  ) {
    const Ctor = this.constructor;
    if (instances.has(Ctor)) {
      return instances.get(Ctor);
    }

    this.fileParsers = new Map(); // filePath -> parser
    this.includeResolver = new IncludeResolver(workspaceRoot, autoitIncludePaths, maxIncludeDepth);
    this.workspaceRoot = workspaceRoot;

    // Debouncing state
    this.pendingParses = new Map(); // filePath -> { source, timestamp }
    this.parseDebounceMs = DEFAULT_PARSE_DEBOUNCE_MS;
    this.ongoingParses = new Set(); // files currently being parsed
    this.latestQueuedSource = new Map(); // filePath -> source (re-queue during concurrent parse)
    this.debouncedParseByFile = new Map(); // filePath -> debounced function

    instances.set(Ctor, this);
  }

  /**
   * Get singleton instance. Parameters only apply on first call; use
   * {@link TrackingServiceBase#updateConfiguration} to change them later.
   * @returns {TrackingServiceBase}
   */
  static getInstance(...args) {
    const Ctor = this;
    if (!instances.has(Ctor)) {
      return new Ctor(...args); // constructor registers itself in `instances`
    }
    if (args.some(a => a !== undefined)) {
      const instance = instances.get(Ctor);
      const [workspaceRoot, autoitIncludePaths, maxIncludeDepth] = args;
      const hasChanges =
        (workspaceRoot !== undefined && workspaceRoot !== instance.workspaceRoot) ||
        (autoitIncludePaths !== undefined &&
          JSON.stringify(autoitIncludePaths) !==
            JSON.stringify(instance.includeResolver.autoitIncludePaths)) ||
        (maxIncludeDepth !== undefined && maxIncludeDepth !== instance.includeResolver.maxDepth);

      if (hasChanges) {
        console.warn(
          `[${Ctor.name}] getInstance called with different parameters than initial instance. ` +
            'Use updateConfiguration() to modify singleton settings.',
        );
      }
    }
    return instances.get(Ctor);
  }

  /**
   * Reset singleton instance (for testing).
   * @internal
   */
  static resetInstance() {
    instances.delete(this);
  }

  /**
   * Update configuration for the singleton instance.
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
   * Build a parser for the given source. Subclasses must implement.
   * @param {string} _source - File source code
   * @param {string} _filePath - Absolute file path
   * @returns {object} A parser instance cached in {@link TrackingServiceBase#fileParsers}
   * @abstract
   */
  createParser(_source, _filePath) {
    throw new Error('createParser must be implemented by subclass');
  }

  /**
   * Update parsed data for a file (immediate, no debouncing).
   * @param {string} filePath - Absolute file path
   * @param {string} source - File source code
   */
  updateFile(filePath, source) {
    const parser = this.createParser(source, filePath);
    this.fileParsers.set(filePath, parser);
  }

  /**
   * Update file with debouncing.
   * @param {string} filePath - Absolute file path
   * @param {string} source - File source code
   */
  updateFileDebounced(filePath, source) {
    updateFileDebounced(this, filePath, source);
  }

  /**
   * Update file immediately without debouncing (for file open/save).
   * Cancels any pending debounced parse for the file.
   * @param {string} filePath - Absolute file path
   * @param {string} source - File source code
   */
  updateFileImmediate(filePath, source) {
    if (this.debouncedParseByFile.has(filePath)) {
      const debouncedParse = this.debouncedParseByFile.get(filePath);
      if (debouncedParse.cancel) {
        debouncedParse.cancel();
      }
    }
    this.pendingParses.delete(filePath);
    this._parseFile(filePath, source);
  }

  /**
   * Internal: parse a file, re-queueing if a parse for the same file is ongoing.
   * @param {string} filePath - Absolute file path
   * @param {string} source - File source code
   * @private
   */
  _parseFile(filePath, source) {
    if (this.ongoingParses.has(filePath)) {
      this.latestQueuedSource.set(filePath, source);
      return;
    }

    this.ongoingParses.add(filePath);

    try {
      const parser = this.createParser(source, filePath);
      this.fileParsers.set(filePath, parser);
    } finally {
      this.ongoingParses.delete(filePath);
      this.pendingParses.delete(filePath);

      // Re-parse if a newer source was queued while we were parsing
      if (this.latestQueuedSource.has(filePath)) {
        const queuedSource = this.latestQueuedSource.get(filePath);
        this.latestQueuedSource.delete(filePath);
        setImmediate(() => {
          this._parseFile(filePath, queuedSource);
        });
      }
    }
  }

  /**
   * Remove a file from the cache, cancelling any pending debounced parse.
   * @param {string} filePath - Absolute file path
   */
  removeFile(filePath) {
    const debounced = this.debouncedParseByFile.get(filePath);
    if (debounced && typeof debounced.cancel === 'function') {
      debounced.cancel();
    } else if (typeof debounced === 'number') {
      clearTimeout(debounced);
    }
    this.fileParsers.delete(filePath);
    this.debouncedParseByFile.delete(filePath);
    this.pendingParses.delete(filePath);
    this.latestQueuedSource.delete(filePath);
  }

  /**
   * Clear all cached data, cancelling all pending debounced parses.
   */
  clear() {
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
   * Resolve `#include` files for `filePath`, reading and parsing any that are
   * not already cached. Returns the list of included files that now have a
   * cached parser. Read failures are logged and skipped.
   * @param {string} filePath - Absolute file path
   * @returns {Promise<string[]>} Included file paths with a cached parser
   * @protected
   */
  async _ensureIncludedFilesParsed(filePath) {
    const includedFiles = this.includeResolver.resolveAllIncludes(filePath);
    const parsed = [];
    for (const includedFile of includedFiles) {
      if (!this.fileParsers.has(includedFile)) {
        try {
          const source = await fs.promises.readFile(includedFile, 'utf8');
          this.updateFile(includedFile, source);
        } catch (error) {
          console.warn(
            `[${this.constructor.name}] Failed to read included file ${includedFile}:`,
            error.message,
          );
          continue;
        }
      }
      parsed.push(includedFile);
    }
    return parsed;
  }
}

export default TrackingServiceBase;
