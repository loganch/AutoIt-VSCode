import { globalOutputChannel } from './ScriptCommands.js';
const { window, Position, Uri } = require('vscode');
const path = require('path');
const fs = require('fs');
const { showErrorMessage } = require('../ai_showMessage');
const { findFilepath, functionDefinitionRegex, setRegExpFlags } = require('../util');

import aiConfig from '../ai_config';
const { config } = aiConfig;
const aiOutCommon = globalOutputChannel;

const SUBSTRING_DOUBLE_UNDERSCORE_LENGTH = 2;
const SUBSTRING_BYREF_LENGTH = 5;
const BYREF_PREFIX_LENGTH = 6;
const PARAMETER_PAD_LENGTH = 21;

const runners = {
  isAiOutVisible() {
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
  },
  outputName: `extension-output-${require('../../package.json').publisher}.${require('../../package.json').name}-#`,
};

/**
 * Gets the file name of the active document in the editor
 * @returns {string} The file name or empty string if not available
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

/**
 * Returns the current time in a specific format.
 * @returns {string} The current time in the format "hh:mm:ss.ms".
 */
function getTime() {
  try {
    return new Date()
      .toLocaleString('sv', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        fractionalSecondDigits: 3,
      })
      .replace(',', '.');
  } catch (error) {
    console.error('Error formatting time:', error);
    return new Date().toISOString();
  }
}

/**
 * Trims the output text in the visible AutoIt output to the max number of lines
 * set in the configuration.
 *
 * If the number of lines in the output text is more than the max, the excess lines
 * are removed and the rest are displayed.
 * @returns {void}
 */
const trimOutputLines = () => {
  try {
    const out = runners.isAiOutVisible();
    if (!out || !config.outputMaxHistoryLines) return;

    if (out.output.document.lineCount > config.outputMaxHistoryLines) {
      const text = out.output.document.getText();
      const lines = text.split(/\r?\n/);
      const outputText = lines.slice(-config.outputMaxHistoryLines).join('\r\n');
      aiOutCommon.replace(outputText);
    }
  } catch (error) {
    console.error('Error trimming output lines:', error);
  }
};

/**
 * Prompts the user to enter space-separated parameters to send to the command line when scripts are run.
 * Wraps single parameters with one or more spaces with quotes.
 * Updates the configuration with the new parameters and displays a message to the user.
 * @returns {Promise<void>}
 */
const changeConsoleParams = async () => {
  try {
    const currentParams = config.consoleParams;

    const input = await window.showInputBox({
      placeHolder: 'param "param with spaces" 3',
      value: currentParams,
      prompt:
        'Enter space-separated parameters to send to the command line when scripts are run. Wrap single parameters with one or more spaces with quotes.',
    });

    if (input === undefined) {
      return; // User cancelled
    }

    const newParams = input.trim();

    await config.update('consoleParams', newParams, false);

    const message = newParams
      ? `Current console parameter(s): ${newParams}`
      : 'Console parameter(s) have been cleared.';

    window.showInformationMessage(message);
  } catch (error) {
    console.error('Error changing console params:', error);
    showErrorMessage('Failed to update console parameters.');
  }
};

/**
 * Opens the include file specified in the current line's #include directive.
 * @returns {void}
 */
const openInclude = () => {
  try {
    const editor = window.activeTextEditor;
    if (!editor) {
      showErrorMessage('No active editor.');
      return;
    }

    const doc = editor.document;
    const currentLine = doc.lineAt(editor.selection.active.line).text;
    const findInclude = /^(?:\s*)#include.+["'<](.*\.au3)["'>]/i;
    const found = findInclude.exec(currentLine);

    if (found === null) {
      window.showErrorMessage('Not on #include line.');
      return;
    }

    let includeFile = found[1];

    if (!fs.existsSync(includeFile)) {
      // check based on current document directory
      const docPath = path.dirname(doc.fileName);
      const currFile = path.normalize(`${docPath}\\${includeFile}`);

      if (fs.existsSync(currFile)) {
        includeFile = currFile;
      } else {
        const library = found[0].includes('<');
        const foundPath = findFilepath(includeFile, library);
        if (foundPath && typeof foundPath === 'string') {
          includeFile = foundPath;
        }
      }
    }

    if (!includeFile) {
      window.showErrorMessage('Unable to locate #include file.');
      return;
    }

    const url = Uri.file(includeFile);
    window.showTextDocument(url);
  } catch (error) {
    console.error('Error opening include file:', error);
    showErrorMessage('Failed to open include file.');
  }
};

/**
 * Inserts a header comment above the current function definition.
 * @returns {void}
 */
const insertHeader = () => {
  try {
    const editor = window.activeTextEditor;
    if (!editor) {
      showErrorMessage('No active editor.');
      return;
    }

    const doc = editor.document;
    const currentLine = editor.selection.active.line;
    const lineText = doc.lineAt(currentLine).text;
    const { UDFCreator } = config;

    const findFunc = setRegExpFlags(functionDefinitionRegex, 'i');
    const found = findFunc.exec(lineText);

    if (found === null) {
      window.showErrorMessage('Not on function definition.');
      return;
    }

    const hdrType =
      found[2].substring(0, SUBSTRING_DOUBLE_UNDERSCORE_LENGTH) === '__'
        ? '#INTERNAL_USE_ONLY# '
        : '#FUNCTION# =========';
    let syntaxBegin = `${found[2]}(`;
    let syntaxEnd = ')';
    let paramsOut = 'None';
    if (found[3]) {
      const params = found[3].split(',').map((parameter, index) => {
        parameter = parameter.trim();
        let tag = '- ';
        const paramIndex = parameter.search('=');
        if (paramIndex !== -1) {
          tag += '[optional] Default is ' + parameter.substring(paramIndex + 1).trim() + '.';
          syntaxBegin += '[';
          syntaxEnd = `]${syntaxEnd}`;
        }
        let byref = '';
        if (parameter.substring(0, SUBSTRING_BYREF_LENGTH).toLowerCase() === 'byref') {
          byref = 'ByRef ';
          parameter = parameter.substring(BYREF_PREFIX_LENGTH).trim(); // strip off byref keyword
          tag += '[in/out] ';
        }
        syntaxBegin += (index ? ', ' : '') + byref + parameter;
        return parameter.split(' ')[0].padEnd(PARAMETER_PAD_LENGTH).concat(tag);
      });
      const paramPrefix = '\n;                  ';
      paramsOut = params.join(paramPrefix);
    }
    const syntaxOut = `${syntaxBegin}${syntaxEnd}`;
    const header = `; ${hdrType}===========================================================================================================
; Name ..........: ${found[2]}
; Description ...:
; Syntax ........: ${syntaxOut}
; Parameters ....: ${paramsOut}
; Return values .: None
; Author ........: ${UDFCreator}
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......: No
; ===============================================================================================================================
`;

    const newPosition = new Position(currentLine, 0);
    editor.edit(edit => {
      edit.insert(newPosition, header);
    });
  } catch (error) {
    console.error('Error inserting header:', error);
    showErrorMessage('Failed to insert header.');
  }
};

export {
  getActiveDocumentFileName,
  getTime,
  trimOutputLines,
  changeConsoleParams as changeParams,
  openInclude,
  insertHeader,
};
