import { languages, window, workspace } from 'vscode';
import { symbolsCache, indexDocument, removeDocument } from './services/symbolIndex';

// Debouncing state for search requests
let searchDebounceTimer = null;
// Resolver of the most recent pending (debounced) search, so a superseding
// search can settle it instead of leaving VS Code awaiting forever.
let pendingSearchResolve = null;
const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_MAX_WORKSPACE_SYMBOL_FILES = 500;
const DEFAULT_WORKSPACE_SYMBOL_BATCH_SIZE = 10;

/**
 * Process files in batches to prevent UI freezing on large workspaces.
 * @param {Array} files - Array of file URIs to process
 * @param {number} batchSize - Number of files to process per batch
 * @param {import('vscode').CancellationToken} token - Cancellation token to abort processing
 * @returns {Promise<Map>} The shared symbol cache (uri -> symbols).
 */
async function processBatch(files, batchSize, token) {
  for (let i = 0; i < files.length; i += batchSize) {
    // Check for cancellation
    if (token?.isCancellationRequested) {
      break;
    }

    const batch = files.slice(i, i + batchSize);

    // Index batch in parallel. indexDocument writes symbols + include edges
    // directly into the shared cache and is internally resilient; guard only
    // the document open so a file that vanished after findFiles is skipped.
    await Promise.all(
      batch.map(async file => {
        try {
          const document = await workspace.openTextDocument(file);
          await indexDocument(document);
        } catch {
          // Skip files that can't be opened
        }
      }),
    );

    // Yield control to prevent UI freezing
    await new Promise(resolve => setImmediate(resolve));
  }

  return symbolsCache;
}

/**
 * Fetches symbols for all AutoIt scripts in the workspace.
 * Uses batch processing to prevent UI freezing on large projects.
 *
 * @param {import('vscode').CancellationToken} token - Cancellation token
 * @returns {Promise<Map>} A promise that resolves to a map of file URI to symbols.
 */
async function getWorkspaceSymbols(token) {
  try {
    const config = workspace.getConfiguration('autoit');
    const maxFiles = config.get('workspaceSymbolMaxFiles', DEFAULT_MAX_WORKSPACE_SYMBOL_FILES);
    const batchSize = config.get('workspaceSymbolBatchSize', DEFAULT_WORKSPACE_SYMBOL_BATCH_SIZE);

    const workspaceScripts = await workspace.findFiles('**/*.{au3,a3x}');

    // Limit number of files to process
    const filesToProcess = workspaceScripts.slice(0, maxFiles);

    if (workspaceScripts.length > maxFiles) {
      window.showWarningMessage(
        `AutoIt: Processing ${maxFiles} of ${workspaceScripts.length} files. Increase 'autoit.workspaceSymbolMaxFiles' to index more files.`,
      );
    }

    return await processBatch(filesToProcess, batchSize, token);
  } catch (error) {
    window.showErrorMessage(error.message || 'Error fetching workspace symbols');
    return new Map();
  }
}

/**
 * Flatten the symbol cache into an array, optionally filtered by a query.
 * @param {string} query - The search query (optional)
 * @returns {Array} Matching workspace symbols.
 */
function filterCachedSymbols(query) {
  const allSymbols = Array.from(symbolsCache.values()).flat();

  if (query && query.length > 0) {
    const lowerQuery = query.toLowerCase();
    return allSymbols.filter(symbol => symbol.name.toLowerCase().includes(lowerQuery));
  }

  return allSymbols;
}

/**
 * Provides symbols for the entire workspace, using a cached version if available.
 * Supports cancellation and query-based filtering.
 *
 * @param {string} query - The search query (optional)
 * @param {import('vscode').CancellationToken} token - Cancellation token
 * @returns {Promise<Array>} A promise that resolves to an array of workspace symbols.
 */
function provideWorkspaceSymbols(query, token) {
  // Warm cache: answer immediately instead of paying the full debounce delay.
  if (symbolsCache.size > 0) {
    return Promise.resolve(token?.isCancellationRequested ? [] : filterCachedSymbols(query));
  }

  // Cold cache: debounce so a burst of keystrokes only triggers one indexing pass.
  return new Promise(resolve => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
      // The previous search is superseded by this one; settle it so VS Code
      // isn't left awaiting a promise that will never resolve.
      if (pendingSearchResolve) {
        pendingSearchResolve([]);
      }
    }
    pendingSearchResolve = resolve;

    searchDebounceTimer = setTimeout(async () => {
      searchDebounceTimer = null;
      pendingSearchResolve = null;

      // Build cache if empty. getWorkspaceSymbols populates the shared
      // symbolsCache directly (via indexDocument), so no copy step is needed.
      if (symbolsCache.size === 0) {
        await getWorkspaceSymbols(token);
      }

      // Return early if cancelled
      if (token?.isCancellationRequested) {
        resolve([]);
        return;
      }

      resolve(filterCachedSymbols(query));
    }, SEARCH_DEBOUNCE_MS);
  });
}

const watcher = workspace.createFileSystemWatcher('**/*.{au3,a3x}');

/**
 * Update symbols for a specific file instead of clearing entire cache.
 * @param {import('vscode').Uri} uri - The file URI that changed
 */
async function updateFileSymbols(uri) {
  const document = await workspace.openTextDocument(uri);
  await indexDocument(document);
}

/**
 * Remove a file from the cache when deleted.
 * @param {import('vscode').Uri} uri - The file URI that was deleted
 */
function removeFileSymbols(uri) {
  removeDocument(uri.toString());
}

// Incremental cache updates instead of full invalidation
watcher.onDidChange(updateFileSymbols);
watcher.onDidCreate(updateFileSymbols);
watcher.onDidDelete(removeFileSymbols);

const workspaceSymbolProvider = languages.registerWorkspaceSymbolProvider({
  provideWorkspaceSymbols,
});

export default workspaceSymbolProvider;
