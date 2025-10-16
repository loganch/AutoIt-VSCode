const { window, Position } = require('vscode');

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
        const match = line.text.match(/^[\s]*/);
        indent = match ? match[0] : '';
        break;
      }
    }
    return indent;
  }

  const lineText = activeLine.text;
  const indentMatch = lineText.match(/^[\s]*/);
  return indentMatch ? indentMatch[0] : '';
}

/**
 * Inserts a MsgBox debug statement for the selected variable or macro.
 * Includes proper indentation and error handling.
 * @throws {Error} If no valid variable/macro is selected or no active editor
 */
function debugMsgBox() {
  try {
    const editor = window.activeTextEditor;
    if (!editor) {
      throw new Error('No active text editor found');
    }

    const debugText = getDebugText();
    if (!debugText || !('text' in debugText) || !('position' in debugText)) {
      return; // Error already thrown in getDebugText
    }

    const indent = getIndent();
    const debugCode = `\n${indent}${DEBUG_TEMPLATES.MSGBOX.PREFIX}\n${indent}${DEBUG_TEMPLATES.MSGBOX.CODE.replace(/{VAR}/g, debugText.text)}`;

    // Insert the debug code into the script
    editor.edit(edit => {
      edit.insert(debugText.position, debugCode);
    });
  } catch (error) {
    window.showErrorMessage(`Debug MsgBox Error: ${error.message}`);
  }
}

/**
 * Inserts a ConsoleWrite debug statement for the selected variable or macro.
 * Includes proper indentation and error handling.
 * @throws {Error} If no valid variable/macro is selected or no active editor
 */
function debugConsole() {
  try {
    const editor = window.activeTextEditor;
    if (!editor) {
      throw new Error('No active text editor found');
    }

    const debugText = getDebugText();
    if (!debugText || !('text' in debugText) || !('position' in debugText)) {
      return; // Error already thrown in getDebugText
    }

    const indent = getIndent();
    const debugCode = `\n${indent}${DEBUG_TEMPLATES.CONSOLE.PREFIX}\n${indent}${DEBUG_TEMPLATES.CONSOLE.CODE.replace(/{VAR}/g, debugText.text)}`;

    // Insert the debug code into the script
    editor.edit(edit => {
      edit.insert(debugText.position, debugCode);
    });
  } catch (error) {
    window.showErrorMessage(`Debug Console Error: ${error.message}`);
  }
}

export { getDebugText, getIndent, debugMsgBox, debugConsole };
