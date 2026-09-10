import { window } from 'vscode';
import searchAndReplace from './editorActions';

const functionTracePattern = /\s+?(;~?\s+)?ConsoleWrite\([^\r\n]+\)[ \t]*;### Trace[^\r\n]+/g;

async function traceRemove() {
  const traceRemovalResult = await searchAndReplace(functionTracePattern, '');

  if (traceRemovalResult) {
    window.showInformationMessage(`${traceRemovalResult} trace line(s) removed.`);
  } else {
    window.showInformationMessage('No trace lines found.');
  }
}

export { traceRemove as default };
