import { Hover, languages } from 'vscode';
import { AUTOIT_MODE } from '../utils/coreConstants';

// Deferred until first hover so the ~70 signature modules don't load at activation.
let hovers = null;

const hoverFeature = languages.registerHoverProvider(AUTOIT_MODE, {
  async provideHover(document, position) {
    if (!hovers) {
      hovers = (await import('../hovers')).default;
    }

    const wordRange = document.getWordRangeAtPosition(position);

    const word = wordRange ? document.getText(wordRange).toLowerCase() : '';

    const line = document.lineAt(position.line);
    const firstChar = line.text.charAt(line.firstNonWhitespaceCharacterIndex);
    
    // Only provide a hover if line isn't a comment line.
    if ((word in hovers) && (firstChar !== ";")) {
      return new Hover(hovers[word]);
    }

    return null;
  },
});

export default hoverFeature;
