// src/services/symbolIndex.js
import { SymbolKind } from 'vscode';

// uriString -> SymbolInformation[]
const symbolsCache = new Map();

// uriString -> string[] of resolved include-target uriStrings
const includeEdges = new Map();

const VARIABLE_KINDS = new Set([SymbolKind.Variable, SymbolKind.Constant, SymbolKind.Enum]);

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
      const kindOk = isVariable
        ? VARIABLE_KINDS.has(sym.kind)
        : sym.kind === SymbolKind.Function;
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
  __resetForTests,
  __setSymbolsForTests,
  __setEdgesForTests,
};
