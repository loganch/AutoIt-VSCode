import { languages, SymbolKind } from 'vscode';
import { AUTOIT_MODE } from './util';
import { provideDocumentSymbols } from './ai_symbols';

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
  // Later tasks add awaited file scanning; the async signature is intentional.
  // eslint-disable-next-line no-unused-vars, require-await
  async provideReferences(document, position, context, token) {
    return [];
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
