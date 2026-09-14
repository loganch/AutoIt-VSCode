import { window, Position } from 'vscode';
import searchAndReplace from './editorActions';
import { handleError } from '../errorUtils';

/**
 * Configuration for debug code templates.
 * These can be customized as needed.
 */
const DEBUG_TEMPLATES = {
  MSGBOX: {
    PREFIX: ';### Debug MSGBOX ↓↓↓',
    CODE: "MsgBox(262144, 'Debug line ~' & @ScriptLineNumber, 'Selection:' & @CRLF & '{VAR}' & @CRLF & @CRLF & 'Return:' & @CRLF & {VAR})",
  },
  CONSOLE: {
    PREFIX: ';### Debug CONSOLE ↓↓↓',
    CODE: "ConsoleWrite('@@ Debug(' & @ScriptLineNumber & ') : {VAR} = ' & {VAR} & @CRLF & '>Error code: ' & @error & @CRLF)",
  },
};

/**
 * Gets debug information for the selected variable or macro
 * @returns {{text: string, position: Position}|{}} Debug info object or empty object
 */
function getDebugText() {
  const editor = window.activeTextEditor;
  if (!editor) {
    throw new Error('No active text editor found');
  }

  const thisDoc = editor.document;
  let lineNbr = editor.selection.active.line;
  let currentLine = thisDoc.lineAt(lineNbr);
  const wordRange = editor.document.getWordRangeAtPosition(editor.selection.start);
  const varToDebug = !wordRange
    ? ''
    : thisDoc.getText(thisDoc.getWordRangeAtPosition(editor.selection.active));

  // Validate that a variable or macro is selected
  if (!varToDebug || (varToDebug.charAt(0) !== '$' && varToDebug.charAt(0) !== '@')) {
    throw new Error(
      `"${varToDebug}" is not a valid variable or macro. Debug line cannot be generated.`,
    );
  }

  const LINE_COUNT_OFFSET = 2;
  const lineCount = thisDoc.lineCount - LINE_COUNT_OFFSET;
  const isContinue = /\s_\b\s*(;.*)?\s*/;

  // Check if not the last line
  if (lineNbr < thisDoc.lineCount - 1) {
    // Find first line without continuation character
    while (lineNbr <= lineCount) {
      const noContinue = isContinue.exec(currentLine.text) === null;
      if (noContinue) {
        break;
      }

      lineNbr += 1;
      currentLine = thisDoc.lineAt(lineNbr);
    }
  }

  const endPos = currentLine.range.end.character;
  const newPosition = new Position(lineNbr, endPos);

  return {
    text: varToDebug,
    position: newPosition,
  };
}

/**
 * Gets the indentation of the current line in a robust way.
 * Handles empty lines, whitespace-only lines, and mixed indentation.
 * @returns {string} The indentation string (spaces or tabs)
 */
function getIndent() {
  const editor = window.activeTextEditor;
  if (!editor) {
    return '';
  }

  const { document, selection } = editor;
  const activeLine = document.lineAt(selection.active.line);

  if (activeLine.isEmptyOrWhitespace) {
    // For empty/whitespace lines, try to detect indentation from surrounding lines
    let indent = '';
    // Check previous non-empty line
    for (let i = selection.active.line - 1; i >= 0; i--) {
      const line = document.lineAt(i);
      if (!line.isEmptyOrWhitespace) {
        indent = line.text.match(/^[\s]*/)[0];
        break;
      }
    }
    return indent;
  }

  const lineText = activeLine.text;
  return lineText.match(/^[\s]*/)[0];
}

/**
 * Inserts a debug statement (from DEBUG_TEMPLATES) for the selected variable
 * or macro at the appropriate insertion point, with proper indentation.
 * @param {keyof DEBUG_TEMPLATES} templateKey - Which template to insert.
 * @param {string} operationName - Name reported to handleError on failure.
 */
function insertDebugStatement(templateKey, operationName) {
  try {
    const editor = window.activeTextEditor;
    if (!editor) {
      throw new Error('No active text editor found');
    }

    const debugText = getDebugText();
    if (!debugText || !('text' in debugText) || !('position' in debugText)) {
      return; // Error already thrown in getDebugText
    }

    const template = DEBUG_TEMPLATES[templateKey];
    const indent = getIndent();
    const debugCode = `\n${indent}${template.PREFIX}\n${indent}${template.CODE.replace(/{VAR}/g, debugText.text)}`;

    // Insert the debug code into the script
    editor.edit(edit => {
      edit.insert(debugText.position, debugCode);
    });
  } catch (error) {
    handleError(operationName, error, true);
  }
}

/**
 * Inserts a MsgBox debug statement for the selected variable or macro.
 * Includes proper indentation and error handling.
 * @throws {Error} If no valid variable/macro is selected or no active editor
 */
function debugMsgBox() {
  insertDebugStatement('MSGBOX', 'debugMsgBox');
}

/**
 * Inserts a ConsoleWrite debug statement for the selected variable or macro.
 * Includes proper indentation and error handling.
 * @throws {Error} If no valid variable/macro is selected or no active editor
 */
function debugConsole() {
  insertDebugStatement('CONSOLE', 'debugConsole');
}

/**
 * Removes debug lines from an AutoIt Script.
 *
 * This function uses regular expressions to find and replace the debug lines in the active text editor.
 * If any replacements are made, it displays a success message.
 * Otherwise, it displays a message indicating that no debug lines were found.
 *
 * @returns {Promise<void>} A promise that resolves once the debug lines are removed.
 */
async function debugRemove() {
  const consoleWriteDebugPattern =
    /\s+?(;~?\s+)?;### Debug CONSOLE.*?\r\n\s?(;~?\s+)?ConsoleWrite\('@@ Debug\('.+\r\n/g;
  const msgBoxDebugPattern =
    /\s+?(;~?\s+)?;### Debug MSGBOX.*?\r\n\s?(;~?\s+)?MsgBox\(262144, 'Debug line ~'.+\r\n/g;

  const consoleWriteReplacementsMade = await searchAndReplace(consoleWriteDebugPattern);
  const msgBoxReplacementsMade = await searchAndReplace(msgBoxDebugPattern);

  if (consoleWriteReplacementsMade || msgBoxReplacementsMade) {
    window.showInformationMessage(
      `${consoleWriteReplacementsMade + msgBoxReplacementsMade} Debug line(s) removed successfully`,
    );
  } else {
    window.showInformationMessage('No debug lines found');
  }
}

const functionTracePattern = /\s+?(;~?\s+)?ConsoleWrite\([^\r\n]+\)[ \t]*;### Trace[^\r\n]+/g;

/**
 * Removes function trace lines added by functionTraceAdd.
 * @returns {Promise<void>} A promise that resolves once the trace lines are removed.
 */
async function traceRemove() {
  const traceRemovalResult = await searchAndReplace(functionTracePattern, '');

  if (traceRemovalResult) {
    window.showInformationMessage(`${traceRemovalResult} trace line(s) removed.`);
  } else {
    window.showInformationMessage('No trace lines found.');
  }
}

export { getDebugText, getIndent, debugMsgBox, debugConsole, debugRemove, traceRemove };
