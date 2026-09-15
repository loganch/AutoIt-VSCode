import { window, Range } from 'vscode';

/**
 * Message shown when a wrapper command needs a saved (non-untitled) file.
 * Shared by scriptCommands.js's runScript and toolCommands.js's
 * runWrapperCommand, which previously duplicated this exact string.
 * @param {string} thisFile - The file name to include in the message
 * @returns {string} The formatted error message
 */
export function untitledFileErrorMessage(thisFile) {
  return `"${thisFile}" file must be saved first!`;
}

/**
 * Message shown when a save didn't take effect but the command proceeds
 * against the last-saved file anyway. Shared by scriptCommands.js's
 * runScript and toolCommands.js's runWrapperCommand, which previously
 * duplicated this exact string shape (only the verb differed).
 * @param {string} thisFile - The file name to include in the message
 * @param {string} progressVerb - Verb describing what proceeds anyway (e.g. "running", "compiling")
 * @returns {string} The formatted warning message
 */
export function saveFailureWarningMessage(thisFile, progressVerb) {
  return `File failed to save, ${progressVerb} saved file instead ("${thisFile}")`;
}

/**
 * Get the file name of the active document in the editor.
 *
 * Note that `window.activeTextEditor.document.fileName` is not available in some situations.
 *
 * @returns {string} The file name of the active document, or an empty string if unavailable.
 */
export function getActiveDocumentFileName() {
  if (!window.activeTextEditor) {
    return '';
  }
  const { document } = window.activeTextEditor;
  if (!document.fileName) {
    return '';
  }
  return document.fileName;
}

/**
 * Searches for matches of a regular expression pattern in the active text editor's document
 * and replaces them with a replacement string.
 * @param {RegExp} regex - The regular expression pattern to search for.
 * @param {string} [replacement='\r\n'] - The string to replace the matched patterns with.
 * @returns {Promise<number>} A promise that resolves to the number of replacements made.
 */
async function searchAndReplace(regex, replacement = '\r\n') {
  const editor = window.activeTextEditor;

  if (!editor) {
    window.showErrorMessage('No active editor');
    return 0;
  }

  const { document } = editor;
  const text = document.getText();

  const updatedText = text.replace(regex, replacement);

  if (updatedText === text) {
    return 0;
  }

  await editor.edit(editBuilder => {
    const fullRange = new Range(document.positionAt(0), document.positionAt(text.length));
    editBuilder.replace(fullRange, updatedText);
  });

  return (text.match(regex) || []).length;
}

export default searchAndReplace;
