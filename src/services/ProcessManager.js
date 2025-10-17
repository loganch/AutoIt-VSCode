const { EventEmitter } = require('events');

const MILLISECONDS_PER_SECOND = 1000;

/**
 * @typedef {Object} RunnerInfo
 * @property {number} id - Process ID
 * @property {number} startTime - Start timestamp
 * @property {number} endTime - End time timestamp
 * @property {boolean} status - Running status
 * @property {string} thisFile - Associated file path
 * @property {string} processCommand - Process command line
 * @property {Object} aiOut - Output channel for the process
 * @property {Object} _aiOut - Internal output proxy
 * @property {number|null} timer - Timeout timer ID
 * @property {Function} callback - Cleanup callback function
 */

/**
 * ProcessManager class handles process tracking, discovery, cleanup, and output visibility detection.
 * Uses dependency injection for configuration and output channels.
 * Emits events for process lifecycle changes.
 */
class ProcessManager extends EventEmitter {
  /**
   * Creates a new ProcessManager instance.
   * @param {Object} config - Configuration object with process management settings
   * @param {Object} outputChannel - Main output channel for logging
   * @param {Function} getActiveDocumentFileName - Function to get active document filename
   * @param {string} outputName - Base name for output channels
   */
  constructor(config, outputChannel, getActiveDocumentFileName, outputName) {
    super();
    this.config = config;
    this.outputChannel = outputChannel;
    this.getActiveDocumentFileName = getActiveDocumentFileName;
    this.outputName = outputName;
    this.runners = new Map();
    this.isNewLine = true;
    this.lastId = 0;
    this.id = 0;
  }

  /**
   * Gets the last running process.
   * @returns {Object|null} The runner and its info, or null if none found
   */
  get lastRunning() {
    return this.findRunner({ status: true, thisFile: null });
  }

  /**
   * Gets the last running process for the currently opened file.
   * @returns {Object|null} The runner and its info, or null if none found
   */
  get lastRunningOpened() {
    return this.findRunner({ status: true, thisFile: this.getActiveDocumentFileName() });
  }

  /**
   * Find the first runner in the list that matches the given filter criteria.
   * @param {Object} [filter={ status: true, thisFile: null }] - An object containing the filter criteria.
   * @param {boolean} [filter.status=true] - The status of the runner to look for.
   * @param {string|null} [filter.thisFile=null] - The file associated with the runner to look for.
   * @returns {Object|null} The runner and its associated info, or null if no runner is found.
   */
  findRunner(filter = { status: true, thisFile: null }) {
    try {
      const list = [...this.runners.entries()].reverse();
      const found = list.find(([_, info]) =>
        Object.entries(filter).every(([key, value]) => value === null || value === info[key]),
      );

      return found ? { runner: found[0], info: found[1] } : null;
    } catch (error) {
      this.outputChannel.appendLine(`[ProcessManager] Error in findRunner: ${error.message}`);
      return null;
    }
  }

  /**
   * Checks if the AutoIt output window is currently visible.
   * @returns {Object|null} An object containing the ID, name, and output window of the AutoIt output, or null if the output is not visible
   */
  isAiOutVisible() {
    try {
      const { window } = require('vscode');
      for (let i = 0; i < window.visibleTextEditors.length; i += 1) {
        const editor = window.visibleTextEditors[i];
        const { fileName } = editor.document;
        if (fileName.startsWith(this.outputName)) {
          const rest = fileName.slice(this.outputName.length);
          const index = rest.indexOf('-');
          if (index !== -1) {
            const id = rest.slice(0, index);
            const name = rest.slice(index + 1);
            return { id, name, output: editor };
          }
        }
      }
      return null;
    } catch (error) {
      this.outputChannel.appendLine(`[ProcessManager] Error in isAiOutVisible: ${error.message}`);
      return null;
    }
  }

