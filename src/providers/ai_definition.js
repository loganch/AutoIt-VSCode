import { Location, Position, Range, Uri, languages, window, workspace } from 'vscode';
import { AUTOIT_MODE } from '../utils/coreConstants';
import { escapeRegexLiteral } from '../utils/regexPatterns';
import { buildVariableRegex } from '../language/variable';
import { getIncludePath, getIncludeScripts } from '../utils/includeResolution';
import { getIncludeText } from '../utils/fsCache';
import { lookupDefinition, noteFileContent } from '../services/symbolIndex';
import { getIncludeSet, extractIncludeEdges, toUriString } from '../services/includeGraph';
import { handleError } from '../errorUtils';

// Constants for better maintainability
const REGEX_FLAGS = 'mi';
const FUNCTION_KEYWORD = 'Func';
const VOLATILE_KEYWORD = 'volatile';

// Regex patterns. The variable-definition pattern lives in ./util
// (buildVariableRegex) as the single source of truth shared with the warm
// symbol index; createVariableRegex below delegates to it.
const FUNCTION_PATTERN_A_TEMPLATE =
  '^[ \\t]*{funcKeyword}[ \\t]+(?:{volatile}[ \\t]+)?({escaped})[ \\t]*\\(';
const FUNCTION_PATTERN_B_TEMPLATE =
  '^[ \\t]*{funcKeyword}[ \\t]+({escaped})[ \\t]+{volatile}[ \\t]*\\(';

const AutoItDefinitionProvider = {
  escapeRegex(string) {
    return escapeRegexLiteral(string);
  },

  createVariableRegex(variableName) {
    // Delegate to the shared builder (single source of truth, also used by
    // the warm symbol index). Same pattern + flags as before.
    return buildVariableRegex(variableName);
  },

  createFunctionRegex(functionName) {
    const escaped = this.escapeRegex(functionName);
    const patternA = FUNCTION_PATTERN_A_TEMPLATE.replace('{funcKeyword}', FUNCTION_KEYWORD)
      .replace('{volatile}', VOLATILE_KEYWORD)
      .replace('{escaped}', escaped);

    const patternB = FUNCTION_PATTERN_B_TEMPLATE.replace('{funcKeyword}', FUNCTION_KEYWORD)
      .replace('{volatile}', VOLATILE_KEYWORD)
      .replace('{escaped}', escaped);

    const combined = `(?:${patternA})|(?:${patternB})`;
    return new RegExp(combined, REGEX_FLAGS);
  },

  /**
   * Warm-index fast path: look up lookupText in the in-memory symbol index,
   * then keep only definitions whose file is reachable via #include from this
   * document. Pure in-memory (no file-content reads); returns null on
   * miss/error so the caller falls through to the include-graph scan.
   * @param {import("vscode").TextDocument} document
   * @param {string} documentText
   * @param {string} lookupText
   * @returns {Location|Location[]|null}
   */
  tryIndexFastPath(document, documentText, lookupText) {
    try {
      const isVariable = lookupText.startsWith('$');
      const candidates = lookupDefinition(lookupText, isVariable);
      if (candidates.length === 0) return null;

      // Use the canonical (case-normalized) key so edge keys and candidate
      // location keys share one space on case-insensitive filesystems.
      const docUriString = toUriString(document.uri.fsPath);
      // Parse the active document's includes live so unsaved edits are honored.
      // (This also refreshes the service's edge map for this document as a side effect.)
      const liveEdges = extractIncludeEdges(docUriString, documentText, document);
      const includeSet = getIncludeSet(docUriString, liveEdges);
      const inScope = candidates
        .map(entry => entry.location)
        .filter(
          loc => loc && loc.uri && loc.uri.fsPath && includeSet.has(toUriString(loc.uri.fsPath)),
        );

      if (inScope.length === 1) return inScope[0];
      if (inScope.length > 1) return inScope; // VS Code renders a peek list
      return null;
    } catch (err) {
      // Unexpected: the in-memory fast path should not throw. Log and fall
      // through to the include-graph scan so F12 still works.
      handleError('definition index fast path', err);
      return null;
    }
  },

  /**
   * Finds the definition of a word in a document and returns its location.
   * @param {import("vscode").TextDocument} document - The document in which to search for the word definition.
   * @param {Position} position - The position of the word for which to find the definition.
   * @returns {Location|Location[]|null} - The location(s) of the word definition, or null if not found.
   */
  provideDefinition(document, position) {
    try {
      const lookupRange = document.getWordRangeAtPosition(position);
      if (!lookupRange) return null;
      const lookupText = document.getText(lookupRange);
      if (!lookupText.trim()) return null;

      // Return cached result when available (cache is invalidated on every document edit)
      const cacheKey = `${document.uri.toString()}::${lookupText}`;
      if (definitionCache.has(cacheKey)) {
        return definitionCache.get(cacheKey);
      }

      const documentText = document.getText();
      if (!documentText) return null;

      const definitionRegex = this.determineRegex(lookupText);
      if (!definitionRegex) return null;

      const match = definitionRegex.exec(documentText);
      if (match) {
        // Capture group for symbol if present; compute the exact symbol index
        const symbolOffsetInMatch = match[1] ? match[0].indexOf(match[1]) : 0;
        const absoluteIndex = match.index + symbolOffsetInMatch;
        const pos = document.positionAt(absoluteIndex);
        const range = new Range(pos, pos);
        const locationResult = new Location(document.uri, range);
        definitionCache.set(cacheKey, locationResult);
        return locationResult;
      }

      // Index fast path: look up the symbol in the warm index, then keep only
      // definitions whose file is reachable via #include from this document.
      // Falls through to the include-graph scan on miss/error.
      const fastPathResult = this.tryIndexFastPath(document, documentText, lookupText);
      if (fastPathResult) {
        definitionCache.set(cacheKey, fastPathResult);
        return fastPathResult;
      }

      const includeResult = this.findDefinitionInIncludeFiles(
        documentText,
        definitionRegex,
        document,
        lookupText,
      );
      if (includeResult && includeResult.found) {
        const { scriptPath, found } = includeResult;
        const pos = new Position(found.line, found.character);
        const range = new Range(pos, pos);
        const includeLocation = new Location(Uri.file(scriptPath), range);
        definitionCache.set(cacheKey, includeLocation);
        return includeLocation;
      }

      definitionCache.set(cacheKey, null);
      return null;
    } catch (err) {
      // Every throw site in this file already builds a descriptive message,
      // so it doubles as the user-facing text at this one toast boundary.
      // Route through handleError (showUser: false) too, so the console log
      // stays consistent with every other catch site's format and keeps the
      // error's stack, without overriding this file's deliberately specific toast.
      handleError('provideDefinition', err);
      window.showErrorMessage(`provideDefinition error: ${err.message}`);
      return null;
    }
  },

  determineRegex(lookup) {
    try {
      return lookup.startsWith('$')
        ? this.createVariableRegex(lookup)
        : this.createFunctionRegex(lookup);
    } catch (error) {
      // A failed pattern build means "not found" to the caller.
      handleError('determineRegex', error);
      return null;
    }
  },

  findDefinitionInIncludeFiles(docText, defRegex, document, lookupText) {
    try {
      const scriptsToSearch = getIncludeScripts(document, docText);

      for (const script of scriptsToSearch) {
        // getIncludePath/getIncludeText never throw (both are safeExecute-backed
        // and fall back to '' on any failure); an empty result is filtered below.
        const scriptPath = getIncludePath(script, document);
        const scriptContent = getIncludeText(scriptPath) || '';
        if (!scriptContent || scriptContent.trim().length === 0) continue;

        // Opportunistic fill: index this just-read file into the warm index so
        // the next nearby navigation is warm and library files get indexed on
        // first use. Fire-and-forget; never throws and never alters this scan.
        noteFileContent(scriptPath, scriptContent);

        defRegex.lastIndex = 0;

        const m = defRegex.exec(scriptContent);
        if (!m) {
          continue;
        }
        const [fullMatch, firstGroup, secondGroup] = m;

        // Determine the capture for the symbol name. Variables only ever
        // match group 1; function names may land in group 1 (pattern A) or
        // group 2 (pattern B).
        const isVariable = lookupText && lookupText.startsWith('$');
        const capture = firstGroup || (!isVariable && secondGroup) || null;

        const symbol = capture || lookupText || '';
        const idx = capture ? m.index + fullMatch.indexOf(capture) : m.index;
        const length = capture?.length ?? fullMatch?.length ?? 0;

        // Compute line and character
        const prefix = scriptContent.slice(0, idx);
        const lines = prefix.split('\n');
        const line = lines.length - 1;
        const character = lines[lines.length - 1].length;

        return {
          scriptPath,
          scriptContent,
          found: {
            index: idx,
            length,
            line,
            character,
            symbol,
          },
          prefixLength: 0,
        };
      }

      return null;
    } catch (err) {
      // Internal-only: a failed include-file search just means "not found"
      // to the caller. The single user-facing toast for provideDefinition
      // lives at its own catch boundary.
      handleError('findDefinitionInIncludeFiles', err);
      return null;
    }
  },
};

