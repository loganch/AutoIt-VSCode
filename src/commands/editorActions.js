import * as vscode from 'vscode';

/**
 * Get the file name of the active document in the editor.
 *
 * Note that `window.activeTextEditor.document.fileName` is not available in some situations.
 *
 * @returns {string} The file name of the active document, or an empty string if unavailable.
 */
export function getActiveDocumentFileName() {
  if (!vscode.window.activeTextEditor) {
    return '';
  }
  const { document } = vscode.window.activeTextEditor;
  if (!document || !document.fileName) {
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
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return 0;
  }

  const { document } = editor;
  const text = document.getText();

  const updatedText = text.replace(regex, replacement);

  if (updatedText === text) {
    return 0;
  }

  await editor.edit(editBuilder => {
    const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
    editBuilder.replace(fullRange, updatedText);
  });

  return (text.match(regex) || []).length;
}

export default searchAndReplace;
