import { languages, window, workspace } from 'vscode';
import { provideDocumentSymbols } from './ai_symbols';

// Map of file URI to symbols for incremental updates
const symbolsCache = new Map();

/**
 * Process files in batches to prevent UI freezing on large workspaces.
 * @param {Array} files - Array of file URIs to process
 * @param {number} batchSize - Number of files to process per batch
 * @param {CancellationToken} token - Cancellation token to abort processing
 * @returns {Promise<Map>} Map of file URI to symbols
 */
async function processBatch(files, batchSize, token) {
  const results = new Map();

  for (let i = 0; i < files.length; i += batchSize) {
    // Check for cancellation
    if (token?.isCancellationRequested) {
      break;
    }

    const batch = files.slice(i, i + batchSize);

    // Process batch in parallel
    const batchResults = await Promise.all(
      batch.map(async file => {
        try {
          const document = await workspace.openTextDocument(file);
          const symbols = provideDocumentSymbols(document);
          return { uri: file.toString(), symbols };
        } catch {
          // Skip files that can't be opened
          return null;
        }
      }),
    );

    // Add batch results to map
    batchResults.forEach(result => {
      if (result && result.symbols) {
        results.set(result.uri, result.symbols);
      }
    });

    // Yield control to prevent UI freezing
    await new Promise(resolve => setImmediate(resolve));
  }

  return results;
}

/**
 * Fetches symbols for all AutoIt scripts in the workspace.
 * Uses batch processing to prevent UI freezing on large projects.
 *
 * @param {CancellationToken} token - Cancellation token
 * @returns {Promise<Map>} A promise that resolves to a map of file URI to symbols.
 */
async function getWorkspaceSymbols(token) {
  try {
    const config = workspace.getConfiguration('autoit');
    const maxFiles = config.get('workspaceSymbolMaxFiles', 500);
    const batchSize = config.get('workspaceSymbolBatchSize', 10);

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
 * Provides symbols for the entire workspace, using a cached version if available.
 * Supports cancellation and query-based filtering.
 *
 * @param {string} query - The search query (optional)
 * @param {CancellationToken} token - Cancellation token
 * @returns {Promise<Array>} A promise that resolves to an array of workspace symbols.
 */
async function provideWorkspaceSymbols(query, token) {
  // Build cache if empty
  if (symbolsCache.size === 0) {
    const symbols = await getWorkspaceSymbols(token);

    // Only update cache if not cancelled
    if (!token?.isCancellationRequested) {
      symbols.forEach((value, key) => {
        symbolsCache.set(key, value);
      });
    }
  }

  // Return early if cancelled
  if (token?.isCancellationRequested) {
    return [];
  }

  // Flatten cache into array
  const allSymbols = Array.from(symbolsCache.values()).flat();

  // Filter by query if provided
  if (query && query.length > 0) {
    const lowerQuery = query.toLowerCase();
    return allSymbols.filter(symbol => symbol.name.toLowerCase().includes(lowerQuery));
  }

  return allSymbols;
}

const watcher = workspace.createFileSystemWatcher('**/*.{au3,a3x}');

/**
 * Update symbols for a specific file instead of clearing entire cache.
 * @param {Uri} uri - The file URI that changed
 */
async function updateFileSymbols(uri) {
  try {
    const document = await workspace.openTextDocument(uri);
    const symbols = provideDocumentSymbols(document);
    symbolsCache.set(uri.toString(), symbols);
  } catch {
    // If file can't be opened, remove from cache
    symbolsCache.delete(uri.toString());
  }
}

/**
 * Remove a file from the cache when deleted.
 * @param {Uri} uri - The file URI that was deleted
 */
function removeFileSymbols(uri) {
  symbolsCache.delete(uri.toString());
}

// Incremental cache updates instead of full invalidation
watcher.onDidChange(updateFileSymbols);
watcher.onDidCreate(updateFileSymbols);
watcher.onDidDelete(removeFileSymbols);

const workspaceSymbolProvider = languages.registerWorkspaceSymbolProvider({
  provideWorkspaceSymbols,
});

export default workspaceSymbolProvider;
