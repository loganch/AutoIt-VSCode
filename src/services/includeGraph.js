// src/services/includeGraph.js
import { Uri } from 'vscode';
import { getIncludePath } from '../utils/includeResolution';
import { REGEX_PATTERNS } from '../utils/regexPatterns';

// Include-capability layering (see config/pathResolution.js for the full
// list): this is the top layer for go-to-definition — it builds and caches
// a bidirectional graph of which documents include which (keyed on
// getIncludePath's resolution), so ai_definition.js's fast path can
// invalidate/traverse without re-parsing every #include on each lookup.

// uriString -> string[] of resolved include-target uriStrings
const includeEdges = new Map();

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
  collect(REGEX_PATTERNS.relativeInclude, raw => `"${raw}"`);
  collect(REGEX_PATTERNS.libraryInclude, raw => `<${raw}>`);
  includeEdges.set(documentUriString, edges);
  return edges;
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
 * Remove a document's include edges from the graph.
 * @param {string} uriString
 */
function removeEdges(uriString) {
  includeEdges.delete(uriString);
}

/** Drops the entire include graph. Called from extension.js's deactivate(). */
function clearIncludeEdges() {
  includeEdges.clear();
}

// --- test seam ---
function __setEdgesForTests(uriString, edges) {
  includeEdges.set(uriString, edges);
}

export {
  includeEdges,
  toUriString,
  extractIncludeEdges,
  getIncludeSet,
  removeEdges,
  clearIncludeEdges,
  clearIncludeEdges as __resetForTests,
  __setEdgesForTests,
};
