import MapParser from '../parsers/MapParser.js';
import IncludeResolver from '../utils/IncludeResolver.js';
import fs from 'fs';

/**
 * Singleton service for tracking Map variables across workspace
 */
class MapTrackingService {
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
   * @returns {MapTrackingService}
   */
  static getInstance(workspaceRoot, autoitIncludePaths, maxIncludeDepth) {
    if (!MapTrackingService.instance) {
      MapTrackingService.instance = new MapTrackingService(
        workspaceRoot,
        autoitIncludePaths,
        maxIncludeDepth,
      );
    }
    return MapTrackingService.instance;
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
   * @returns {object} Object with directKeys and functionKeys arrays
   */
  getKeysForMapWithIncludes(filePath, mapName, line) {
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
          if (fs.existsSync(includedFile)) {
            const source = fs.readFileSync(includedFile, 'utf8');
            this.updateFile(includedFile, source);
          }
        } catch (error) {
          // Gracefully handle read errors
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
