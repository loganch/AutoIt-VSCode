import { Location, Position, Range, languages, window, workspace } from 'vscode';
import { AUTOIT_MODE } from '../utils/coreConstants';
import { AUTOIT_KEYWORDS } from '../signatures/keywords';
import {
  blankStrings,
  escapeRegex,
  findEnclosingFunctionInDocument,
  isLocalDeclaredInBody,
  stringMask,
  stripLineComment,
} from '../utils/textUtils.js';

// Workspace scan budget (mirrors ai_workspaceSymbols.js defaults).
const DEFAULT_MAX_FILES = 500;
const DEFAULT_BATCH_SIZE = 10;

// AutoIt is case-insensitive. Word chars: letters, digits, underscore (and $ prefix for vars).
const WORD_PATTERN = /\$?[A-Za-z_][A-Za-z0-9_]*/;

const AutoItReferenceProvider = {
  async provideReferences(document, position, context, token) {
    try {
      const symbol = this.getSymbolAtPosition(document, position);
      if (!symbol) return [];

      const includeDeclaration = !context || context.includeDeclaration !== false;
      const regex = this.buildMatchRegex(symbol.name, symbol.isVariable);

      if (symbol.isVariable) {
        const scope = await this.classifyScope(document, position, symbol.name);
        if (scope.kind === 'local') {
          return this.collectLocal(document, scope.range, regex, includeDeclaration, symbol.name);
        }
      }
      // Function or Global variable -> workspace scan (implemented in Task 6).
      return this.collectWorkspace(document, regex, includeDeclaration, position, token);
    } catch (err) {
      window.showErrorMessage(`provideReferences error: ${err.message}`);
      return [];
    }
  },

  // Scan the whole document, keep only hits inside the enclosing function range.
  collectLocal(document, range, regex, includeDeclaration, name) {
    const hits = this.scanText(document.getText(), regex);
    const withinRange = h =>
      (h.line > range.start.line ||
        (h.line === range.start.line && h.character >= range.start.character)) &&
      (h.line < range.end.line ||
        (h.line === range.end.line && h.character <= range.end.character));

    const declLine = includeDeclaration ? -1 : this.findLocalDeclarationLine(document, range, name);

    const locations = [];
    for (const hit of hits) {
      if (!withinRange(hit)) continue;
      if (!includeDeclaration && hit.line === declLine) continue;
      const start = new Position(hit.line, hit.character);
      const end = new Position(hit.line, hit.character + hit.length);
      locations.push(new Location(document.uri, new Range(start, end)));
    }
    return locations;
  },

  // Find the line (absolute, document-relative) where a Local variable is declared
  // within its enclosing function range. Returns -1 if not found.
  // Unlike the definition provider (which returns the first match in the whole file),
  // this restricts the search to the function body so a Local that shadows an earlier
  // same-named Global/assignment resolves to the correct in-scope declaration line.
  findLocalDeclarationLine(document, range, name) {
    const escaped = escapeRegex(name);
    // Param in the Func signature, OR a Local/Static/Dim declaration of `name`.
    const declRe = new RegExp(`\\b(?:Local|Static|Dim)\\b[^\\n]*?${escaped}\\b`, 'i');
    const paramRe = new RegExp(`^\\s*(?:volatile\\s+)?Func\\b[^\\n(]*\\([^)]*${escaped}\\b`, 'i');
    const { line: startLine } = range.start;
    const { line: endLine } = range.end;
    for (let line = startLine; line <= endLine; line++) {
      const { text: raw } = document.lineAt(line);
      const code = blankStrings(stripLineComment(raw)); // ignore comments/strings
      if (paramRe.test(code) || declRe.test(code)) return line;
    }
    return -1;
  },

  // Scan every AutoIt file in the workspace (plus the current document) for the
  // symbol. Batched + cancellable + UI-yielding so a large workspace never blocks
  // the extension host.
  async collectWorkspace(document, regex, includeDeclaration, cursorPos, token) {
    if (token?.isCancellationRequested) return [];
    const config = workspace.getConfiguration('autoit');
    // These keys are intentionally SHARED with the workspace-symbol scan: both do
    // the same workload (scanning every *.au3/*.a3x), so one performance knob
    // (autoit.workspaceSymbolMaxFiles / workspaceSymbolBatchSize) controls both.
    const maxFiles = config.get('workspaceSymbolMaxFiles', DEFAULT_MAX_FILES);
    const batchSize = config.get('workspaceSymbolBatchSize', DEFAULT_BATCH_SIZE);

    const found = (await workspace.findFiles('**/*.{au3,a3x}')) || [];
    const currentPath = document.uri.fsPath;
    const seen = new Set([currentPath]);
    const files = [{ fsPath: currentPath, toString: () => currentPath }];
    for (const f of found) {
      if (!seen.has(f.fsPath)) {
        seen.add(f.fsPath);
        files.push(f);
      }
    }
    const capped = files.length > maxFiles;
    if (capped) {
      window.showWarningMessage(
        `AutoIt: Searching ${maxFiles} of ${files.length} files for references. Increase 'autoit.workspaceSymbolMaxFiles' to search more files.`,
      );
    }
    const searchFiles = capped ? files.slice(0, maxFiles) : files;
    const locations = [];

    for (let i = 0; i < searchFiles.length; i += batchSize) {
      if (token?.isCancellationRequested) return [];
      const batch = searchFiles.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async file => {
          try {
            // Reuse the already-open current document instead of reopening it
            // (avoids double-counting and uses unsaved in-memory edits).
            const fileDoc =
              file.fsPath === currentPath
                ? document
                : await workspace.openTextDocument(file.fsPath);
            const hits = this.scanText(fileDoc.getText(), this.cloneRegex(regex));
            return { uri: fileDoc.uri, hits };
          } catch {
            return null; // skip unreadable files
          }
        }),
      );
      for (const r of batchResults) {
        if (!r) continue;
        for (const hit of r.hits) {
          const start = new Position(hit.line, hit.character);
          const end = new Position(hit.line, hit.character + hit.length);
          locations.push(new Location(r.uri, new Range(start, end)));
        }
      }
      // Yield so a huge workspace doesn't block the extension host.
      await new Promise(resolve => setImmediate(resolve));
    }

    if (!includeDeclaration) {
      const decl = this.resolveDeclaration(document, cursorPos);
      if (decl && decl.uri) {
        return locations.filter(
          l => !(l.uri.fsPath === decl.uri.fsPath && l.range.start.line === decl.range.start.line),
        );
      }
    }
    return locations;
  },

  // Each parallel file scan needs its own regex: the `g` flag makes regex
  // stateful (lastIndex), so a shared instance would corrupt concurrent scans.
  cloneRegex(regex) {
    return new RegExp(regex.source, regex.flags);
  },

  // Resolve the full declaration Location via the existing Go-to-Definition
  // provider (needed for the includeDeclaration filter, which matches BOTH uri
  // and line). Lazy require avoids a circular import at module load.
  resolveDeclaration(document, cursorPos) {
    const { AutoItDefinitionProvider } = require('./ai_definition');
    try {
      return AutoItDefinitionProvider.provideDefinition(document, cursorPos);
    } catch {
      return null;
    }
  },

  getSymbolAtPosition(document, position) {
    // Pass an explicit pattern so the leading `$` is always captured regardless of
    // the editor's default word separators.
    const range = document.getWordRangeAtPosition(position, new RegExp(WORD_PATTERN.source, 'g'));
    if (!range) return null;
    const name = document.getText(range);
    if (!name || !name.trim()) return null;
    if (!name.startsWith('$') && AUTOIT_KEYWORDS.has(name.toLowerCase())) return null;
    return { name, isVariable: name.startsWith('$') };
  },

  buildMatchRegex(name, isVariable) {
    const escaped = escapeRegex(name);
    // For variables the `$` is the left boundary; guard the right with \b.
    // For functions, both sides use \b.
    const pattern = isVariable ? `${escaped}\\b` : `\\b${escaped}\\b`;
    return new RegExp(pattern, 'gi');
  },

  scanText(text, regex) {
    const results = [];
    const lines = text.split(/\r?\n/);
    let inBlockComment = false;
    for (let line = 0; line < lines.length; line++) {
      const raw = lines[line];
      if (/^\s*#(?:ce|comments-end)\b/i.test(raw)) {
        inBlockComment = false;
        continue;
      }
      if (/^\s*#(?:cs|comments-start)\b/i.test(raw)) {
        inBlockComment = true;
        continue;
      }
      if (inBlockComment) continue;

      const code = stripLineComment(raw);
      if (!code) continue;
      const mask = stringMask(code);

      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(code)) !== null) {
        if (m.index === regex.lastIndex) regex.lastIndex++; // guard zero-width
        if (mask[m.index]) continue; // inside a string
        results.push({ line, character: m.index, length: m[0].length });
      }
    }
    return results;
  },

  classifyScope(document, position, name) {
    const range = findEnclosingFunctionInDocument(document, position);
    if (!range) return { kind: 'global' };

    const bodyText = document.getText(range);
    if (isLocalDeclaredInBody(bodyText, name)) {
      return { kind: 'local', range };
    }
    return { kind: 'global' };
  },
};

const referenceProvider = languages.registerReferenceProvider(AUTOIT_MODE, AutoItReferenceProvider);

export default referenceProvider;
export { AutoItReferenceProvider };
