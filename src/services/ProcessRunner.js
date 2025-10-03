const { spawn } = require('child_process');
const path = require('path');
const { decode } = require('iconv-lite');

/**
 * Service class for spawning and managing AutoIt processes with comprehensive functionality
 * for process lifecycle management, output handling, and reuse logic.
 *
 * Features:
 * - Process spawning with proper configuration
 * - Output piping with encoding conversion
 * - Process lifecycle management (start, run, exit)
 * - Working directory setup
 * - Encoding handling for output code page conversion
 * - Process reuse with robust logic
 * - Dependency injection for testability and modularity
 */
class ProcessRunner {
  /**
   * @typedef {Object} ProcessManager
   * @typedef {Object} OutputChannelManager
   * @typedef {Object} HotkeyManager
   * @typedef {Object} ChildProcess
   */

  /**
   * Creates a new ProcessRunner instance.
   * @param {Object} config - Configuration object from ai_config
   * @param {ProcessManager} processManager - ProcessManager instance for tracking running processes
   * @param {OutputChannelManager} outputChannelManager - OutputChannelManager for creating output channels
   * @param {HotkeyManager} hotkeyManager - HotkeyManager for managing AutoIt3Wrapper hotkeys
   * @param {Function} getActiveDocumentFileName - Function to get the active document filename
   * @param {Object} globalOutputChannel - Global output channel singleton
   */
  constructor(
    config,
    processManager,
    outputChannelManager,
    hotkeyManager,
    getActiveDocumentFileName,
    globalOutputChannel,
  ) {
    this.config = config;
    this.processManager = processManager;
    this.outputChannelManager = outputChannelManager;
    this.hotkeyManager = hotkeyManager;
    this.getActiveDocumentFileName = getActiveDocumentFileName;
    this.globalOutputChannel = globalOutputChannel;
  }

  /**
   * Runs a process with the given command and arguments
   * @param {string} cmdPath - Path to the executable
   * @param {string[]} args - Command line arguments
   * @param {boolean} bAiOutReuse - Whether to reuse output panels
   * @returns {Promise<ChildProcess>} The spawned process
   */
  async run(cmdPath, args = [], bAiOutReuse = true) {
    try {
      const thisFile = this.getActiveDocumentFileName();
      const processCommand = cmdPath + ' ' + args.join(' ');

      // Find existing runner for reuse if enabled
      const runnerPrev =
        bAiOutReuse &&
        this.processManager.findRunner({
          status: false,
          thisFile,
          processCommand,
        });

      const id = runnerPrev ? runnerPrev.info.id : ++this.processManager.id;

      // Create or reuse output channel
      const aiOutProcess = this.config.multiOutput
        ? (runnerPrev && !runnerPrev.info.aiOut.void && runnerPrev.info.aiOut) ||
          this.outputChannelManager.constructor.createProcessOutputChannel(
            id,
            thisFile,
            'vscode-autoit-output',
          )
        : this._createVoidOutputChannel();

      // Create proxy output channel with formatting
      const aiOut = this.outputChannelManager.createProxyOutputChannel({
        id,
        aiOutProcess,
      });

      // Get or create runner info
      const info = (runnerPrev && runnerPrev.info) || {
        id,
        startTime: new Date().getTime(),
        endTime: 0,
        aiOut: aiOutProcess,
        thisFile,
        processCommand,
        status: true,
      };

      // Set up exit handler
      const exit = (code, text) => {
        this._handleProcessExit(id, code, text, info, aiOut);
      };

      // Store internal output reference
      if (!info._aiOut) info._aiOut = aiOut;

      // Handle output panel reuse
      if (runnerPrev) {
        this._handleOutputReuse(runnerPrev, aiOutProcess, info);
      }

      // Clear output if configured
      this._clearOutputIfNeeded(aiOutProcess);

      // Show output channel
      this._showOutputChannel(aiOutProcess);

      // Set working directory
      const workDir = path.dirname(thisFile);

      // Disable hotkeys
      await this.hotkeyManager.disable(id);

      // Spawn the process
      const runner = spawn(cmdPath, args, {
        cwd: workDir,
      });

      // Display process command line
      this._displayProcessCommand(aiOut, id, cmdPath, args, runner.pid);

      // Register runner
      this._registerRunner(runner, runnerPrev, info);

      // Set up output handlers
      this._setupOutputHandlers(runner, aiOut);

      // Set up exit handler
      runner.on('exit', exit);

      // Handle spawn errors
      if (!runner.pid) {
        exit(-2, 'wrong path?');
        return runner;
      }

      return runner;
    } catch (error) {
      console.error('Error in ProcessRunner.run:', error);
      throw error;
    }
  }

