import VariableParser from '../parsers/VariableParser.js';
import TrackingServiceBase from './TrackingServiceBase.js';

/**
 * Singleton service for tracking variable declarations across workspace.
 * Inherits singleton lifecycle, debouncing, and include fan-out from
 * {@link TrackingServiceBase}; provides the Variable-specific parser factory
 * and global-variable merge/dedupe strategy.
 */
class VariableTrackingService extends TrackingServiceBase {
  /**
   * @param {string} source - File source code
   * @param {string} filePath - Absolute file path
   * @returns {VariableParser}
   */
  createParser(source, filePath) {
    const parser = new VariableParser(source, filePath);
    parser.parseFunctionBoundaries();
    parser.parseVariableDeclarations();
    return parser;
  }

  /**
   * Get variables at a specific position in a file.
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
   * Get variables at a position including variables from #include files.
   * Only global variables from included files are accessible.
   * @param {string} filePath - Absolute file path
   * @param {number} line - Line number (0-based)
   * @returns {Promise<Array>} Promise resolving to array of variable objects
   */
  async getVariablesWithIncludes(filePath, line) {
    const currentVariables = this.getVariablesAtPosition(filePath, line);
    const includedFiles = await this._ensureIncludedFilesParsed(filePath);

    const allVariables = [...currentVariables];
    for (const includedFile of includedFiles) {
      const includedVariables = this.getVariablesAtPosition(includedFile, Infinity);
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
}

export default VariableTrackingService;
