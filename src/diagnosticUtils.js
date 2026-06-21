import { Diagnostic, DiagnosticSeverity, Position, Range, Uri, workspace } from 'vscode';
import { debugLog } from './debugLog';

/**
 * Returns the diagnostic severity based on the severity string.
 * @param {string} severityString - The severity string to convert to DiagnosticSeverity.
 * @returns {DiagnosticSeverity} - The DiagnosticSeverity based on the severity string.
 */
export const getDiagnosticSeverity = severityString => {
  switch (severityString) {
    case 'warning':
      return DiagnosticSeverity.Warning;
    default:
      return DiagnosticSeverity.Error;
  }
};

/**
 * Returns a diagnostic range for a given line and position.
 * @param {string|number} line - The line number (string or number).
 * @param {string|number} position - The position number (string or number).
 * @returns {Range} - The diagnostic range.
 */
export const createDiagnosticRange = (line, position) => {
  // Coerce inputs to integers in a robust, predictable way.
  let parsedLine = NaN;
  if (typeof line === 'string') {
    parsedLine = parseInt(line, 10);
  } else if (typeof line === 'number') {
    parsedLine = Math.floor(Number(line));
  }

  let parsedPosition = NaN;
  if (typeof position === 'string') {
    parsedPosition = parseInt(position, 10);
  } else if (typeof position === 'number') {
    parsedPosition = Math.floor(Number(position));
  }

  // Convert to zero-based numbers and fall back to 0 for invalid values.
  const lineNum =
    Number.isFinite(parsedLine) && !Number.isNaN(parsedLine) ? Math.max(0, parsedLine - 1) : 0;

  const charNum =
    Number.isFinite(parsedPosition) && !Number.isNaN(parsedPosition)
      ? Math.max(0, parsedPosition - 1)
      : 0;

  const diagnosticPosition = new Position(lineNum, charNum);

  return new Range(diagnosticPosition, diagnosticPosition);
};

/**
 * Adds a new diagnostic to a Map of diagnostics.
 * @param {Map} diagnostics - The current diagnostics object.
 * @param {string} scriptPath - The path of the script that the diagnostic is for.
 * @param {Diagnostic} diagnosticToAdd - The new diagnostics object to add.
 */
export const updateDiagnostics = (diagnostics, scriptPath, diagnosticToAdd) => {
  let diagnosticArray;
  if (diagnostics.has(scriptPath)) {
    diagnosticArray = diagnostics.get(scriptPath);
  } else {
    diagnosticArray = [];
  }
  diagnosticArray.push(diagnosticToAdd);
  diagnostics.set(scriptPath, diagnosticArray);
};

/**
 * External ownership map: avoids mutating framework Diagnostic objects with a custom property.
 * @type {WeakMap<object, string>}
 */
const diagnosticOwners = new WeakMap();

/**
 * Record which owner URI created a diagnostic, for later cleanup via clearDiagnosticsOwnedBy.
 * @param {object} diagnostic
 * @param {string} ownerUri
 */
export const setDiagnosticOwner = (diagnostic, ownerUri) =>
  diagnosticOwners.set(diagnostic, ownerUri);

/**
 * Look up the owner URI previously recorded for a diagnostic via setDiagnosticOwner.
 * @param {object} diagnostic
 * @returns {string|undefined}
 */
export const getDiagnosticOwner = diagnostic => diagnosticOwners.get(diagnostic);

const OUTPUT_REGEXP =
  /"(?<scriptPath>.+)"\((?<line>\d{1,4}),(?<position>\d{1,4})\)\s:\s(?<severity>warning|error):\s(?<description>.+)\r/gm;

/**
 * Normalize Windows-like paths to a comparable form:
 * - If path starts with "/C:" style, convert to "C:".
 * - Convert forward slashes to backslashes.
 * - Trim whitespace.
 */