  /**
   * Creates a void output channel that discards all output
   * @private
   * @returns {Object} Void output channel proxy
   */
  _createVoidOutputChannel() {
    return new Proxy(
      {},
      {
        get(target, prop) {
          if (prop === 'void') {
            return true;
          }
          return () => {};
        },
      },
    );
  }

  /**
   * Handles process exit with cleanup and output flushing
   * @private
   * @param {number} id - Process ID
   * @param {number} code - Exit code
   * @param {string} text - Additional exit text
   * @param {Object} info - Runner info object
   * @param {Object} aiOut - Output channel proxy
   */
  async _handleProcessExit(id, code, text, info, aiOut) {
    try {
      // Reset hotkeys
      await this.hotkeyManager.reset(id);

      // Convert null code to 0
      code = Number(code);

      // Update runner info
      info.endTime = new Date().getTime();
      info.status = false;

      // Flush output
      aiOut.flush();

      // Display exit message
      const exitMessage = this._formatExitMessage(code, text, info);
      aiOut.appendLine(exitMessage);

      // Trigger cleanup
      this.processManager.cleanup();
    } catch (error) {
      console.error('Error in _handleProcessExit:', error);
    }
  }

  /**
   * Formats the exit message for display
   * @private
   * @param {number} code - Exit code
   * @param {string} text - Additional text
   * @param {Object} info - Runner info
   * @returns {string} Formatted exit message
   */
  _formatExitMessage(code, text, info) {
    const time = (info.endTime - info.startTime) / 1000;
    const codeSymbol = code > 1 || code < -1 ? '!' : code < 1 ? '>' : '-';
    const textPart = text ? ` (${text})` : '';
    return `${codeSymbol}>Exit code ${code}${textPart} Time: ${time}`;
  }

  /**
   * Handles output panel reuse logic
   * @private
   * @param {Object} runnerPrev - Previous runner data
   * @param {Object} aiOutProcess - Process output channel
   * @param {Object} info - Runner info
   */
  _handleOutputReuse(runnerPrev, aiOutProcess, info) {
    if (runnerPrev.info.aiOut.void) {
      runnerPrev.info.aiOut = aiOutProcess;
    }

    clearTimeout(runnerPrev.info.timer);
    runnerPrev.info.startTime = new Date().getTime();
    info.status = true;

    if (this.config.clearOutput) {
      aiOutProcess.clear();
    }

    // Force displaying ID
    this.processManager.lastId = 0;
  }

  /**
   * Clears output channel if configured
   * @private
   * @param {Object} _aiOutProcess - Process output channel (unused in this implementation)
   */
  _clearOutputIfNeeded(_aiOutProcess) {
    if (!this.config.multiOutput && this.config.clearOutput) {
      this.globalOutputChannel.clear();
    }
  }

  /**
   * Shows the appropriate output channel
   * @private
   * @param {Object} aiOutProcess - Process output channel
   */
  _showOutputChannel(aiOutProcess) {
    const channelToShow = this.config.multiOutput ? aiOutProcess : this.globalOutputChannel;
    channelToShow.show(true);
  }

  /**
   * Displays the process command line in output
   * @private
   * @param {Object} aiOut - Output channel proxy
   * @param {number} id - Process ID
   * @param {string} cmdPath - Command path
   * @param {string[]} args - Command arguments
   * @param {number} pid - Process PID
   */
  _displayProcessCommand(aiOut, id, cmdPath, args, pid) {
    const quotedArgs = args
      .map((arg, index, arr) => (!index || arr[index - 1] === '/in' ? `"${arg}"` : arg))
      .join(' ');

    aiOut.appendLine(`Starting process #${id}\r\n"${cmdPath}" ${quotedArgs} [PID ${pid || 'n/a'}]`);
  }

  /**
   * Registers the runner with the process manager
   * @private
   * @param {ChildProcess} runner - Spawned process
   * @param {Object} runnerPrev - Previous runner data
   * @param {Object} info - Runner info
   */
  _registerRunner(runner, runnerPrev, info) {
    if (runnerPrev) {
      // Update existing runner
      this.processManager.runners.set(runner, runnerPrev.info);
      this.processManager.runners.delete(runnerPrev.runner);
    } else {
      // Add new runner
      this.processManager.addRunner(runner, info);
    }
  }

  /**
   * Sets up stdout and stderr handlers with encoding conversion
   * @private
   * @param {ChildProcess} runner - Spawned process
   * @param {Object} aiOut - Output channel proxy
   */
  _setupOutputHandlers(runner, aiOut) {
    const handleOutput = data => {
      try {
        const output = this.config.outputCodePage
          ? decode(data, this.config.outputCodePage)
          : data.toString();
        aiOut.append(output);
      } catch (error) {
        console.error('Error processing output:', error);
      }
    };

    runner.stdout.on('data', handleOutput);
    runner.stderr.on('data', handleOutput);
  }
}

module.exports = ProcessRunner;
