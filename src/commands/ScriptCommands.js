import { window } from 'vscode';
import ProcessRunner from '../services/ProcessRunner';
import ProcessManager from '../services/ProcessManager';
import OutputChannelManager from '../services/OutputChannelManager';
import HotkeyManager from '../services/HotkeyManager';
import conf from '../ai_config';
import { showErrorMessage, showInformationMessage } from '../ai_showMessage';

const { config } = conf;

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
  `extension-output-${require('../../package.json').publisher}.${require('../../package.json').name}-#`,
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
  const thisDoc = window.activeTextEditor.document;
  const thisFile = getActiveDocumentFileName();

  // Simplified check - assume keybindings are set if not explicitly handled
  // In a real implementation, you might want to pass keybindings as a parameter or import them

  // Save the file
  const saveResult = await thisDoc.save();
  if (thisDoc.isUntitled) {
    window.showErrorMessage(`"${thisFile}" file must be saved first!`);
    return;
  }

  if (!saveResult) {
    showInformationMessage(`File failed to save, running saved file instead ("${thisFile}")`, {
      timeout: 30000,
    });
  }

  const params = config.consoleParams;
  window.setStatusBarMessage('Running the script...', 1500);

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
    const file = thisFile ? ` (${thisFile.split('\\').splice(-2, 2).join('\\')}) ` : ' ';
    showInformationMessage(`No script${file}currently is running.`, { timeout: 10000 });
    return;
  }

  window.setStatusBarMessage('Stopping the script...', 1500);
  data.runner.stdin.pause();
  data.runner.kill();
}

/**
 * Restarts the running AutoIt script
 * @returns {Promise<void>|undefined} Promise if async operation, undefined otherwise
 */
async function restartScript() {
  const { runner, info } = processManager.lastRunningOpened || {};
  if (runner) {
    runner.on('exit', () => {
      if (info.callback) {
        clearTimeout(info.timer);
        info.callback();
      }
      runScript();
    });
    if (info.status) {
      killScript(info.thisFile);
      return;
    }
  }
  return runScript();
}

export { runScript, killScript, restartScript };
