import { spawn } from 'child_process';
import path from 'path';
import { decode } from 'iconv-lite';
import { validateFilePath, validateExecutablePath } from '../utils/pathValidation';
import { handleError } from '../errorUtils';

const MILLISECONDS_TO_SECONDS = 1000;
const EXIT_CODE_SPAWN_FAILURE = -2;

/**
 * Service class for spawning and managing AutoIt processes: process lifecycle,
 * output piping with code-page conversion, and output-panel reuse.
 */
class ProcessRunner {
  /**
   * Creates a new ProcessRunner instance.
   * @param {Object} options
   * @param {Object} options.config - Configuration object from ai_config
   * @param {import('./ProcessManager').default} options.processManager - Tracks running processes
   * @param {import('./OutputChannelManager').default} options.outputChannelManager - Creates output channels
   * @param {import('./HotkeyManager').default} options.hotkeyManager - Manages AutoIt3Wrapper hotkeys
   * @param {Function} options.getActiveDocumentFileName - Function to get the active document filename
   * @param {Object} options.globalOutputChannel - Global output channel singleton
   */
  constructor({
    config,
    processManager,
    outputChannelManager,
    hotkeyManager,
    getActiveDocumentFileName,
    globalOutputChannel,
  }) {
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
   * @param {boolean} reuseAiOutput - Whether to reuse output panels
   * @returns {Promise<ChildProcess>} The spawned process
   * @throws {Error} If path validation fails or the process fails to spawn
   */
  async run(cmdPath, args = [], reuseAiOutput = true) {
    try {
      const thisFile = this.getActiveDocumentFileName();

      if (thisFile) {
        const fileValidation = validateFilePath(thisFile);
        if (!fileValidation.valid) {
          throw new Error(`Security: ${fileValidation.error}`);
        }
      }

      const execValidation = validateExecutablePath(cmdPath);
      if (!execValidation.valid) {
        throw new Error(`Security: ${execValidation.error}`);
      }

      const processCommand = cmdPath + ' ' + args.join(' ');

      const runnerPrev =
        reuseAiOutput &&
        this.processManager.findRunner({
          status: false,
          thisFile,
          processCommand,
        });

      const id = runnerPrev ? runnerPrev.info.id : this.processManager.nextId();

      const aiOutProcess = this.config.multiOutput
        ? (runnerPrev && !runnerPrev.info.aiOut.void && runnerPrev.info.aiOut) ||
          this.outputChannelManager.createProcessOutputChannel(id, thisFile, 'vscode-autoit-output')
        : this._createVoidOutputChannel();

      const aiOut = this.outputChannelManager.createProxyOutputChannel({
        id,
        aiOutProcess,
      });

      const info = (runnerPrev && runnerPrev.info) || {
        id,
        startTime: new Date().getTime(),
        endTime: 0,
        aiOut: aiOutProcess,
        thisFile,
        processCommand,
        status: true,
      };

      // Spawn failure can surface twice (async 'error' event plus the
      // synchronous missing-pid guard below); keep exit idempotent.
      let exited = false;
      const exit = (code, text) => {
        if (exited) return;
        exited = true;
        this._handleProcessExit(id, code, text, info, aiOut);
      };

      if (!info._aiOut) info._aiOut = aiOut;

      if (runnerPrev) {
        this._handleOutputReuse(runnerPrev, aiOutProcess, info);
      }

      this._clearOutputIfNeeded(aiOutProcess);
      this._showOutputChannel(aiOutProcess);

      const workDir = path.dirname(thisFile);

      await this.hotkeyManager.disable(id);

      const runner = spawn(cmdPath, args, {
        cwd: workDir,
      });

      this._displayProcessCommand(aiOut, id, cmdPath, args, runner.pid);
      this._registerRunner(runner, runnerPrev, info);
      this._setupOutputHandlers(runner, aiOut);

      runner.on('exit', exit);

      // Handle spawn errors that surface asynchronously (e.g. ENOENT) instead
      // of synchronously via a missing pid; without this listener Node
      // treats an unhandled 'error' event as an uncaught exception.
      runner.on('error', error => exit(EXIT_CODE_SPAWN_FAILURE, error.message));

      if (!runner.pid) {
        exit(EXIT_CODE_SPAWN_FAILURE, 'wrong path?');
        throw new Error(`Failed to spawn process: ${cmdPath}`);
      }

      return runner;
    } catch (error) {
      handleError('ProcessRunner.run', error);
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
      await this.hotkeyManager.reset(id);

      code = Number(code);

      info.endTime = new Date().getTime();
      info.status = false;

      aiOut.flush();

      const exitMessage = this._formatExitMessage(code, text, info);
      aiOut.appendLine(exitMessage);

      this.processManager.cleanup();
    } catch (error) {
      handleError('ProcessRunner._handleProcessExit', error);
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
    const time = (info.endTime - info.startTime) / MILLISECONDS_TO_SECONDS;

    // Determine exit code symbol based on code value:
    // '!' = abnormal exit (code outside -1 to 1 range)
    // '>' = warning/info exit (code is 0 or -1)
    // '-' = normal exit (code is 1)
    let codeSymbol;
    if (code > 1 || code < -1) {
      codeSymbol = '!';
    } else if (code < 1) {
      codeSymbol = '>';
    } else {
      codeSymbol = '-';
    }

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
      this.processManager.replaceRunner(runnerPrev.runner, runner, runnerPrev.info);
    } else {
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
        handleError('ProcessRunner._setupOutputHandlers', error);
      }
    };

    runner.stdout.on('data', handleOutput);
    runner.stderr.on('data', handleOutput);
  }
}

export default ProcessRunner;
