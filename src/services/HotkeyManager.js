const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

/**
 * Service for managing AutoIt3Wrapper hotkey conflicts with comprehensive functionality
 * for INI file detection, hotkey disabling, restoration, and concurrency management.
 *
 * This class handles the temporary disabling of AutoIt3Wrapper hotkeys during script execution
 * to prevent conflicts with the extension, and ensures proper restoration afterwards.
 */
// Named constants to avoid magic numbers and make behavior clearer
const OTHER_SECTION = '[Other]';
const OTHER_SECTION_LENGTH = OTHER_SECTION.length; // used when inserting placeholders
const SAFE_TIMER_MS = 10000;

class HotkeyManager {
  /**
   * Creates a new HotkeyManager instance.
   * @param {Object} config - Configuration object containing wrapperPath and other settings.
   */
  constructor(config) {
    /**
     * Regular expression to match hotkey entries in AutoIt3Wrapper.ini
     * @type {RegExp}
     */
    this.regex = /(SciTE_(STOPEXECUTE|RESTART)\s*=).*/gi;

    /**
     * Reference to the process environment variables.
     * @type {Object}
     */
    this.env = process.env;

    /**
     * Map to track running scripts for reference counting.
     * Key: process ID, Value: process ID (used as a Set).
     * @type {Map<number, number>}
     */
    this.count = new Map();

    /**
     * Original INI file data for restoration.
     * @type {string|null}
     */
    this.iniDataOrig = null;

    /**
     * Path to the AutoIt3Wrapper.ini file.
     * @type {string|null}
     */
    this.iniPath = null;

    /**
     * Safety timer to prevent permanent hotkey disabling.
     * @type {NodeJS.Timeout|null}
     */
    this.timer = null;

    /**
     * Configuration object containing wrapperPath.
     * @type {Object}
     */
    this.config = config;
  }

  /**
   * Detects and returns the path to AutoIt3Wrapper.ini file.
   * Checks multiple possible locations in order of preference.
   * @returns {string} Path to the AutoIt3Wrapper.ini file.
   * @private
   */
  _getIniPath() {
    if (
      this.env.SCITE_USERHOME &&
      fsSync.existsSync(`${this.env.SCITE_USERHOME}\\AutoIt3Wrapper`)
    ) {
      return `${this.env.SCITE_USERHOME}\\AutoIt3Wrapper\\AutoIt3Wrapper.ini`;
    }
    if (this.env.SCITE_HOME && fsSync.existsSync(`${this.env.SCITE_HOME}/AutoIt3Wrapper`)) {
      return `${this.env.SCITE_HOME}\\AutoIt3Wrapper\\AutoIt3Wrapper.ini`;
    }
    if (fsSync.existsSync(`${path.dirname(this.config.wrapperPath)}\\AutoIt3Wrapper.ini`)) {
      return `${path.dirname(this.config.wrapperPath)}\\AutoIt3Wrapper.ini`;
    }
    return `${path.dirname(this.config.wrapperPath)}\\AutoIt3Wrapper.ini`;
  }

  /**
   * Reads and processes the AutoIt3Wrapper.ini file data.
   * Modifies the file content to disable hotkeys by removing existing entries
   * and adding empty placeholder entries.
   * @returns {Promise<{iniPath: string, iniData: string}>} Object containing INI path and modified data.
   * @private
   */
  async _getFileData() {
    let iniData = '';

    // We should not cache this
    this.iniPath = this._getIniPath();

    try {
      this.iniDataOrig = await fs.readFile(this.iniPath, 'utf-8');
      iniData = this.iniDataOrig.replace(this.regex, '');
      let otherIndex = iniData.search(/\[Other\]/i);
      if (otherIndex === -1) {
        iniData += `\r\n${OTHER_SECTION}`;
        otherIndex = iniData.length - OTHER_SECTION_LENGTH; // index where the section starts
      }

      // Insert empty SciTE hotkey placeholders immediately after the [Other] section header
      const placeholder = '\r\nSciTE_STOPEXECUTE=\r\nSciTE_RESTART=\r\n';
      iniData =
        iniData.substring(0, otherIndex + OTHER_SECTION_LENGTH) +
        placeholder +
        iniData.substring(otherIndex + OTHER_SECTION_LENGTH);
    } catch (error) {
      this.iniDataOrig = null;
      console.error(`Error reading AutoIt3Wrapper.ini: ${error.message}`);
    }

    return { iniPath: this.iniPath, iniData };
  }

