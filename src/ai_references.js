import { languages } from 'vscode';
import { AUTOIT_MODE } from './util';

// AutoIt is case-insensitive. Word chars: letters, digits, underscore (and $ prefix for vars).
const WORD_PATTERN = /\$?[A-Za-z_][A-Za-z0-9_]*/;

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
};

const referenceProvider = languages.registerReferenceProvider(AUTOIT_MODE, AutoItReferenceProvider);

export default referenceProvider;
export { AutoItReferenceProvider };
