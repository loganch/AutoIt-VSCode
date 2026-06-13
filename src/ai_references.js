import { Location, Position, Range, SymbolKind, languages, window, workspace } from 'vscode';
import { AUTOIT_MODE } from './util';
import { provideDocumentSymbols } from './ai_symbols';

// Workspace scan budget (mirrors ai_workspaceSymbols.js defaults).
const DEFAULT_MAX_FILES = 500;
const DEFAULT_BATCH_SIZE = 10;

// AutoIt is case-insensitive. Word chars: letters, digits, underscore (and $ prefix for vars).
const WORD_PATTERN = /\$?[A-Za-z_][A-Za-z0-9_]*/;

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Remove the comment tail of a line (a `;` not inside a string).
function stripLineComment(line) {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === ';' && !inSingle && !inDouble) return line.slice(0, i);
  }
  return line;
}

// Build a boolean mask of columns that fall inside a quoted string.
function stringMask(line) {
  const mask = new Array(line.length).fill(false);
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      mask[i] = true;
    } else if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      mask[i] = true;
    } else {
      mask[i] = inSingle || inDouble;
    }
  }
  return mask;
}

// Replace quoted-string characters on a line with spaces so they can't match
// code patterns (e.g. a decoy `"Local $x"` literal).
function blankStrings(line) {
  const mask = stringMask(line);
  return line
    .split('')
    .map((ch, i) => (mask[i] ? ' ' : ch))
    .join('');
}

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
          return this.collectLocal(document, scope.range, regex, includeDeclaration, position);
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
  collectLocal(document, range, regex, includeDeclaration, cursorPos) {
    const hits = this.scanText(document.getText(), regex);
    const withinRange = h =>
      (h.line > range.start.line ||
        (h.line === range.start.line && h.character >= range.start.character)) &&
      (h.line < range.end.line ||
        (h.line === range.end.line && h.character <= range.end.character));

    const declLine = includeDeclaration ? -1 : this.getDeclarationLine(document, cursorPos);

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

  // Resolve the declaration line via the existing Go-to-Definition provider.
  getDeclarationLine(document, cursorPos) {
    const decl = this.resolveDeclaration(document, cursorPos);
    return decl && decl.range ? decl.range.start.line : -1;
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
    // Warn before slicing: silently dropping files would make a reference list
    // look complete when it isn't.
    if (found.length > maxFiles) {
      window.showWarningMessage(
        `AutoIt: Searching ${maxFiles} of ${found.length} files for references. Increase 'autoit.workspaceSymbolMaxFiles' to search more files.`,
      );
    }
    const files = found.slice(0, maxFiles);
    const currentPath = document.uri.fsPath;
    const locations = [];

    for (let i = 0; i < files.length; i += batchSize) {
      if (token?.isCancellationRequested) return [];
      const batch = files.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async file => {
          try {
            // Reuse the already-open current document instead of reopening it
            // (avoids double-counting and uses unsaved in-memory edits).
            const fileDoc =
              file.fsPath === currentPath ? document : await workspace.openTextDocument(file);
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

  async classifyScope(document, position, name) {
    let symbols = [];
    try {
      symbols = (await provideDocumentSymbols(document)) || [];
    } catch {
      return { kind: 'global' };
    }

    // Find the innermost Function symbol whose range contains the position.
    const enclosing = this.findEnclosingFunction(symbols, position);
    if (!enclosing) return { kind: 'global' };

    // Is `name` declared Local/Static/Dim or a parameter within this function body?
    const range = enclosing.range || enclosing.location?.range;
    const bodyText = document.getText(range);
    if (this.isLocalDeclaredInBody(bodyText, name)) {
      return { kind: 'local', range };
    }
    return { kind: 'global' };
  },

  findEnclosingFunction(symbols, position, found = null) {
    // AutoIt has no nested functions; the children recursion is defensive
    // (children are Map keys/region groupings, not functions).
    const contains = (r, p) =>
      (r.start.line < p.line || (r.start.line === p.line && r.start.character <= p.character)) &&
      (r.end.line > p.line || (r.end.line === p.line && r.end.character >= p.character));
    let result = found;
    for (const s of symbols) {
      const { kind } = s;
      const range = s.range || s.location?.range;
      if (!range) continue;
      if (kind === SymbolKind.Function && contains(range, position)) {
        result = s;
      }
      if (s.children && s.children.length) {
        result = this.findEnclosingFunction(s.children, position, result);
      }
    }
    return result;
  },

  isLocalDeclaredInBody(bodyText, name) {
    const escaped = escapeRegex(name);
    // Strip line comments and blank out string contents per line so decoys like
    // `; Local $x` or `"Local $x"` cannot falsely match and misclassify a global.
    const codeOnly = bodyText
      .split(/\r?\n/)
      .map(l => blankStrings(stripLineComment(l)))
      .join('\n');
    // Local/Static/Dim declaration (possibly in a comma list): keyword ... $name.
    // Line-continuation (`_`) split declarations are intentionally not handled:
    // missing a local declaration only widens the (global) search, the safe direction.
    const declRe = new RegExp(`\\b(?:Local|Static|Dim)\\b[^\\n]*?${escaped}\\b`, 'i');
    if (declRe.test(codeOnly)) return true;
    // Parameter in the Func signature: Func Name(... $name ...)
    const sigRe = new RegExp(`^\\s*(?:volatile\\s+)?Func\\b[^\\n(]*\\([^)]*${escaped}\\b`, 'i');
    return sigRe.test(codeOnly);
  },
};

const referenceProvider = languages.registerReferenceProvider(AUTOIT_MODE, AutoItReferenceProvider);

export default referenceProvider;
export { AutoItReferenceProvider };
