import { getActiveDocumentFileName } from './editorActions';
import { window } from 'vscode';
import fs from 'fs';
import { spawn } from 'child_process';
import { getIncludeText } from '../utils/fsCache';
import { escapeRegexLiteral } from '../utils/regexPatterns';
import conf from '../config/ai_config';
import { getServiceStack } from '../services/commandServiceStack';
import { validateExecutablePath } from '../utils/pathValidation';

// Timeout used for status bar messages (ms)
const STATUS_MSG_TIMEOUT_MS = 1500;

const { config, findFilepath } = conf;

/**
 * Shared save/validate/run lifecycle for the AutoIt3Wrapper commands.
 * @param {object} options - Command configuration.
 * @param {string[]} options.flags - Wrapper flags inserted between wrapperPath and '/in'.
 * @param {string|((file: string) => string)} options.statusMessage - Status bar text or builder.
 * @param {boolean} options.dirtyIsError - Abort on dirty-after-save instead of continuing.
 * @param {string} [options.progressVerb] - Verb for the dirty-continue notice (e.g. 'compiling').
 * @returns {Promise<void>}
 */
async function runWrapperCommand({ flags, statusMessage, dirtyIsError, progressVerb }) {
  const thisDoc = window.activeTextEditor.document;
  const thisFile = getActiveDocumentFileName();
  // Save the file
  await thisDoc.save();
  if (thisDoc.isUntitled) {
    window.showErrorMessage(`"${thisFile}" file must be saved first!`);
    return;
  }

  if (thisDoc.isDirty) {
    if (dirtyIsError) {
      window.showErrorMessage(`File failed to save ("${thisFile}")`);
      return;
    }
    window.showInformationMessage(
      `File failed to save, ${progressVerb} saved file instead ("${thisFile}")`,
    );
  }

  window.setStatusBarMessage(
    typeof statusMessage === 'function' ? statusMessage(thisFile) : statusMessage,
    STATUS_MSG_TIMEOUT_MS,
  );

  // Launch the AutoIt Wrapper executable with the script's path
  await getServiceStack().processRunner.run(config.aiPath, [
    config.wrapperPath,
    ...flags,
    '/in',
    thisFile,
  ]);
}

/**
 * Compiles the AutoIt script using AutoIt3Wrapper.
 * @returns {Promise<void>}
 */
async function compile() {
  await runWrapperCommand({
    flags: ['/ShowGui', '/prod'],
    statusMessage: 'Compiling script...',
    dirtyIsError: false,
    progressVerb: 'compiling',
  });
}

/**
 * Tidies the AutoIt script using AutoIt3Wrapper.
 * @returns {Promise<void>}
 */
async function tidy() {
  await runWrapperCommand({
    flags: ['/Tidy'],
    statusMessage: thisFile => `Tidying script...${thisFile}`,
    dirtyIsError: true,
  });
}

/**
 * Checks the AutoIt script syntax using AutoIt3Wrapper.
 * @returns {Promise<void>}
 */
async function check() {
  await runWrapperCommand({
    flags: ['/AU3check', '/prod'],
    statusMessage: thisFile => `Checking script...${thisFile}`,
    dirtyIsError: true,
  });
}

/**
 * Builds the AutoIt script using AutoIt3Wrapper.
 * @returns {Promise<void>}
 */
async function build() {
  await runWrapperCommand({
    flags: ['/NoStatus', '/prod'],
    statusMessage: 'Building script...',
    dirtyIsError: false,
    progressVerb: 'building',
  });
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
  const kodaPathValidation = validateExecutablePath(config.kodaPath);
  if (!kodaPathValidation.valid) {
    window.showErrorMessage(`Koda Form Designer not found: ${config.kodaPath}`);
    return;
  }

  getServiceStack().processRunner.run(config.kodaPath, []);
}

export { compile, tidy, check, build, launchHelp, launchInfo, launchKoda };
