const { workspace, RelativePattern } = require('vscode');
const fs = require('fs');
const path = require('path');
const { parse } = require('jsonc-parser');
const { performance } = require('perf_hooks');

/**
 * @typedef {Object.<string, string>} KeybindingMap
 * @typedef {Object} KeybindingFilter
 * @property {boolean} status - Filter by status
 * @property {string|null} thisFile - Filter by file
 */

/**
 * Service for managing VSCode keybindings with profile detection, file watching,
 * and command mapping functionality.
 */
class KeybindingService {
  // eslint-disable-next-line no-magic-numbers
  static PROFILE_DETECTION_TIMEOUT_MS = 2000;
  // eslint-disable-next-line no-magic-numbers
  static KEYBINDINGS_DEBOUNCE_MS = 200;

  /**
   * Creates a new KeybindingService instance.
   * @param {Object} options - Configuration options
   * @param {Array} [options.commandsList=[]] - List of command names to track
   * @param {string} [options.commandsPrefix=''] - Prefix for extension commands
   * @param {Array} [options.keybindingsDefaultRaw=[]] - Default keybindings from package.json
   */
  constructor(options = {}) {
    this.commandsList = options.commandsList || [];
    this.commandsPrefix = options.commandsPrefix || '';
    this.keybindingsDefaultRaw = options.keybindingsDefaultRaw || [];
    this.keybindings = null;
    this.profileDir = null;
    this.settingsWatcher = null;
    this.keybindingsWatcher = null;
    this.isInitialized = false;
  }

  /**
   * Initializes the keybinding service by detecting the profile directory
   * and setting up watchers.
   * @returns {Promise<KeybindingMap>} Promise that resolves to the keybindings map
   */
  async initialize() {
    if (this.isInitialized) {
      return this.keybindings;
    }

    try {
      await this._detectProfileDirectory();
      await this._setupWatchers();
      this.isInitialized = true;
      return this.keybindings;
    } catch (error) {
      console.error('Failed to initialize KeybindingService:', error);
      throw error;
    }
  }

