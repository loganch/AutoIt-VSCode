// src/services/symbolIndex.js
import { Location, SymbolInformation, SymbolKind, Uri, window, workspace } from 'vscode';
import { getIncludePath } from '../util';
import { provideDocumentSymbols } from '../ai_symbols';

// uriString -> SymbolInformation[]
const symbolsCache = new Map();

// uriString -> string[] of resolved include-target uriStrings
const includeEdges = new Map();

const VARIABLE_KINDS = new Set([SymbolKind.Variable, SymbolKind.Constant, SymbolKind.Enum]);

const DEFAULT_MAX_WORKSPACE_SYMBOL_FILES = 500;
const DEFAULT_WORKSPACE_SYMBOL_BATCH_SIZE = 10;

const RELATIVE_INCLUDE = /^\s*#include\s+"([^"]+)"/gm;
const LIBRARY_INCLUDE = /^\s*#include\s+<([^>]+)>/gm;

/**
 * Find definition matches for a symbol name in the warm index.
 * @param {string} name - Symbol name (e.g. "MyFunc" or "$Global").
 * @param {boolean} isVariable - True when the token starts with "$".
 * @returns {Array<import('vscode').SymbolInformation>} Matching indexed symbol entries (each has a `.location`).
 */
function lookupDefinition(name, isVariable) {
  if (!name) return [];
  const target = name.toLowerCase();
  const matches = [];
  for (const symbols of symbolsCache.values()) {
    for (const sym of symbols) {
      if (!sym || sym.name.toLowerCase() !== target) continue;
      const kindOk = isVariable ? VARIABLE_KINDS.has(sym.kind) : sym.kind === SymbolKind.Function;
      if (kindOk && sym.location) matches.push(sym);
    }
  }
  return matches;
}

/**
 * Compute the set of files reachable from a document via #include (transitive),
 * including the document itself. Pure in-memory traversal — no disk I/O.
 * @param {string} documentUriString - Starting document URI string.
 * @param {string[]} [liveEdges] - When provided, the active document's freshly
 *   parsed include targets, used instead of its cached edges (handles unsaved edits).
 * @returns {Set<string>} Reachable URI strings.
 */
function getIncludeSet(documentUriString, liveEdges) {
  const visited = new Set();
  const stack = [documentUriString];
  let isRoot = true;
  while (stack.length) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    const edges = isRoot && liveEdges ? liveEdges : includeEdges.get(current) || [];
    isRoot = false;
    for (const next of edges) {
      if (!visited.has(next)) stack.push(next);
    }
  }
  return visited;
}

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

const CASE_INSENSITIVE_FS = process.platform === 'win32' || process.platform === 'darwin';

/**
 * Canonical URI key for the index. On case-insensitive filesystems the path is
 * lowercased so that include-edge keys (derived from the user's #include
 * spelling) and symbol-cache keys (derived from on-disk paths) compare equal.
 * On case-sensitive filesystems (Linux) the path is left untouched, since
 * `Helper.au3` and `helper.au3` can legitimately be distinct files there.
 * @param {string} fsPath
 * @returns {string}
 */
function toUriString(fsPath) {
  const normalized = CASE_INSENSITIVE_FS ? fsPath.toLowerCase() : fsPath;
  return Uri.file(normalized).toString();
}

/**
 * Parse #include directives from text, resolve each to a URI string, and store
 * the edges for documentUriString.
 * @param {string} documentUriString
 * @param {string} text - Document text to scan.
 * @param {{uri:{fsPath:string}}} docLike - Minimal doc for path resolution.
 * @param {(raw:string, doc:object)=>string} [resolveInclude] - Path resolver (injectable for tests).
 * @returns {string[]} Resolved edge URI strings.
 */
function extractIncludeEdges(documentUriString, text, docLike, resolveInclude = getIncludePath) {
  const edges = [];
  const collect = (regex, wrap) => {
    regex.lastIndex = 0;
    for (const m of text.matchAll(regex)) {
      const resolved = resolveInclude(wrap(m[1]), docLike);
      if (resolved) edges.push(toUriString(resolved));
    }
  };
  collect(RELATIVE_INCLUDE, raw => `"${raw}"`);
  collect(LIBRARY_INCLUDE, raw => `<${raw}>`);
  includeEdges.set(documentUriString, edges);
  return edges;
}

/**
 * Index a single document: store its symbols and include edges.
 * @param {import('vscode').TextDocument} document
 * @returns {Promise<void>}
 */
async function indexDocument(document) {
  if (!document || !document.uri) return;
  // Canonical index key (case-normalized on case-insensitive FS). The stored
  // symbol Location keeps the REAL document.uri so navigation is unaffected.
  const uriString = toUriString(document.uri.fsPath);
  try {
    const symbols = await provideDocumentSymbols(document);
    symbolsCache.set(uriString, flattenSymbols(symbols, document.uri));
    extractIncludeEdges(uriString, document.getText(), document);
  } catch {
    symbolsCache.delete(uriString);
    includeEdges.delete(uriString);
  }
}

/** Index a just-opened document ahead of (or alongside) the full workspace pass. */
async function warmDocument(document) {
  if (!document || !document.uri) return;
  const fsPath = document.uri.fsPath || '';
  // Align with the watcher glob `{au3,a3x}`.
  if (!/\.(au3|a3x)$/i.test(fsPath)) return;
  await indexDocument(document);
}

