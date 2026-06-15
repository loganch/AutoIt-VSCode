// src/services/symbolIndex.js
import { Location, SymbolInformation, SymbolKind, Uri } from 'vscode';
import { getIncludePath } from '../util';
import { provideDocumentSymbols } from '../ai_symbols';

// uriString -> SymbolInformation[]
const symbolsCache = new Map();

// uriString -> string[] of resolved include-target uriStrings
const includeEdges = new Map();

const VARIABLE_KINDS = new Set([SymbolKind.Variable, SymbolKind.Constant, SymbolKind.Enum]);

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

/** Normalize an fs path to the canonical URI key used across the index. */
function toUriString(fsPath) {
  return Uri.file(fsPath).toString();
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
  const uriString = document.uri.toString();
  try {
    const symbols = await provideDocumentSymbols(document);
    symbolsCache.set(uriString, flattenSymbols(symbols, document.uri));
    extractIncludeEdges(uriString, document.getText(), document);
  } catch {
    symbolsCache.delete(uriString);
    includeEdges.delete(uriString);
  }
}

// --- test seams ---
function __resetForTests() {
  symbolsCache.clear();
  includeEdges.clear();
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
  __resetForTests,
  __setSymbolsForTests,
  __setEdgesForTests,
};
