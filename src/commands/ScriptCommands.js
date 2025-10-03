import { window } from 'vscode';
import ProcessRunner from '../services/ProcessRunner';
import ProcessManager from '../services/ProcessManager';
import OutputChannelManager from '../services/OutputChannelManager';
import HotkeyManager from '../services/HotkeyManager';
import conf from '../ai_config';
import { showErrorMessage, showInformationMessage } from '../ai_showMessage';
import { validateFilePath } from '../utils/pathValidation.js';

const packageJson = require('../../package.json');

const { config } = conf;

// Constants
const STATUS_BAR_MESSAGE_TIMEOUT = 1500; // milliseconds
const SCRIPT_STOP_INFO_TIMEOUT = 10000; // milliseconds
const PATH_PARTS_TO_SHOW = 2; // number of path parts to show in error messages

/**
 * Get the file name of the active document in the editor.
 *
 * Note that `window.activeTextEditor.document.fileName` is not available in some situations
 * (like when `runScript()` is executed in the settings tab).
 *
 * @returns {string} The file name of the active document, or an empty string if it's not available.
 */
function getActiveDocumentFileName() {
  if (!window.activeTextEditor) {
    return '';
  }
  const { document } = window.activeTextEditor;
  if (!document || !document.fileName) {
    return '';
  }
  return document.fileName;
}

// Instantiate services
// Create singleton global channel using cached factory method
const globalOutputChannel = OutputChannelManager.createGlobalOutputChannel(
  'AutoIt (global)',
  'vscode-autoit-output',
);

export { globalOutputChannel };

const processManager = new ProcessManager(
  config,
  globalOutputChannel, // Use the singleton instead of creating a new one
  getActiveDocumentFileName,
  `extension-output-${packageJson.publisher}.${packageJson.name}-#`,
);

const hotkeyManager = new HotkeyManager(config);

const outputChannelManager = new OutputChannelManager(
  globalOutputChannel, // 1st param: globalOutputChannel (was incorrectly config)
  config, // 2nd param: config (was incorrectly {})
  {}, // 3rd param: keybindings
  hotkeyManager, // 4th param: aWrapperHotkey
  processManager, // 5th param: runners (was missing)
);

const processRunner = new ProcessRunner(
  config,
  processManager,
  outputChannelManager,
  hotkeyManager,
  getActiveDocumentFileName,
  globalOutputChannel, // Use the singleton instead of creating a new one
);

/**
 * Runs the active AutoIt script
 * @returns {Promise<void>|undefined} Promise if async operation, undefined otherwise
 */
async function runScript() {
  if (!window.activeTextEditor) {
    showErrorMessage('No active editor found');
    return;
  }

  const thisDoc = window.activeTextEditor.document;
  const thisFile = getActiveDocumentFileName();

  // Check if file is untitled before attempting to save
  if (thisDoc.isUntitled) {
    showErrorMessage(`"${thisFile}" file must be saved first!`);
    return;
  }

  // Validate file path to prevent path traversal attacks
  const fileValidation = validateFilePath(thisFile);
  if (!fileValidation.valid) {
    showErrorMessage(`Security error: ${fileValidation.error}`);
    return;
  }

  // Simplified check - assume keybindings are set if not explicitly handled
  // In a real implementation, you might want to pass keybindings as a parameter or import them

  // Save the file
  const saveResult = await thisDoc.save();

  if (!saveResult) {
    showInformationMessage(`File failed to save, running saved file instead ("${thisFile}")`, {
      timeout: 30000,
    });
  }

  const params = config.consoleParams;
  window.setStatusBarMessage('Running the script...', STATUS_BAR_MESSAGE_TIMEOUT);

  let args;
  if (params) {
    const quoteSplit = /[\w-/]+|"[^"]+"/g;
    const paramArray = params.match(quoteSplit); // split the string by space or quotes

    const cleanParams = paramArray.map(value => {
      return value.replace(/"/g, '');
    });

    args = [
      config.wrapperPath,
      '/run',
      '/prod',
      '/ErrorStdOut',
      '/in',
      thisFile,
      '/UserParams',
      ...cleanParams,
    ];
  } else {
    args = [config.wrapperPath, '/run', '/prod', '/ErrorStdOut', '/in', thisFile];
  }

  try {
    await processRunner.run(
      config.aiPath,
      args,
      config.multiOutput && config.multiOutputReuseOutput,
    );
  } catch (error) {
    console.error('Error running script:', error);
    showErrorMessage(`Failed to run script: ${error.message}`);
  }
}

/**
 * Kills the running AutoIt script
 * @param {string} [thisFile=null] - Specific file to kill, or null for any running script
 * @returns {void}
 */
function killScript(thisFile = null) {
  const data = processManager.findRunner({ status: true, thisFile });
  if (!data) {
    let file = ' ';
    if (thisFile) {
      const parts = thisFile.split('\\');
      file = ` (${parts.slice(-PATH_PARTS_TO_SHOW).join('\\')}) `;
    }
    showInformationMessage(`No script${file}currently is running.`, {
      timeout: SCRIPT_STOP_INFO_TIMEOUT,
    });
    return;
  }

  window.setStatusBarMessage('Stopping the script...', STATUS_BAR_MESSAGE_TIMEOUT);
  data.runner.stdin.pause();
  data.runner.kill();
}

/**
 * Restarts the running AutoIt script
 * @returns {Promise<void>|undefined} Promise if async operation, undefined otherwise
 */
function restartScript() {
  const { runner, info } = processManager.lastRunningOpened || {};

  // If there's a currently running script, kill it and restart when it exits
  if (runner && info?.status) {
    runner.on('exit', () => {
      if (info.callback) {
        clearTimeout(info.timer);
        info.callback();
      }
      // Fire and forget - errors will be handled by runScript internally
      runScript().catch(error => {
        console.error('Error restarting script after exit:', error);
      });
    });
    killScript(info.thisFile);
    return;
  }

  // No running script, just start one
  return runScript();
}

export { runScript, killScript, restartScript };
