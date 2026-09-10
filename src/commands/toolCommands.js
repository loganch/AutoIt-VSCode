import { getActiveDocumentFileName } from './editorActions';
import { window } from 'vscode';
import fs from 'fs';
import { spawn } from 'child_process';
import { getIncludeText } from '../utils/fsCache';
import { escapeRegexLiteral } from '../utils/regexPatterns';
import conf from '../config/ai_config';
import { findFilepath } from '../config/pathResolution';
import { processRunner } from '../services/commandServiceStack';
import { validateExecutablePath } from '../utils/pathValidation';

// Timeout used for status bar messages (ms)
const STATUS_MSG_TIMEOUT_MS = 1500;

const { config } = conf;

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
  const helpPathValidation = validateExecutablePath(config.helpPath);
  if (!helpPathValidation.valid) {
    window.showErrorMessage(`AutoIt help file not found: ${config.helpPath}`);
    return;
  }

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

    const escapedQuery = escapeRegexLiteral(query);
    const regex = new RegExp(`\\bFunc\\s+${escapedQuery}\\s*\\(`, 'g');
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
  const infoPathValidation = validateExecutablePath(config.infoPath);
  if (!infoPathValidation.valid) {
    window.showErrorMessage(`AutoIt Window Info tool not found: ${config.infoPath}`);
    return;
  }

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
