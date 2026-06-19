import MapParser from '../language/map.js';
import TrackingServiceBase from './TrackingServiceBase.js';

/**
 * Singleton service for tracking Map variables across workspace.
 * Inherits singleton lifecycle, debouncing, and include fan-out from
 * {@link TrackingServiceBase}; provides the Map-specific parser factory
 * and key-merge strategy.
 */
class MapTrackingService extends TrackingServiceBase {
  /**
   * @param {string} source - File source code
   * @returns {MapParser}
   */
  createParser(source) {
    return new MapParser(source);
  }

  /**
   * Get keys for a Map variable at a specific line in a file.
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
   * Get keys for a Map including keys from #include files.
   * @param {string} filePath - Absolute file path
   * @param {string} mapName - Map variable name
   * @param {number} line - Line number
   * @returns {Promise<object>} Promise resolving to object with directKeys and functionKeys arrays
   */
  async getKeysForMapWithIncludes(filePath, mapName, line) {
    const currentKeys = this.getKeysForMap(filePath, mapName, line);
    const includedFiles = await this._ensureIncludedFilesParsed(filePath);

    const allDirectKeys = new Set(currentKeys.directKeys);
    const allFunctionKeys = [...currentKeys.functionKeys];

    for (const includedFile of includedFiles) {
      const includedKeys = this.getKeysForMap(includedFile, mapName, Infinity);
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