  /**
   * Detects the VSCode profile directory by temporarily modifying settings
   * and watching for changes.
   * @returns {Promise<string>} Promise that resolves to the profile directory path
   * @private
   */
  _detectProfileDirectory() {
    return new Promise((resolve, reject) => {
      const prefs = workspace.getConfiguration('autoit');
      const prefName = 'consoleParams';
      const pref = prefs.inspect(prefName);
      const prefValue =
        pref.globalValue !== undefined
          ? pref.globalValue.replace(/ ?-profileDirID[\d.]+$/, '')
          : pref.globalValue;

      // Generate unique ID for profile detection
      const id =
        (prefValue ? prefValue + ' ' : '') +
        '-profileDirID.' +
        new Date().getTime() +
        performance.now();

      const baseDir =
        (process.env.VSCODE_PORTABLE
          ? process.env.VSCODE_PORTABLE + '/user-data'
          : process.env.APPDATA + '/Code') + '/User/';

      let settingsTimer;
      let resolved = false;

      const cleanup = () => {
        if (this.settingsWatcher) {
          this.settingsWatcher.dispose();
          this.settingsWatcher = null;
        }
        clearTimeout(settingsTimer);
      };

      const onTimeout = () => {
        if (resolved) return;
        resolved = true;
        cleanup();
        this.profileDir = baseDir;
        resolve(baseDir);
      };

      const onSettingsChange = uri => {
        if (resolved || this.profileDir) return;

        fs.readFile(uri.fsPath, (err, data) => {
          if (resolved || this.profileDir) return;

          try {
            const json = parse(data.toString());
            if (json[pref.key] !== id) return;

            resolved = true;
            this.profileDir = uri.fsPath.replace(/[^\\/]+$/, '');
            cleanup();
            resolve(this.profileDir);
          } catch (parseError) {
            console.error('Error parsing settings.json:', parseError);
          }
        });
      };

      // Set up settings watcher
      this.settingsWatcher = workspace.createFileSystemWatcher(
        new RelativePattern(baseDir, '**/settings.json'),
      );

      this.settingsWatcher.onDidChange(onSettingsChange);
      this.settingsWatcher.onDidCreate(onSettingsChange);

      // Update preferences with our detection ID
      try {
        const updateResult = prefs.update(prefName, id, true);
        if (updateResult && typeof updateResult.then === 'function') {
          Promise.resolve(updateResult)
            .then(() => {
              settingsTimer = setTimeout(onTimeout, KeybindingService.PROFILE_DETECTION_TIMEOUT_MS);
            })
            .catch(reject);
        } else {
          settingsTimer = setTimeout(onTimeout, KeybindingService.PROFILE_DETECTION_TIMEOUT_MS);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Sets up file watchers for keybindings.json and initializes keybindings.
   * @returns {Promise<void>}
   * @private
   */
  async _setupWatchers() {
    const keybindingsDir = this.profileDir;
    const fileName = 'keybindings.json';
    const filePath = path.join(keybindingsDir, fileName);

    // Initialize keybindings
    await this._loadKeybindings(filePath);

    // Set up watcher for keybindings.json
    this.keybindingsWatcher = workspace.createFileSystemWatcher(
      new RelativePattern(keybindingsDir, '*.json'),
    );

    let readFileLast = 0;
    const readFile = uri => {
      const now = performance.now();
      if (
        uri &&
        (uri.scheme !== 'file' ||
          uri.fsPath !== filePath ||
          readFileLast + KeybindingService.KEYBINDINGS_DEBOUNCE_MS > now)
      ) {
        return;
      }
      readFileLast = now;
      this._loadKeybindings(filePath);
    };

    this.keybindingsWatcher.onDidChange(readFile);
    this.keybindingsWatcher.onDidCreate(readFile);
    this.keybindingsWatcher.onDidDelete(readFile);
  }

  /**
   * Loads and parses keybindings from the specified file.
   * @param {string} filePath - Path to the keybindings.json file
   * @returns {Promise<KeybindingMap>} Promise that resolves to the parsed keybindings
   * @private
   */
  _loadKeybindings(filePath) {
    return new Promise(resolve => {
      const commandsList = {};
      for (let i = 0; i < this.commandsList.length; i++) {
        commandsList[this.commandsPrefix + this.commandsList[i]] = '';
      }

      const keybindingsDefault = this.keybindingsDefaultRaw.reduce((a, b) => {
        a[b.command] = b.key;
        return a;
      }, {});

      const updateKeybindings = list => {
        const keybindingsNew = {};
        const keybindingsFallback = { ...keybindingsDefault };

        for (let i = 0; i < list.length; i++) {
          const isRemove = list[i].command.substring(0, 1) === '-';
          const command = isRemove
            ? list[i].command.substring(1, list[i].command.length)
            : list[i].command;

          if (command in commandsList) {
            if (isRemove) {
              delete keybindingsNew[command];
              delete keybindingsFallback[command];
              continue;
            }
            keybindingsNew[command] = list[i].key;
          }
        }

        for (const command in commandsList) {
          if (Object.hasOwn(commandsList, command)) {
            const key = keybindingsNew[command] || keybindingsFallback[command];
            if (!key) continue;

            // Capitalize first letter of each word
            keybindingsFallback[command] = key.replace(
              /\w+/g,
              w => w.substring(0, 1).toUpperCase() + w.substring(1),
            );
          }
        }

        this.keybindings = keybindingsFallback;
        resolve(keybindingsFallback);
      };

      // Read the keybindings file
      fs.readFile(filePath, (err, data) => {
        try {
          const parsed = err
            ? this.keybindingsDefaultRaw
            : parse(data.toString()) || this.keybindingsDefaultRaw;
          updateKeybindings(parsed);
        } catch (parseError) {
          console.error('Error parsing keybindings.json:', parseError);
          updateKeybindings(this.keybindingsDefaultRaw);
        }
      });
    });
  }

  /**
   * Gets the current keybindings map.
   * @returns {Promise<KeybindingMap>} Promise that resolves to the keybindings map
   */
  async getKeybindings() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.keybindings;
  }

  /**
   * Gets a specific keybinding for a command.
   * @param {string} command - The command name
   * @returns {Promise<string|null>} Promise that resolves to the keybinding or null if not found
   */
  async getKeybinding(command) {
    const keybindings = await this.getKeybindings();
    return keybindings[command] || null;
  }

  /**
   * Checks if a command has a keybinding.
   * @param {string} command - The command name
   * @returns {Promise<boolean>} Promise that resolves to true if the command has a keybinding
   */
  async hasKeybinding(command) {
    const keybinding = await this.getKeybinding(command);
    return keybinding !== null;
  }

  /**
   * Disposes of all watchers and cleans up resources.
   */
  dispose() {
    if (this.settingsWatcher) {
      this.settingsWatcher.dispose();
      this.settingsWatcher = null;
    }
    if (this.keybindingsWatcher) {
      this.keybindingsWatcher.dispose();
      this.keybindingsWatcher = null;
    }
    this.isInitialized = false;
  }
}

module.exports = KeybindingService;
