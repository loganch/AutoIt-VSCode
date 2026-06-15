import { languages, workspace } from 'vscode';
import { symbolsCache, indexDocument, removeDocument, ensureWarm } from './services/symbolIndex';

// Debouncing state for search requests
let searchDebounceTimer = null;
// Resolver of the most recent pending (debounced) search, so a superseding
// search can settle it instead of leaving VS Code awaiting forever.
let pendingSearchResolve = null;
const SEARCH_DEBOUNCE_MS = 300;

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

      // Build cache if empty. ensureWarm runs the single shared workspace-build
      // implementation (populating symbolsCache directly via indexDocument) and is
      // idempotent, so it coalesces with any activation-time warm-up — no double build.
      if (symbolsCache.size === 0) {
        await ensureWarm();
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
