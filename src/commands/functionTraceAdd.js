import * as vscode from 'vscode';
import searchAndReplace from './editorActions';

/**
 * Adds a trace statement to a given match in a text.
 * If the match already contains a trace statement or includes the comment '; FunctionTraceSkip',
 * the match is returned as is.
 * Otherwise, a new trace statement is constructed based on the match and appended to it.
 * @param {string} match - The matched string from the regular expression.
 * @param {string} p1 - The first capturing group from the regular expression.
 * @param {string} p2 - The second capturing group from the regular expression.
 * @param {string} functionName - The third capturing group from the regular expression.
 * @returns {string} - The modified match with the added trace statement.
 */
function appendTrace(match, p1, p2, functionName) {
  // Check for skipping comments
  if (p1.includes('; FunctionTraceSkip')) {
    return match;
  }

  const traceStatement = `ConsoleWrite('@@ (' & (@ScriptLineNumber - 1) & ') :(' & @MIN & ':' & @SEC & ') ${functionName}()' & @CR) \t;### Trace Function'`;

  return `${match}\r\t${traceStatement}`;
}

async function functionTraceAdd() {
  const sPattern = /()(\bfunc\b\s+([^)\s]+)\(.*\))/gi;

  // Remove existing trace statements
  const traceStatementPattern = /\s*ConsoleWrite\('@@ \(.+;### Trace Function'/;
  await searchAndReplace(traceStatementPattern);

  // Perform replacement using regular expressions
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  const { document } = editor;
  const text = document.getText();

  const updatedText = text.replaceAll(sPattern, appendTrace);

  if (!updatedText) {
    return;
  }

  await editor.edit(editBuilder => {
    const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
    editBuilder.replace(fullRange, updatedText);
  });
}

export { functionTraceAdd as default };
