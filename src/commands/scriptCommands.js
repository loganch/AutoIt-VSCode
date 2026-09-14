import { window } from 'vscode';
import conf from '../config/ai_config';
import {
  showErrorMessage,
  showInformationMessage,
  showWarningMessage,
} from '../config/ai_showMessage';
import { getActiveDocumentFileName } from './editorActions';
import { validateFilePath } from '../utils/pathValidation.js';
import { validateParameterString } from '../utils/parameterValidation.js';
import { getServiceStack } from '../services/commandServiceStack';
import { handleError } from '../errorUtils';

const { config } = conf;

// Constants
const STATUS_BAR_MESSAGE_TIMEOUT = 1500; // milliseconds
const SCRIPT_STOP_INFO_TIMEOUT = 10000; // milliseconds
const PATH_PARTS_TO_SHOW = 2; // number of path parts to show in error messages

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
    // Check parameters for potentially dangerous patterns and warn
    const paramValidation = validateParameterString(params);

    if (paramValidation.hasWarnings) {
      const warningMessages = paramValidation.warnings.join('\n');
      showWarningMessage(
        `Warning: Console parameters contain potentially dangerous characters:\n${warningMessages}\n\nParameters are passed safely via spawn(), but this may indicate unintended input.`,
        { timeout: 15000 },
      );
    }

    args = [
      config.wrapperPath,
      '/run',
      '/prod',
      '/ErrorStdOut',
      '/in',
      thisFile,
      '/UserParams',
      ...paramValidation.sanitized,
    ];
  } else {
    args = [config.wrapperPath, '/run', '/prod', '/ErrorStdOut', '/in', thisFile];
  }

  try {
    await getServiceStack(getActiveDocumentFileName).processRunner.run(
      config.aiPath,
      args,
      config.multiOutput && config.multiOutputReuseOutput,
    );
  } catch (error) {
    handleError('runScript', error, true);
  }
}

/**
 * Kills the running AutoIt script
 * @param {string} [thisFile=null] - Specific file to kill, or null for any running script
 * @returns {void}
 */
function killScript(thisFile = null) {
  const activeRun = getServiceStack(getActiveDocumentFileName).processManager.findRunner({
    status: true,
    thisFile,
  });
  if (!activeRun) {
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
  activeRun.runner.stdin.pause();
  activeRun.runner.kill();
}

/**
 * Restarts the running AutoIt script
 * @returns {Promise<void>|undefined} Promise if async operation, undefined otherwise
 */
function restartScript() {
  const { runner, info } =
    getServiceStack(getActiveDocumentFileName).processManager.lastRunningOpened || {};

  // If there's a currently running script, kill it and restart when it exits
  if (runner && info?.status) {
    runner.on('exit', () => {
      if (info.callback) {
        clearTimeout(info.timer);
        info.callback();
      }
      // Fire and forget - errors will be handled by runScript internally
      runScript().catch(error => {
        handleError('restartScript', error);
      });
    });
    killScript(info.thisFile);
    return;
  }

  // No running script, just start one
  return runScript();
}

export { runScript, killScript, restartScript };
