import { languages, window, workspace, SymbolInformation, Location, SymbolKind } from 'vscode';
import { provideDocumentSymbols } from './ai_symbols';

// Map of file URI to symbols for incremental updates
const symbolsCache = new Map();

// Debouncing state for search requests
let searchDebounceTimer = null;
const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_MAX_WORKSPACE_SYMBOL_FILES = 500;
const DEFAULT_WORKSPACE_SYMBOL_BATCH_SIZE = 10;

/**
 * Recursively extract key symbols from nested structure
 * @param {Array<import('vscode').DocumentSymbol>} keySymbols - Key DocumentSymbols
 * @param {import('vscode').Uri} uri - File URI
 * @param {string} containerName - Parent Map name
 * @param {Array<import('vscode').SymbolInformation>} results - Array to append to
 */
function extractKeyChildren(keySymbols, uri, containerName, results) {
  keySymbols.forEach(keySymbol => {
    // Add key SymbolInformation
    results.push(
      new SymbolInformation(
        keySymbol.name,
        SymbolKind.Key,
        containerName,
        new Location(uri, keySymbol.range),
      ),
    );

    // Recursively process nested keys
    if (keySymbol.children && keySymbol.children.length > 0) {
      extractKeyChildren(keySymbol.children, uri, containerName, results);
    }
  });
}

/**
 * Extract Map key SymbolInformation from DocumentSymbol tree
 * @param {import('vscode').DocumentSymbol} symbol - Document symbol
 * @param {import('vscode').Uri} uri - File URI
 * @param {Array<import('vscode').SymbolInformation>} results - Array to append to
 */
function extractMapKeySymbols(symbol, uri, results) {
  // If this is a Map variable, process its key children
  if (symbol.kind === SymbolKind.Variable && symbol.detail === 'Map') {
    // Add the Map variable itself
    results.push(
      new SymbolInformation(symbol.name, SymbolKind.Variable, '', new Location(uri, symbol.range)),
    );

    // Recursively extract key symbols
    if (symbol.children && symbol.children.length > 0) {
      extractKeyChildren(symbol.children, uri, symbol.name, results);
    }
  }
}

/**
 * Normalize a mixed array of DocumentSymbols/SymbolInformation into SymbolInformation.
 * @param {Array<import('vscode').DocumentSymbol|import('vscode').SymbolInformation>|any} symbols
 * @param {import('vscode').Uri} uri
 * @returns {Array<import('vscode').SymbolInformation>}
 */
function flattenSymbols(symbols, uri) {
  const flatSymbols = [];

  if (!Array.isArray(symbols)) {
    return flatSymbols;
  }

  symbols.forEach(symbol => {
    if (symbol && symbol.children !== undefined) {
      if (symbol.kind === SymbolKind.Variable && symbol.detail === 'Map') {
        extractMapKeySymbols(symbol, uri, flatSymbols);
      } else {
        flatSymbols.push(
          new SymbolInformation(
            symbol.name,
            symbol.kind,
            symbol.detail || '',
            new Location(uri, symbol.range),
          ),
        );

        if (symbol.children && symbol.children.length > 0) {
          symbol.children.forEach(child => {
            flatSymbols.push(
              new SymbolInformation(
                child.name,
                child.kind,
                symbol.name,
                new Location(uri, child.range),
              ),
            );
          });
        }
      }
    } else if (symbol) {
      flatSymbols.push(symbol);
    }
  });

  return flatSymbols;
}

/**
 * Process files in batches to prevent UI freezing on large workspaces.
 * @param {Array} files - Array of file URIs to process
 * @param {number} batchSize - Number of files to process per batch
 * @param {import('vscode').CancellationToken} token - Cancellation token to abort processing
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
          const symbols = await provideDocumentSymbols(document);

          // Flatten DocumentSymbol to SymbolInformation
          const flatSymbols = flattenSymbols(symbols, file);

          return { uri: file.toString(), symbols: flatSymbols };
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
 * Provides symbols for the entire workspace, using a cached version if available.
 * Supports cancellation and query-based filtering.
 *
 * @param {string} query - The search query (optional)
 * @param {import('vscode').CancellationToken} token - Cancellation token
 * @returns {Promise<Array>} A promise that resolves to an array of workspace symbols.
 */
function provideWorkspaceSymbols(query, token) {
  // Debounce search requests
  return new Promise(resolve => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(async () => {
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
        resolve([]);
        return;
      }

      // Flatten cache into array
      const allSymbols = Array.from(symbolsCache.values()).flat();

      // Filter by query if provided
      if (query && query.length > 0) {
        const lowerQuery = query.toLowerCase();
        const filtered = allSymbols.filter(symbol =>
          symbol.name.toLowerCase().includes(lowerQuery),
        );
        resolve(filtered);
      } else {
        resolve(allSymbols);
      }
    }, SEARCH_DEBOUNCE_MS);
  });
}

const watcher = workspace.createFileSystemWatcher('**/*.{au3,a3x}');

/**
 * Update symbols for a specific file instead of clearing entire cache.
 * @param {import('vscode').Uri} uri - The file URI that changed
 */
async function updateFileSymbols(uri) {
  try {
    const document = await workspace.openTextDocument(uri);
    const symbols = await provideDocumentSymbols(document);

    // Flatten DocumentSymbol to SymbolInformation
    const flatSymbols = flattenSymbols(symbols, uri);

    symbolsCache.set(uri.toString(), flatSymbols);
  } catch {
    // If file can't be opened, remove from cache
    symbolsCache.delete(uri.toString());
  }
}

/**
 * Remove a file from the cache when deleted.
 * @param {import('vscode').Uri} uri - The file URI that was deleted
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
