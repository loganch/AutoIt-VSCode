import { window, Position, Uri } from 'vscode';
import path from 'path';
import fs from 'fs';
import aiConfig from '../config/ai_config';
import { showErrorMessage } from '../utils/ai_showMessage';
import { handleError } from '../errorUtils';
import { REGEX_PATTERNS, setRegExpFlags } from '../utils/regexPatterns';
import OutputChannelManager from '../services/OutputChannelManager';
import { getServiceStack } from '../services/process/commandServiceStack';
import { getActiveDocumentFileName } from './editorActions';

const { functionDefinitionRegex } = REGEX_PATTERNS;
const { config, findFilePath } = aiConfig;

/** @type {number} Length of double underscore prefix for internal functions. */
const DOUBLE_UNDERSCORE_LENGTH = 2;

/** @type {number} Length of the 'byref' keyword. */
const BYREF_KEYWORD_LENGTH = 5;

/** @type {number} Length of the byref prefix including keyword and spacing. */
const BYREF_PREFIX_LENGTH = 6;

/** @type {number} Padding length for parameter names in documentation. */
const PARAMETER_PAD_LENGTH = 21;

/**
 * Trims the output text in the visible AutoIt output to the max number of lines
 * set in the configuration. Delegates to the shared ProcessManager's
 * isAiOutVisible() and OutputChannelManager.trimOutputLines() so this stays
 * the single implementation of that logic.
 * @returns {void}
 */
const trimOutputLines = () => {
  try {
    const { processManager, globalOutputChannel } = getServiceStack();
    OutputChannelManager.trimOutputLines(processManager, globalOutputChannel);
  } catch (error) {
    handleError('trimOutputLines', error);
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
    handleError('changeConsoleParams', error);
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
        const foundPath = findFilePath(includeFile, library);
        if (foundPath) {
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
    handleError('openInclude', error);
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
      found[2].substring(0, DOUBLE_UNDERSCORE_LENGTH) === '__'
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
        if (parameter.substring(0, BYREF_KEYWORD_LENGTH).toLowerCase() === 'byref') {
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
    handleError('insertHeader', error);
    showErrorMessage('Failed to insert header.');
  }
};

export {
  getActiveDocumentFileName,
  trimOutputLines,
  changeConsoleParams as changeParams,
  openInclude,
  insertHeader,
};

export const { getTime } = OutputChannelManager;
