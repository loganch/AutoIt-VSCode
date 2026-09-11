import { Hover, languages } from 'vscode';
import { AUTOIT_MODE } from '../utils/coreConstants';
import { isInComment } from '../utils/textUtils';

// Deferred until first hover so the ~70 signature modules don't load at activation.
let hovers = null;

/**
 * Registers the hover provider and returns its Disposable. Deferred to a
 * factory (called from extension.js's activate()) instead of module scope,
 * so merely importing this module doesn't register with VS Code.
 * @returns {import('vscode').Disposable}
 */
const registerHoverFeature = () =>
  languages.registerHoverProvider(AUTOIT_MODE, {
    async provideHover(document, position) {
      if (isInComment(document, position)) return null;

      if (!hovers) {
        hovers = (await import('../hovers')).default;
      }

      const wordRange = document.getWordRangeAtPosition(position);

      const word = wordRange ? document.getText(wordRange).toLowerCase() : '';

      if (word in hovers) {
        return new Hover(hovers[word]);
      }

      return null;
    },
  });

export default registerHoverFeature;
