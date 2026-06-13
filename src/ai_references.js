import { languages } from 'vscode';
import { AUTOIT_MODE } from './util';

const AutoItReferenceProvider = {
  // Later tasks add awaited file scanning; the async signature is intentional.
  // eslint-disable-next-line no-unused-vars, require-await
  async provideReferences(document, position, context, token) {
    return [];
  },
};

const referenceProvider = languages.registerReferenceProvider(AUTOIT_MODE, AutoItReferenceProvider);

export default referenceProvider;
export { AutoItReferenceProvider };
