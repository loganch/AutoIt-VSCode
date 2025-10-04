import { CompletionItem, CompletionItemKind, Range, languages, workspace } from 'vscode';
import completions from './completions';
import {
  AUTOIT_MODE,
  functionPattern as _functionPattern,
  findFilepath,
  getIncludeData,
  includePattern,
  libraryIncludePattern,
  setRegExpFlags,
  variablePattern,
} from './util';
import DEFAULT_UDFS from './constants';

// Per-document cache for include completions
const includeCache = new Map(); // Map<documentUri, { files: string[], completions: CompletionItem[] }>
const MAX_CACHE_SIZE = 50; // LRU cache limit

const functionPattern = setRegExpFlags(_functionPattern, 'gim');
let parenTriggerOn = workspace.getConfiguration('autoit').get('enableParenTriggerForFunctions');

workspace.onDidChangeConfiguration(event => {
  if (event.affectsConfiguration('autoit.enableParenTriggerForFunctions'))
    parenTriggerOn = workspace.getConfiguration('autoit').get('enableParenTriggerForFunctions');
});

// Clean up cache when documents are closed
workspace.onDidCloseTextDocument(document => {
  if (document.languageId === 'autoit') {
    const docUri = document.uri.toString();
    includeCache.delete(docUri);
  }
});

/**
 * Creates a new completion item.
 * @param {CompletionItemKind} kind - The kind of completion item.
 * @param {string} name - The name of the completion item.
 * @param {string} [itemDetail='Document Function'] - The detail of the completion item.
 * @returns {CompletionItem} The new completion item.
 */
const createNewCompletionItem = (kind, name, itemDetail = 'Document Function') => {
  const compItem = new CompletionItem(name, kind);

  compItem.detail = kind === CompletionItemKind.Variable ? 'Variable' : itemDetail;

  if (kind === CompletionItemKind.Function && parenTriggerOn) {
    compItem.commitCharacters = ['('];
  }

  return compItem;
};

const arraysMatch = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every(v => arr2.indexOf(v) >= 0);
};

/**
 * Implements LRU eviction when cache exceeds MAX_CACHE_SIZE
 * @param {Map} cache The cache map to manage
 */
const enforceCacheLimit = cache => {
  if (cache.size > MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
};

/**
 * Retrieves include completions for a document, using cache when possible
 * @param {import('vscode').TextDocument} document The document to get include completions for
 * @param {Array<string>} includesCheck Array of include file names
 * @returns {CompletionItem[]} Array of completion items from includes
 */
const getIncludeCompletions = (document, includesCheck) => {
  const docUri = document.uri.toString();
  const cached = includeCache.get(docUri);

  // Return cached completions if includes haven't changed
  if (cached && arraysMatch(includesCheck, cached.files)) {
    // Move to end for LRU (refresh access time)
    includeCache.delete(docUri);
    includeCache.set(docUri, cached);
    return cached.completions;
  }

  // Build new completions
  const includeCompletionItems = [];
  includesCheck.forEach(include => {
    const includeFunctions = getIncludeData(include, document);
    if (includeFunctions) {
      Object.keys(includeFunctions).forEach(newFunc => {
        includeCompletionItems.push(
          createNewCompletionItem(CompletionItemKind.Function, newFunc, `Function from ${include}`),
        );
      });
    }
  });

  // Update cache with new completions
  includeCache.set(docUri, { files: includesCheck, completions: includeCompletionItems });
  enforceCacheLimit(includeCache);

  return includeCompletionItems;
};

/**
 * Generates function completions from files included through library paths
 * @param {Array<String>} libraryIncludes Array containing filenames of library includes
 * @param {import('vscode').TextDocument} doc Originating text document
 * @returns {CompletionItem[]} Array of completionItem objects
 */
const getLibraryFunctions = (libraryIncludes, doc) => {
  return libraryIncludes
    .flatMap(file => {
      const fullPath = findFilepath(file);
      return fullPath && typeof fullPath === 'string'
        ? Object.keys(getIncludeData(fullPath, doc)).map(newFunc => {
            return { file, newFunc };
          })
        : [];
    })
    .map(({ file, newFunc }) => {
      return createNewCompletionItem(CompletionItemKind.Function, newFunc, `Function from ${file}`);
    });
};

/**
 * Collects the filenames of library includes, filtering out
 * ones that are already default AutoIt UDFs
 * @param {string} docText The contents of the document
 * @returns {Array<string>} Array of library includes
 */
const getLibraryIncludes = docText => {
  const items = [];
  let pattern = libraryIncludePattern.exec(docText);
  while (pattern) {
    const filename = pattern[1].replace('.au3', '');
    if (DEFAULT_UDFS.indexOf(filename) === -1) {
      items.push(pattern[1]);
    }

    pattern = libraryIncludePattern.exec(docText);
  }

  return items;
};

/**
 * Creates an array of completion items for AutoIt variables from the document.
 * @param {String} text Content of the document
 * @param {String} firstChar The first character of the text considered for a completion
 * @returns {Array<Object>} Array of CompletionItem objects
 */
const getVariableCompletions = (text, firstChar) => {
  const variables = [];
  const foundVariables = {};
  let variableName;

  if (firstChar === '$') {
    let pattern = variablePattern.exec(text);
    while (pattern) {
      [, variableName] = pattern;
      if (variableName !== undefined && !(variableName in foundVariables)) {
        foundVariables[variableName] = true;
        variables.push(createNewCompletionItem(CompletionItemKind.Variable, variableName));
      }
      pattern = variablePattern.exec(text);
    }
  }

  return variables;
};

/**
 * Creates an array of CompletionItems for Functions declared in the document
 * @param {String} text Content of the document
 * @returns {Array<Object>} Array of CompletionItem objects
 */
const getLocalFunctionCompletions = text => {
  const functions = [];
  const foundFunctions = {};

  let pattern = functionPattern.exec(text);
  while (pattern) {
    const { 1: functionName } = pattern;
    if (!(functionName in foundFunctions)) {
      foundFunctions[functionName] = true;
      functions.push(createNewCompletionItem(CompletionItemKind.Function, functionName));
    }
    pattern = functionPattern.exec(text);
  }

  return functions;
};

const provideCompletionItems = (document, position) => {
  // Gather the functions created by the user

  const text = document.getText();
  let range = document.getWordRangeAtPosition(position);
  const prefix = range ? document.getText(range)[0] : '';
  const includesCheck = [];

  if (!range) {
    range = new Range(position, position);
  }

  // Remove completion offerings from commented lines
  const line = document.lineAt(position.line);
  const firstChar = line.text.charAt(line.firstNonWhitespaceCharacterIndex);
  if (firstChar === ';' || _functionPattern.test(line.text)) return null;

  const variableCompletions = getVariableCompletions(text, prefix);
  const functionCompletions = getLocalFunctionCompletions(text);

  const localCompletions = [...variableCompletions, ...functionCompletions];

  // Collect the includes of the document
  let pattern = includePattern.exec(text);
  while (pattern) {
    includesCheck.push(pattern[1]);
    pattern = includePattern.exec(text);
  }

  // Get cached or build new include completions
  const includeCompletions = getIncludeCompletions(document, includesCheck);

  const libraryIncludes = getLibraryIncludes(text);
  const libraryCompletions = getLibraryFunctions(libraryIncludes, document);

  return [...completions, ...localCompletions, ...includeCompletions, ...libraryCompletions];
};

const completionFeature = languages.registerCompletionItemProvider(
  AUTOIT_MODE,
  { provideCompletionItems },
  '.',
  '$',
  '#',
);

export default completionFeature;
