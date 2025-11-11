import MapParser from '../parsers/MapParser.js';
import IncludeResolver from '../utils/IncludeResolver.js';
import fs from 'fs';

/**
 * Singleton service for tracking Map variables across workspace
 */
class MapTrackingService {
  /**
   * @type {MapTrackingService | null}
   */
  static instance = null;

  constructor(workspaceRoot = '', autoitIncludePaths = [], maxIncludeDepth = 3) {
    if (MapTrackingService.instance) {
      return MapTrackingService.instance;
    }

    this.fileParsers = new Map(); // filePath -> MapParser
    this.includeResolver = new IncludeResolver(workspaceRoot, autoitIncludePaths, maxIncludeDepth);
    this.workspaceRoot = workspaceRoot;
    MapTrackingService.instance = this;
  }

  /**
   * Get singleton instance
   * @param {string} workspaceRoot - Only used on first call, ignored on subsequent calls unless updateConfiguration() is called
   * @param {string[]} autoitIncludePaths - Only used on first call, ignored on subsequent calls unless updateConfiguration() is called
   * @param {number} maxIncludeDepth - Only used on first call, ignored on subsequent calls unless updateConfiguration() is called
   * @returns {MapTrackingService}
   * @note Parameters are only used during initial instantiation. To update configuration
   *       after initialization, use updateConfiguration() method.
   */
  static getInstance(workspaceRoot, autoitIncludePaths, maxIncludeDepth) {
    if (!MapTrackingService.instance) {
      MapTrackingService.instance = new MapTrackingService(
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
      const { instance } = MapTrackingService;
      const hasChanges =
        (workspaceRoot !== undefined && workspaceRoot !== instance.workspaceRoot) ||
        (autoitIncludePaths !== undefined &&
          JSON.stringify(autoitIncludePaths) !==
            JSON.stringify(instance.includeResolver.autoitIncludePaths)) ||
        (maxIncludeDepth !== undefined && maxIncludeDepth !== instance.includeResolver.maxDepth);

      if (hasChanges) {
        console.warn(
          '[MapTrackingService] getInstance called with different parameters than initial instance. ' +
            'Use updateConfiguration() to modify singleton settings.',
        );
      }
    }
    return MapTrackingService.instance;
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
    // Clear cached parsers to force re-parsing with new include paths
    this.fileParsers.clear();
  }

  /**
   * Reset singleton instance (for testing)
   * @internal
   */
  static resetInstance() {
    MapTrackingService.instance = null;
  }

  /**
   * Update parsed data for a file
   * @param {string} filePath - Absolute file path
   * @param {string} source - File source code
   */
  updateFile(filePath, source) {
    const parser = new MapParser(source);
    this.fileParsers.set(filePath, parser);
  }

  /**
   * Remove file from cache
   * @param {string} filePath - Absolute file path
   */
  removeFile(filePath) {
    this.fileParsers.delete(filePath);
  }

  /**
   * Clear all cached data
   */
  clear() {
    this.fileParsers.clear();
  }

  /**
   * Get keys for a Map variable at a specific line in a file
   * @param {string} filePath - Absolute file path
   * @param {string} mapName - Map variable name
   * @param {number} line - Line number
   * @returns {object} Object with directKeys and functionKeys arrays
   */
  getKeysForMap(filePath, mapName, line) {
    const parser = this.fileParsers.get(filePath);
    if (!parser) {
      return { directKeys: [], functionKeys: [] };
    }

    return parser.getKeysForMapAtLine(mapName, line);
  }

  /**
   * Get keys for a Map including keys from #include files
   * @param {string} filePath - Absolute file path
   * @param {string} mapName - Map variable name
   * @param {number} line - Line number
   * @returns {Promise<object>} Promise resolving to object with directKeys and functionKeys arrays
   */
  async getKeysForMapWithIncludes(filePath, mapName, line) {
    // Get keys from current file
    const currentKeys = this.getKeysForMap(filePath, mapName, line);

    // Get keys from included files
    const includedFiles = this.includeResolver.resolveAllIncludes(filePath);
    const allDirectKeys = new Set(currentKeys.directKeys);
    const allFunctionKeys = [...currentKeys.functionKeys];

    for (const includedFile of includedFiles) {
      // Parse included file if not already cached
      if (!this.fileParsers.has(includedFile)) {
        try {
          // Check if file exists using async access
          await fs.promises.access(includedFile, fs.constants.F_OK);
          const source = await fs.promises.readFile(includedFile, 'utf8');
          this.updateFile(includedFile, source);
        } catch (error) {
          // Log read errors instead of silently continuing
          console.warn(
            `[MapTrackingService] Failed to read included file ${includedFile}:`,
            error.message,
          );
          continue;
        }
      }

      const includedKeys = this.getKeysForMap(includedFile, mapName, Infinity);

      // Merge keys
      includedKeys.directKeys.forEach(key => allDirectKeys.add(key));
      allFunctionKeys.push(...includedKeys.functionKeys);
    }

    return {
      directKeys: Array.from(allDirectKeys),
      functionKeys: allFunctionKeys,
    };
  }
}

export default MapTrackingService;
