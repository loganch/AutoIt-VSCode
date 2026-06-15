// src/services/symbolIndex.js
import { SymbolKind } from 'vscode';

// uriString -> SymbolInformation[]
const symbolsCache = new Map();

const VARIABLE_KINDS = new Set([SymbolKind.Variable, SymbolKind.Constant, SymbolKind.Enum]);

/**
 * Find definition matches for a symbol name in the warm index.
 * @param {string} name - Symbol name (e.g. "MyFunc" or "$Global").
 * @param {boolean} isVariable - True when the token starts with "$".
 * @returns {Array} Matching indexed symbol entries (each has a `.location`).
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

// --- test seams ---
function __resetForTests() {
  symbolsCache.clear();
}
function __setSymbolsForTests(uriString, symbols) {
  symbolsCache.set(uriString, symbols);
}

export { symbolsCache, lookupDefinition, __resetForTests, __setSymbolsForTests };
