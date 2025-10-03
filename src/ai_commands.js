/**
 * @fileoverview Main commands module for AutoIt VSCode extension
 * @module ai_commands
 */

import { window } from 'vscode';
import conf from './ai_config';
import { commandsList as _commandsList, commandsPrefix } from './commandsList';

// Import all command modules
import * as ScriptCommands from './commands/ScriptCommands';
import * as ToolCommands from './commands/ToolCommands';
import * as DebugCommands from './commands/DebugCommands';
import * as UtilityCommands from './commands/UtilityCommands';

// Import debug functions from original modules
import { default as debugRemove } from './commands/debugRemove.js';
import { default as functionTraceAdd } from './commands/functionTraceAdd.js';
import { default as traceRemove } from './commands/trace.js';

const { config } = conf;

/**
 * Main facade class for AutoIt VSCode extension commands.
 * Provides dependency injection, service orchestration, and unified command interface.
 */
class CommandsFacade {
  /**
   * Creates a new CommandsFacade instance with all services initialized.
   */
  constructor() {
    this.config = config;
    this.isInitialized = false;
    this.services = {};
    this.keybindings = null;
  }

  /**
   * Initializes all services and sets up dependencies.
   * This method should be called before using any commands.
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      // Dynamically import all services
      const [
        { default: KeybindingService },
        { default: OutputChannelManager },
        { default: ProcessManager },
        { default: HotkeyManager },
        { default: ProcessRunner },
      ] = await Promise.all([
        import('./services/KeybindingService.js'),
        import('./services/OutputChannelManager.js'),
        import('./services/ProcessManager.js'),
        import('./services/HotkeyManager.js'),
        import('./services/ProcessRunner.js'),
      ]);

      // Initialize keybinding service first
      this.services.keybindingService = new KeybindingService({
        commandsList: _commandsList,
        commandsPrefix,
        keybindingsDefaultRaw: require('../package.json').contributes.keybindings,
      });
      this.keybindings = await this.services.keybindingService.initialize();

      // Create output channel
      const outputChannel = OutputChannelManager.createGlobalOutputChannel(
        'AutoIt (global)',
        'vscode-autoit-output',
      );

      // Store global output channel as singleton
      this.services.globalOutputChannel = outputChannel;

      // Initialize process manager
      this.services.processManager = new ProcessManager(
        this.config,
        outputChannel,
        UtilityCommands.getActiveDocumentFileName,
        `extension-output-${require('../package.json').publisher}.${require('../package.json').name}-#`,
      );

      // Initialize hotkey manager
      this.services.hotkeyManager = new HotkeyManager(this.config);

      // Initialize output channel manager
      this.services.outputChannelManager = new OutputChannelManager(
        this.services.globalOutputChannel,
        this.config,
        this.keybindings,
        this.services.hotkeyManager,
        this.services.processManager,
      );

      // Initialize process runner with all dependencies
      this.services.processRunner = new ProcessRunner(
        this.config,
        this.services.processManager,
        this.services.outputChannelManager,
        this.services.hotkeyManager,
        UtilityCommands.getActiveDocumentFileName,
        this.services.globalOutputChannel,
      );

      // Set up event listeners
      this._setupEventListeners();

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize CommandsFacade:', error);
      throw error;
    }
  }

  /**
   * Sets up event listeners for service coordination.
   * @private
   */
  async _setupEventListeners() {
    try {
      // Dynamically import OutputChannelManager for the event listener
      const { default: OutputChannelManager } = await import('./services/OutputChannelManager.js');

      // Listen for config changes to update services
      conf.addListener(() => {
        if (this.services.processManager) {
          this.services.processManager.cleanup();
        }
      });

      // Listen for visible text editor changes to trim output
      window.onDidChangeVisibleTextEditors(() => {
        OutputChannelManager.trimOutputLines(
          this.services.processManager,
          this.services.globalOutputChannel,
        );
      });
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }

  /**
   * Disposes of all services and cleans up resources.
   * This method should be called when the extension is deactivated.
   * @returns {Promise<void>}
   */
  async dispose() {
    try {
      if (this.services.hotkeyManager) {
        await this.services.hotkeyManager.cleanup();
      }

      if (this.services.keybindingService) {
        this.services.keybindingService.dispose();
      }

      if (this.services.processManager) {
        this.services.processManager.clearFinishedRunners();
      }

      this.services = {};
      this.keybindings = null;
      this.isInitialized = false;
    } catch (error) {
      console.error('Error during CommandsFacade disposal:', error);
    }
  }

  /**
   * Gets the keybindings map.
   * @returns {Object|null} Keybindings map or null if not initialized
   */
  getKeybindings() {
    return this.keybindings;
  }

  /**
   * Gets the process manager instance.
   * @returns {Object|null} Process manager or null if not initialized
   */
  getProcessManager() {
    return this.services.processManager || null;
  }
}

// Create singleton instance
const commandsFacade = new CommandsFacade();

// Export command functions with facade integration
export const runScript = ScriptCommands.runScript;
export const killScript = ScriptCommands.killScript;
export const restartScript = ScriptCommands.restartScript;

export const compile = ToolCommands.compile;
export const tidy = ToolCommands.tidy;
export const check = ToolCommands.check;
export const build = ToolCommands.build;
export const launchHelp = ToolCommands.launchHelp;
export const launchInfo = ToolCommands.launchInfo;
export const launchKoda = ToolCommands.launchKoda;

export const debugMsgBox = DebugCommands.debugMsgBox;
export const debugConsole = DebugCommands.debugConsole;

export const changeParams = UtilityCommands.changeParams;
export const openInclude = UtilityCommands.openInclude;
export const insertHeader = UtilityCommands.insertHeader;

// Re-export debug functions
export { debugRemove, functionTraceAdd, traceRemove };

export const killScriptOpened = (thisFile = null) => {
  return killScript(thisFile || UtilityCommands.getActiveDocumentFileName());
};

// Export facade management functions
export const initializeCommands = () => commandsFacade.initialize();
export const disposeCommands = () => commandsFacade.dispose();
export const getCommandsFacade = () => commandsFacade;

// Export service accessors for advanced usage
export const getProcessManager = () => commandsFacade.getProcessManager();
export const getKeybindings = () => commandsFacade.getKeybindings();
