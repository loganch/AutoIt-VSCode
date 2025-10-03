import { Hover, languages } from 'vscode';
import hovers from './hovers';
import { AUTOIT_MODE } from './util';

const hoverFeature = languages.registerHoverProvider(AUTOIT_MODE, {
  provideHover(document, position) {
    const wordRange = document.getWordRangeAtPosition(position);

    const word = wordRange ? document.getText(wordRange).toLowerCase() : '';

    if (word in hovers) {
      return new Hover(hovers[word]);
    }

    return null;
  },
});

export default hoverFeature;
