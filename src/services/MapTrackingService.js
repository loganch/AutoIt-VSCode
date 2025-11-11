import MapParser from '../parsers/MapParser.js';

/**
 * Singleton service for tracking Map variables across workspace
 */
class MapTrackingService {
  constructor() {
    if (MapTrackingService.instance) {
      return MapTrackingService.instance;
    }

    this.fileParsers = new Map(); // filePath -> MapParser
    MapTrackingService.instance = this;
  }

  /**
   * Get singleton instance
   * @returns {MapTrackingService}
   */
  static getInstance() {
    if (!MapTrackingService.instance) {
      MapTrackingService.instance = new MapTrackingService();
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
}

export default MapTrackingService;
