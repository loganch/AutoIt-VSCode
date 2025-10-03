import { languages, window, workspace } from 'vscode';
import { provideDocumentSymbols } from './ai_symbols';

let symbolsCache = [];

/**
 * Fetches symbols for all AutoIt scripts in the workspace.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of document symbols.
 */
async function getWorkspaceSymbols() {
  try {
    const workspaceScripts = await workspace.findFiles('**/*.{au3,a3x}');

    const symbols = await Promise.all(
      workspaceScripts.map(async file => {
        const document = await workspace.openTextDocument(file);
        return provideDocumentSymbols(document);
      }),
    );

    return symbols.flat();
  } catch (error) {
    window.showErrorMessage(error.message || 'Error fetching workspace symbols');
    return null;
  }
}

/**
 * Provides symbols for the entire workspace, using a cached version if available.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of workspace symbols.
 */
async function provideWorkspaceSymbols() {
  if (symbolsCache.length === 0) {
    symbolsCache = await getWorkspaceSymbols();
  }
  return symbolsCache;
}

const watcher = workspace.createFileSystemWatcher('**/*.{au3,a3x}');

const resetCache = () => {
  symbolsCache = [];
};

watcher.onDidChange(resetCache);
watcher.onDidCreate(resetCache);
watcher.onDidDelete(resetCache);

const workspaceSymbolProvider = languages.registerWorkspaceSymbolProvider({
  provideWorkspaceSymbols,
});

export default workspaceSymbolProvider;
