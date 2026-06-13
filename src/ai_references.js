import { languages } from 'vscode';
import { AUTOIT_MODE } from './util';

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
};

const referenceProvider = languages.registerReferenceProvider(AUTOIT_MODE, AutoItReferenceProvider);

export default referenceProvider;
export { AutoItReferenceProvider };
