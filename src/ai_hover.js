import { Hover, languages } from 'vscode';
import hovers from './hovers';
import { AUTOIT_MODE } from './util';

const hoverFeature = languages.registerHoverProvider(AUTOIT_MODE, {
  provideHover(document, position) {
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