const normalizeWindowsPath = p => {
  if (!p || typeof p !== 'string') return '';
  let n = p.trim();
  if (n.startsWith('/')) {
    n = n.slice(1);
  }
  if (n[1] === ':') {
    n = n[0].toUpperCase() + n.slice(1);
  }
  n = n.replace(/\//g, '\\'); // / -> \
  return n;
};

/**
 * Case-insensitive comparison after normalization to determine if two paths
 * refer to the same file. This is a simple heuristic suitable for Windows.
 */
const pathsReferToSameFile = (a, b) => {
  const na = normalizeWindowsPath(a);
  const nb = normalizeWindowsPath(b);
  if (!na || !nb) return false;
  return na.toLowerCase() === nb.toLowerCase();
};

// ASCII printable range boundaries (space to tilde)
const ASCII_PRINTABLE_START = 0x20;
const ASCII_PRINTABLE_END = 0x7e;

/**
 * Detect presence of non-ASCII characters that may trigger AU3Check encoding issues.
 * Returns true if any character is outside the 0x20-0x7E printable ASCII range.
 */
const hasSpecialCharacters = p => {
  if (!p) return false;
  return Array.from(p).some(char => {
    const code = char.charCodeAt(0);
    return code < ASCII_PRINTABLE_START || code > ASCII_PRINTABLE_END;
  });
};

/**
 * Processes the results of AU3Check, identifies warnings and errors.
 * @param {string} output Text returned from AU3Check.
 * @param {import('vscode').DiagnosticCollection} collection - The diagnostic collection to update.
 * @param {Uri} documentURI - The URI of the document that was checked
 */
export const parseAu3CheckOutput = (output, collection, documentURI) => {
  if (output.includes('- 0 error(s), 0 warning(s)')) {
    collection.delete(documentURI);
    return;
  }

  const diagnostics = new Map();

  const matches = [...output.matchAll(OUTPUT_REGEXP)];
  matches.forEach(match => {
    const { line, position, severity, description, scriptPath } = match.groups;
    const diagnosticRange = createDiagnosticRange(line, position);
    const diagnosticSeverity = getDiagnosticSeverity(severity);

    const diagnosticToAdd = new Diagnostic(diagnosticRange, description, diagnosticSeverity);

    // Set proper human-readable source as per VS Code API guidelines
    diagnosticToAdd.source = 'au3check';

    // Track ownership externally (not as a property on the framework Diagnostic object)
    // so clearDiagnosticsOwnedBy can identify diagnostics that belong to a specific owner.
    setDiagnosticOwner(diagnosticToAdd, documentURI.toString());

    // Use scriptPath by default to correctly attribute diagnostics to included files.
    // Fall back to documentURI only when AU3Check's path encoding likely corrupts the path:
    // specifically, when both paths refer to the same file AND either contains special characters.
    const normalizedScriptPath = normalizeWindowsPath(scriptPath);
    const normalizedDocumentPath = normalizeWindowsPath(
      documentURI.fsPath ?? documentURI.path ?? String(documentURI),
    );

    let chosenPath = normalizedScriptPath;

    const scriptHasSpecial = hasSpecialCharacters(normalizedScriptPath);
    const docHasSpecial = hasSpecialCharacters(normalizedDocumentPath);

    // Fallback condition: same file and special chars present -> prefer documentURI (stable encoding).
    if (
      !normalizedScriptPath ||
      normalizedScriptPath.length === 0 ||
      (pathsReferToSameFile(normalizedScriptPath, normalizedDocumentPath) &&
        (scriptHasSpecial || docHasSpecial))
    ) {
      chosenPath = normalizedDocumentPath;
    }

    updateDiagnostics(diagnostics, chosenPath, diagnosticToAdd);
  });

  diagnostics.forEach((diagnosticArray, file) => {
    // Track the file URI we set diagnostics for, to enable safe future cleanup.
    try {
      trackDiagnosticFile(file);
    } catch (error) {
      console.debug('[AutoIt][diagnostics] Failed to track diagnostic file URI.', error);
    }
    collection.set(Uri.file(file), diagnosticArray);
  });
};

/**
 * Remove all diagnostics from the given collection that were created by the specified ownerUri,
 * without relying on internal VS Code API properties.
 * Strategy:
 * - Iterate over known URIs:
 *   1) All currently open text documents (workspace.textDocuments)
 *   2) All workspace files that currently have diagnostics, discovered by scanning the collection
 *      via keys we already touched in this session (optional, handled by a lightweight index).
 *
 * Note: Since DiagnosticCollection lacks public iteration, we use a conservative, public-API-only approach:
 * - Check every open text document's URI for diagnostics and filter by Diagnostic.source.
 * - Additionally, if the extension maintains an index of URIs it set diagnostics for, use that list.
 *   We implement a minimal in-module index that tracks URIs whenever parseAu3CheckOutput sets diagnostics.
 */

/** @type {Set<string>} */
const trackedDiagnosticFileUris = new Set();

/** Cap on trackedDiagnosticFileUris size; oldest entry is evicted once exceeded. */
const MAX_TRACKED_DIAGNOSTIC_URIS = 500;

/**
 * Clears all tracked diagnostic file URIs. Exposed for `deactivate()` and tests.
 */
export const resetDiagnosticTracking = () => trackedDiagnosticFileUris.clear();

/**
 * Register a file path (as string) whose diagnostics we set, so later cleanup can find it safely via public APIs.
 * @param {string} filePath
 */
const trackDiagnosticFile = filePath => {
  if (!filePath) return;
  try {
    const uri = Uri.file(filePath).toString();
    if (
      !trackedDiagnosticFileUris.has(uri) &&
      trackedDiagnosticFileUris.size >= MAX_TRACKED_DIAGNOSTIC_URIS
    ) {
      // ponytail: FIFO eviction (oldest insertion); upgrade if access patterns need true LRU
      trackedDiagnosticFileUris.delete(trackedDiagnosticFileUris.values().next().value);
    }
    trackedDiagnosticFileUris.add(uri);
  } catch (error) {
    console.debug('[AutoIt][diagnostics] Failed to register tracked diagnostic URI.', error);
  }
};

/**
 * Filter diagnostics on a specific URI by owner URI.
 * @param {import('vscode').DiagnosticCollection} collection
 * @param {import('vscode').Uri} uri
 * @param {string} owner
 */
const filterDiagnosticsOnUriByOwner = (collection, uri, owner) => {
  try {
    const current = collection.get(uri);
    if (!current || current.length === 0) return;
    const filtered = current.filter(d => {
      if (!d) return false;
      return getDiagnosticOwner(d) !== owner;
    });
    if (filtered.length === 0) {
      collection.delete(uri);
      trackedDiagnosticFileUris.delete(uri.toString());
    } else if (filtered.length !== current.length) {
      collection.set(uri, filtered);
    }
  } catch (err) {
    // Optional debug logging of cleanup failures without breaking the extension
    debugLog(
      `[AutoIt][diagnostics] Failed to filter diagnostics on ${uri?.toString?.() ?? String(uri)} for owner=${owner}: ${err?.message ?? err}`,
    );
  }
};

/**
 * Public-API-only clearing of diagnostics owned by a given ownerUri.
 * @param {import('vscode').DiagnosticCollection} collection
 * @param {string|Uri} ownerUri
 */
export const clearDiagnosticsOwnedBy = (collection, ownerUri) => {
  const owner =
    typeof ownerUri === 'string' ? ownerUri : (ownerUri?.toString?.() ?? String(ownerUri));

  // 1) Filter diagnostics for all currently open text documents (public API).
  try {
    for (const doc of workspace.textDocuments ?? []) {
      filterDiagnosticsOnUriByOwner(collection, doc.uri, owner);
    }
  } catch (err) {
    // Optional debug logging without breaking extension
    debugLog(
      `[AutoIt][diagnostics] Failed while iterating open documents during cleanup for owner=${owner}: ${err?.message ?? err}`,
    );
  }

  // 2) Filter diagnostics for any URIs we previously set (tracked index), using only public API get/set/delete.
  // Convert tracked string URIs back to Uri and filter them.
  try {
    if (trackedDiagnosticFileUris.size > 0) {
      const uris = Array.from(trackedDiagnosticFileUris).map(u => Uri.parse(u));
      for (const uri of uris) {
        filterDiagnosticsOnUriByOwner(collection, uri, owner);
      }
    }
  } catch (err) {
    // Optional debug logging without breaking extension
    debugLog(
      `[AutoIt][diagnostics] Failed while iterating tracked URIs during cleanup for owner=${owner}: ${err?.message ?? err}`,
    );
  }
};

export default parseAu3CheckOutput;
