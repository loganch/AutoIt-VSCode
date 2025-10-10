import { globalOutputChannel } from './ScriptCommands.js';
const { window } = require('vscode');
const fs = require('fs');
const { spawn } = require('child_process');
const { findFilepath, getIncludeText } = require('../util');
const conf = require('../ai_config').default;
const ProcessRunner = require('../services/ProcessRunner');
const ProcessManager = require('../services/ProcessManager');
const OutputChannelManager = require('../services/OutputChannelManager');
const HotkeyManager = require('../services/HotkeyManager');

// Timeout used for status bar messages (ms)
const STATUS_MSG_TIMEOUT_MS = 1500;

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
const processManager = new ProcessManager(
  config,
  globalOutputChannel,
  getActiveDocumentFileName,
  'extension-output-${require("../../package.json").publisher}.${require("../../package.json").name}-#',
);
const hotkeyManager = new HotkeyManager(config);
const outputChannelManager = new OutputChannelManager(
  globalOutputChannel,
  config,
  {},
  hotkeyManager,
  processManager,
);
const processRunner = new ProcessRunner(
  config,
  processManager,
  outputChannelManager,
  hotkeyManager,
  getActiveDocumentFileName,
  globalOutputChannel,
);

/**
 * Compiles the AutoIt script using AutoIt3Wrapper.
 * @returns {Promise<void>}
 */
async function compile() {
  const thisDoc = window.activeTextEditor.document;
  const thisFile = getActiveDocumentFileName();
  // Save the file
  await thisDoc.save();
  if (thisDoc.isUntitled) {
    window.showErrorMessage(`"${thisFile}" file must be saved first!`);
    return;
  }

  if (thisDoc.isDirty) {
    window.showInformationMessage(
      `File failed to save, compiling saved file instead ("${thisFile}")`,
    );
  }

  window.setStatusBarMessage('Compiling script...', STATUS_MSG_TIMEOUT_MS);

  // Launch the AutoIt Wrapper executable with the script's path
  await processRunner.run(config.aiPath, [
    config.wrapperPath,
    '/ShowGui',
    '/prod',
    '/in',
    thisFile,
  ]);
}

/**
 * Tidies the AutoIt script using AutoIt3Wrapper.
 * @returns {Promise<void>}
 */
async function tidy() {
  const thisDoc = window.activeTextEditor.document;
  const thisFile = getActiveDocumentFileName();

  // Save the file
  await thisDoc.save();
  if (thisDoc.isUntitled) {
    window.showErrorMessage(`"${thisFile}" file must be saved first!`);
    return;
  }

  if (thisDoc.isDirty) {
    window.showErrorMessage(`File failed to save ("${thisFile}")`);
    return;
  }

  window.setStatusBarMessage(`Tidying script...${thisFile}`, STATUS_MSG_TIMEOUT_MS);

  // Launch the AutoIt Wrapper executable with the script's path
  await processRunner.run(config.aiPath, [config.wrapperPath, '/Tidy', '/in', thisFile]);
}

/**
 * Checks the AutoIt script syntax using AutoIt3Wrapper.
 * @returns {Promise<void>}
 */
async function check() {
  const thisDoc = window.activeTextEditor.document;
  const thisFile = getActiveDocumentFileName();

  // Save the file
  await thisDoc.save();
  if (thisDoc.isUntitled) {
    window.showErrorMessage(`"${thisFile}" file must be saved first!`);
    return;
  }

  if (thisDoc.isDirty) {
    window.showErrorMessage(`File failed to save ("${thisFile}")`);
    return;
  }

  window.setStatusBarMessage(`Checking script...${thisFile}`, STATUS_MSG_TIMEOUT_MS);

  // Launch the AutoIt Wrapper executable with the script's path
  await processRunner.run(config.aiPath, [
    config.wrapperPath,
    '/AU3check',
    '/prod',
    '/in',
    thisFile,
  ]);
}

/**
 * Builds the AutoIt script using AutoIt3Wrapper.
 * @returns {Promise<void>}
 */
async function build() {
  const thisDoc = window.activeTextEditor.document;
  const thisFile = getActiveDocumentFileName();

  // Save the file
  await thisDoc.save();
  if (thisDoc.isUntitled) {
    window.showErrorMessage(`"${thisFile}" file must be saved first!`);
    return;
  }

  if (thisDoc.isDirty) {
    window.showInformationMessage(
      `File failed to save, building saved file instead ("${thisFile}")`,
    );
  }

  window.setStatusBarMessage('Building script...', STATUS_MSG_TIMEOUT_MS);

  // Launch the AutoIt Wrapper executable with the script's path
  await processRunner.run(config.aiPath, [
    config.wrapperPath,
    '/NoStatus',
    '/prod',
    '/in',
    thisFile,
  ]);
}

/**
 * Launches AutoIt help for the selected word or general help
 * @returns {void}
 */
function launchHelp() {
  const editor = window.activeTextEditor;
  const wordRange = editor.document.getWordRangeAtPosition(editor.selection.start);

  if (!wordRange) {
    spawn(config.helpPath, [], { detached: true });
    return;
  }

  // Get the selected text and launch it
  const doc = editor.document;
  const query = doc.getText(doc.getWordRangeAtPosition(editor.selection.active));
  const findPrefix = /^[_]+[a-zA-Z0-9]+_/;
  const prefix = findPrefix.exec(query);

  window.setStatusBarMessage(`Searching documentation for ${query}`, STATUS_MSG_TIMEOUT_MS);

  let paths;
  if (prefix) {
    paths = config.smartHelp[prefix[0]];
  }
  if (prefix && paths) {
    // Make sure help file exists
    if (!fs.existsSync(paths.chmPath)) {
      window.showErrorMessage(`Unable to locate ${paths.chmPath}`);
      return;
    }

    const regex = new RegExp(`\\bFunc\\s+${query}\\s*\\(`, 'g');
    const udfPaths = paths.udfPath;

    for (let j = 0; j < udfPaths.length; j += 1) {
      let filePath = udfPaths[j];
      if (!fs.existsSync(filePath)) {
        filePath = findFilepath(filePath, true);
        if (!filePath) {
          continue;
        }
      }
      const text = getIncludeText(filePath);
      const found = text.match(regex);

      if (found) {
        spawn('hh', [`mk:@MSITStore:${paths.chmPath}::/funcs/${query}.htm`], { detached: true });
        return;
      }
    }
  }

  spawn(config.helpPath, [query], { detached: true });
}

/**
 * Launches AutoIt info tool
 * @returns {void}
 */
function launchInfo() {
  spawn(config.infoPath, [], { detached: true });
}

/**
 * Launches Koda Form Designer
 * @returns {void}
 */
function launchKoda() {
  processRunner.run(config.kodaPath, []);
}

export { compile, tidy, check, build, launchHelp, launchInfo, launchKoda };
