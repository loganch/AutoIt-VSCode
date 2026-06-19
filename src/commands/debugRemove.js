import * as vscode from 'vscode';
import searchAndReplace from './editorActions';

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
    vscode.window.showInformationMessage(
      `${consoleWriteReplacementsMade + msgBoxReplacementsMade} Debug line(s) removed successfully`,
    );
  } else {
    vscode.window.showInformationMessage('No debug lines found');
  }
}

export { debugRemove as default };