// ---------------------------------------------------------------------------
// Definition result cache
// Key:   `${document.uri.toString()}::${lookupText}`
// Value: Location | Location[] | null
// Cleared entirely on any AutoIt document edit: a cached Location can point
// into an include file, so an edit anywhere can stale entries keyed under a
// different document's prefix. The cache only pays off for repeated F12 on
// the same symbol without any intervening edit (common during code
// navigation), so clearing on every edit is cheap and provably fresh.
// ---------------------------------------------------------------------------
const definitionCache = new Map();

/**
 * Registers the document-change cache invalidation and returns its Disposable
 * so extension.js can tie its lifetime to the extension via ctx.subscriptions,
 * instead of it living for the process lifetime as an import-time side effect.
 * @returns {import('vscode').Disposable}
 */
export const registerDefinitionCacheInvalidation = () =>
  workspace.onDidChangeTextDocument(() => definitionCache.clear());

/** Drops every cached definition result. Called from extension.js's deactivate(). */
export const clearDefinitionCache = () => definitionCache.clear();

/**
 * Registers the definition provider and returns its Disposable. Deferred to a
 * factory (called from extension.js's activate()) instead of module scope,
 * so merely importing this module doesn't register with VS Code.
 * @returns {import('vscode').Disposable}
 */
const registerDefinitionFeature = () =>
  languages.registerDefinitionProvider(AUTOIT_MODE, AutoItDefinitionProvider);

export default registerDefinitionFeature;
export { AutoItDefinitionProvider };