  /**
   * Disables AutoIt3Wrapper hotkeys for the given process ID.
   * This method uses reference counting to handle multiple concurrent scripts.
   * The INI file is only modified on the first disable call and restored on the last reset.
   * @param {number} id - Process ID of the running script.
   * @returns {Promise<number>} The process ID.
   */
  async disable(id) {
    try {
      clearTimeout(this.timer);
      this.count.set(id, id);
      console.log(
        `HotkeyManager: Disabling hotkeys for process ${id}. Active processes: ${this.count.size}`,
      );

      if (this.count.size === 1) {
        const { iniPath: _iniPath, iniData: _iniData } = await this._getFileData();
        try {
          await fs.writeFile(_iniPath, _iniData, 'utf-8');
          console.log(`HotkeyManager: Modified AutoIt3Wrapper.ini at ${_iniPath}`);
        } catch (error) {
          console.error(`Error writing AutoIt3Wrapper.ini: ${error.message}`);
          // Clean up on failure
          this.count.delete(id);
          throw error;
        }
      }

      // Safety timer - should never fire unless something went wrong
      this.timer = setTimeout(() => {
        console.warn('HotkeyManager: Safety timer triggered - forcing reset');
        this._forceReset();
      }, SAFE_TIMER_MS);

      return id;
    } catch (error) {
      console.error(`HotkeyManager: Error in disable for process ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Restores AutoIt3Wrapper hotkeys for the given process ID or all if no ID provided.
   * Uses reference counting to ensure restoration only happens when no scripts are running.
   * @param {number} [id] - Process ID to reset. If not provided, resets all.
   * @returns {Promise<void>}
   */
  async reset(id) {
    try {
      clearTimeout(this.timer);
      console.log(
        `HotkeyManager: Resetting hotkeys for process ${id || 'all'}. Active processes: ${this.count.size}`,
      );

      if (id) {
        this.count.delete(id);
      } else {
        this.count.clear();
      }

      if (!this.iniPath || (id && this.count.size)) return;

      try {
        if (this.iniDataOrig === null) {
          await fs.rm(this.iniPath);
          console.log(`HotkeyManager: Removed AutoIt3Wrapper.ini at ${this.iniPath}`);
        } else {
          await fs.writeFile(this.iniPath, this.iniDataOrig, 'utf-8');
          console.log(`HotkeyManager: Restored AutoIt3Wrapper.ini at ${this.iniPath}`);
        }
      } catch (error) {
        console.error(`Error restoring AutoIt3Wrapper.ini: ${error.message}`);
      }
    } catch (error) {
      console.error(`HotkeyManager: Error in reset for process ${id || 'all'}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Forces a complete reset of hotkeys, clearing all references and restoring INI.
   * Used as a safety mechanism when the safety timer triggers.
   * @private
   */
  async _forceReset() {
    console.warn('HotkeyManager: Performing force reset');
    this.count.clear();
    await this.reset();
  }

  /**
   * Cleans up resources and performs final restoration if needed.
   * Should be called when the extension is deactivated.
   * @returns {Promise<void>}
   */
  async cleanup() {
    clearTimeout(this.timer);
    await this._forceReset();
    console.log('HotkeyManager: Cleanup completed');
  }

  /**
   * Gets the current number of active processes being tracked.
   * @returns {number} Number of active processes.
   */
  getActiveCount() {
    return this.count.size;
  }
}

module.exports = HotkeyManager;