/**
 * Opportunistically index a file the fallback scan already read, so repeated
 * navigation self-heals and library files get indexed on first use.
 *
 * provideDocumentSymbols consumes a rich TextDocument API (getText, lineCount,
 * lineAt, offsetAt, positionAt), so a hand-built {uri, getText} stub is not
 * sufficient. We obtain a real TextDocument via workspace.openTextDocument
 * (VS Code caches opened documents) and index that. The already-read `content`
 * only gates the call (skip empties) — VS Code re-uses its own cached buffer.
 *
 * Fire-and-forget; never throws to the caller.
 * @param {string} fsPath - Absolute path of the file.
 * @param {string} content - File text already loaded by the caller.
 */
function noteFileContent(fsPath, content) {
  if (!fsPath || !content) return;
  const uriString = toUriString(fsPath);
  // Note: the cache write lands after an await in indexDocument, so two
  // overlapping notes for the same file may both index it (benign: identical
  // last-writer-wins entry). The window is intentionally left untreated.
  if (symbolsCache.has(uriString)) return;
  Promise.resolve()
    .then(() => workspace.openTextDocument(Uri.file(fsPath)))
    .then(doc => indexDocument(doc))
    .catch(() => {
      // Fire-and-forget: swallow errors so the hot-ish scan loop is unaffected.
    });
}

/**
 * Remove a document's symbols and include edges from the index.
 * @param {string} uriString
 */
function removeDocument(uriString) {
  symbolsCache.delete(uriString);
  includeEdges.delete(uriString);
}

/**
 * Build (or rebuild) the workspace symbol index: find all AutoIt scripts and
 * index them in batches, yielding between batches so the UI stays responsive.
 * Populates the shared symbolsCache / includeEdges directly.
 * @param {import('vscode').CancellationToken} [token] - Cancellation token to abort processing.
 * @returns {Promise<void>}
 */
async function buildWorkspaceIndex(token) {
  const config = workspace.getConfiguration('autoit');
  const maxFiles = config.get('workspaceSymbolMaxFiles', DEFAULT_MAX_WORKSPACE_SYMBOL_FILES);
  const batchSize = config.get('workspaceSymbolBatchSize', DEFAULT_WORKSPACE_SYMBOL_BATCH_SIZE);

  const workspaceScripts = await workspace.findFiles('**/*.{au3,a3x}');

  // Limit number of files to process
  const files = workspaceScripts.slice(0, maxFiles);

  if (workspaceScripts.length > maxFiles) {
    window.showWarningMessage(
      `AutoIt: Processing ${maxFiles} of ${workspaceScripts.length} files. Increase 'autoit.workspaceSymbolMaxFiles' to index more files.`,
    );
  }

  for (let i = 0; i < files.length; i += batchSize) {
    // On cancellation the partially-built cache is intentionally kept: the index is
    // incrementally maintained (the file watcher refreshes it), so partial data is useful.
    if (token?.isCancellationRequested) break;

    const batch = files.slice(i, i + batchSize);

    // Index batch in parallel. indexDocument writes symbols + include edges
    // directly into the shared cache and is internally resilient; guard only
    // the document open so a file that vanished after findFiles is skipped.
    await Promise.all(
      batch.map(async file => {
        try {
          const doc = await workspace.openTextDocument(file);
          await indexDocument(doc);
        } catch {
          // Skip files that can't be opened
        }
      }),
    );

    // Yield control to prevent UI freezing
    await new Promise(resolve => setImmediate(resolve));
  }
}

// --- background warm-up ---
let warmState = 'cold'; // 'cold' | 'warming' | 'warm'
let warmPromise = null;
let builder = buildWorkspaceIndex; // injectable for tests

/**
 * Idempotently warm the index in the background. Safe to call repeatedly.
 *
 * The build is run as a single shared, non-cancellable background warm-up:
 * concurrent callers coalesce onto the one in-flight build rather than each
 * starting their own, so we deliberately do not thread a per-request
 * cancellation token into it.
 *
 * @returns {Promise<void>} Resolves when the warm-up settles. This promise
 *   NEVER rejects — build failures are swallowed (state is reset to 'cold' so
 *   the next call retries). Callers must re-check `isWarm()`/cache state rather
 *   than relying on rejection to detect failure.
 */
function ensureWarm() {
  if (warmState !== 'cold') return warmPromise;
  warmState = 'warming';
  warmPromise = Promise.resolve()
    .then(() => builder())
    .then(() => {
      warmState = 'warm';
    })
    .catch(err => {
      warmState = 'cold';
      warmPromise = null;
      console.error('AutoIt: symbol index warm-up failed', err);
    });
  return warmPromise;
}

/** @returns {boolean} True once the background warm-up has completed. */
function isWarm() {
  return warmState === 'warm';
}

// --- test seams ---
function __resetForTests() {
  symbolsCache.clear();
  includeEdges.clear();
  warmState = 'cold';
  warmPromise = null;
  builder = buildWorkspaceIndex;
}
function __setBuilderForTests(fn) {
  builder = fn;
}
function __setSymbolsForTests(uriString, symbols) {
  symbolsCache.set(uriString, symbols);
}
function __setEdgesForTests(uriString, edges) {
  includeEdges.set(uriString, edges);
}

export {
  symbolsCache,
  includeEdges,
  lookupDefinition,
  getIncludeSet,
  flattenSymbols,
  toUriString,
  extractIncludeEdges,
  indexDocument,
  warmDocument,
  noteFileContent,
  removeDocument,
  buildWorkspaceIndex,
  ensureWarm,
  isWarm,
  __resetForTests,
  __setSymbolsForTests,
  __setEdgesForTests,
  __setBuilderForTests,
};