  /**
   * Removes finished runners from the list and handles their cleanup
   */
  cleanup() {
    try {
      const now = new Date().getTime();
      const timeout = this.config.multiOutputFinishedTimeout * MILLISECONDS_PER_SECOND;
      const endTime = now - timeout;
      // get list of finished processes, ordered by endTime descent
      const values = [...this.runners.entries()]
        .filter(a => !a[1].status)
        .sort((a, b) => b[1].endTime - a[1].endTime);
      for (let i = 0; i < values.length; i += 1) {
        const [runner, info] = values[i];
        clearTimeout(info.timer);
        if (
          i >= this.config.multiOutputMaxFinished ||
          (this.config.multiOutputFinishedTimeout && info.endTime < endTime)
        ) {
          this.cleanupFinishedRunner(info, runner);
        } else {
          info.timer = this.config.multiOutputFinishedTimeout
            ? setTimeout(info.callback.bind(this), info.endTime - endTime)
            : null;
        }
      }
      this.emit('cleanupCompleted');
    } catch (error) {
      this.outputChannel.appendLine(`[ProcessManager] Error in cleanup: ${error.message}`);
    }
  }

  /**
   * Cleans up a finished runner by flushing its output and disposing of its output window, if necessary.
   * @param {RunnerInfo} info - Information about the finished runner, including its callback and output window.
   * @param {Object} runner - The runner process object
   */
  cleanupFinishedRunner(info, runner) {
    try {
      const localAiOutCommon = this.outputChannel;
      info.callback = () => {
        try {
          info._aiOut.flush();
          if (!info.aiOut.void && info.aiOut !== localAiOutCommon) {
            info.aiOut.dispose();
          }
          const aiOutVisible = this.isAiOutVisible();
          if (aiOutVisible && aiOutVisible.name === info.aiOut.name) {
            localAiOutCommon.show(true); // switch to common output
          }
          this.runners.delete(runner);
          this.emit('runnerCleaned', { id: info.id, file: info.thisFile });
        } catch (error) {
          this.outputChannel.appendLine(
            `[ProcessManager] Error in cleanup callback: ${error.message}`,
          );
        }
      };
      info.callback();
    } catch (error) {
      this.outputChannel.appendLine(
        `[ProcessManager] Error in cleanupFinishedRunner: ${error.message}`,
      );
    }
  }

  /**
   * Adds a new runner to the tracking list.
   * @param {Object} runner - The process runner object
   * @param {RunnerInfo} info - The runner information
   */
  addRunner(runner, info) {
    try {
      this.runners.set(runner, info);
      this.emit('runnerAdded', { id: info.id, file: info.thisFile, command: info.processCommand });
    } catch (error) {
      this.outputChannel.appendLine(`[ProcessManager] Error in addRunner: ${error.message}`);
    }
  }

  /**
   * Updates the status of a runner.
   * @param {Object} runner - The process runner object
   * @param {boolean} status - The new status
   */
  updateRunnerStatus(runner, status) {
    try {
      const info = this.runners.get(runner);
      if (info) {
        info.status = status;
        if (!status) {
          info.endTime = new Date().getTime();
          this.emit('runnerFinished', {
            id: info.id,
            file: info.thisFile,
            exitCode: info.exitCode,
          });
        }
      }
    } catch (error) {
      this.outputChannel.appendLine(
        `[ProcessManager] Error in updateRunnerStatus: ${error.message}`,
      );
    }
  }

  /**
   * Gets all current runners.
   * @returns {Map} Map of runners
   */
  getAllRunners() {
    return this.runners;
  }

  /**
   * Clears all finished runners immediately.
   */
  clearFinishedRunners() {
    try {
      const finished = [...this.runners.entries()].filter(([_, info]) => !info.status);
      finished.forEach(([runner, info]) => {
        clearTimeout(info.timer);
        this.cleanupFinishedRunner(info, runner);
      });
      this.emit('finishedRunnersCleared');
    } catch (error) {
      this.outputChannel.appendLine(
        `[ProcessManager] Error in clearFinishedRunners: ${error.message}`,
      );
    }
  }
}

module.exports = ProcessManager;
