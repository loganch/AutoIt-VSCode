// src/services/symbolIndex.js
import { Location, SymbolInformation, SymbolKind, Uri, workspace } from 'vscode';
import { isVariableDeclarationLine } from '../util';
import { provideDocumentSymbols } from '../ai_symbols';
import { toUriString, extractIncludeEdges, removeEdges } from './includeGraph';

// uriString -> SymbolInformation[]
const symbolsCache = new Map();

const VARIABLE_KINDS = new Set([SymbolKind.Variable, SymbolKind.Constant, SymbolKind.Enum]);

/** True for the symbol kinds treated as variable-like by lookupDefinition. */
function isVariableKind(kind) {
  return kind !== undefined && VARIABLE_KINDS.has(kind);
}

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
      // For variable tokens, only declaration-tagged symbols are definitions —
      // a mere usage (e.g. `ConsoleWrite($g_Config)`) is recorded by
      // provideDocumentSymbols but must not appear as a Go-to-Definition target.
      // Const/Enum kinds are tagged as declarations by kind at index time (a
      // usage would be a plain Variable), so they always pass this tag check.
      const kindOk = isVariable
        ? isVariableKind(sym.kind) && sym.isVariableDeclaration === true
        : sym.kind === SymbolKind.Function;
      if (kindOk && sym.location) matches.push(sym);
    }
  }
  return matches;
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
    const flat = flattenSymbols(symbols, document.uri);
    // Tag variable-kind symbols with whether their source line is an actual
    // DECLARATION (vs. a mere usage). The document is in hand here, so this adds
    // no extra file read and does not affect F12's zero-read fast path.
    for (const sym of flat) {
      if (isVariableKind(sym.kind)) {
        if (sym.kind === SymbolKind.Constant || sym.kind === SymbolKind.Enum) {
          // getVariableKind only assigns Constant/Enum on declaration lines, so the
          // symbol's kind alone proves it's a declaration (a usage would be Variable).
          sym.isVariableDeclaration = true;
        } else {
          const lineNo = sym.location?.range?.start?.line;
          let lineText = '';
          try {
            lineText = typeof lineNo === 'number' ? document.lineAt(lineNo).text || '' : '';
          } catch {
            lineText = '';
          }
          sym.isVariableDeclaration = isVariableDeclarationLine(lineText, sym.name);
        }
      }
    }
    symbolsCache.set(uriString, flat);
    extractIncludeEdges(uriString, document.getText(), document);
  } catch {
    symbolsCache.delete(uriString);
    removeEdges(uriString);
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
  removeEdges(uriString);
}

// --- test seams ---
function __resetForTests() {
  symbolsCache.clear();
}
function __setSymbolsForTests(uriString, symbols) {
  symbolsCache.set(uriString, symbols);
}

export {
  symbolsCache,
  lookupDefinition,
  flattenSymbols,
  indexDocument,
  warmDocument,
  noteFileContent,
  removeDocument,
  __resetForTests,
  __setSymbolsForTests,
};
