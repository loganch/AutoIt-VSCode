import { Hover, languages } from 'vscode';
import { AUTOIT_MODE } from '../util';

// Deferred until first hover so the ~70 signature modules don't load at activation.
let hovers = null;

const hoverFeature = languages.registerHoverProvider(AUTOIT_MODE, {
  provideHover(document, position) {
    if (!hovers) {
      hovers = require('../hovers').default;
    }

    const wordRange = document.getWordRangeAtPosition(position);

    const word = wordRange ? document.getText(wordRange).toLowerCase() : '';

    if (word in hovers) {
      return new Hover(hovers[word]);
    }

    return null;
  },
});

export default hoverFeature;
