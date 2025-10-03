import { Location, Range, SymbolInformation, SymbolKind, languages, workspace } from 'vscode';
import {
  AI_CONSTANTS,
  AUTOIT_MODE,
  functionPattern,
  isSkippableLine,
  regionPattern,
  variablePattern,
} from './util';

const config = workspace.getConfiguration('autoit');
const commentEndRegex = /^\s*#(?:ce|comments-end)/;
const commentStartRegex = /^\s*#(?:cs|comments-start)/;
const continuationRegex = /\s_\b\s*(;.*)?\s*/;

/**
 * Creates a symbol information object for a variable.
 *
 * @param {Object} params - The input parameters.
 * @param {string} params.variable - The name of the variable.
 * @param {SymbolKind} params.variableKind - The kind of the variable symbol.
 * @param {TextDocument} params.doc - The document where the variable is defined.
 * @param {Range} params.line - The range of the line where the variable is defined.
 * @param {string} [params.container=null] - The name of the container where the variable is defined.
 * @returns {SymbolInformation} The symbol information object for the variable.
 */
const createVariableSymbol = ({ variable, variableKind, doc, line, container = null }) => {
  return new SymbolInformation(
    variable,
    variableKind,
    container,
    new Location(doc.uri, line.range),
  );
};

/**
 * Generates a SymbolInformation object for a function from a given TextDocument
 * that includes the full range of the function's body
 * @param {String} functionName The name of the function from the AutoIt script
 * @param {TextDocument} document The current document to search
 * @param {Number} startingLineNumber The function's starting line number within the document
 * @returns {SymbolInformation} The generated SymbolInformation object
 */
const generateFunctionSymbol = (functionName, document, text, startingLineNumber, scriptText) => {
  const functionBodyPattern = new RegExp(
    `[\t ]*(?:volatile[\t ]+)?Func[\t ]+\\b${functionName}+\\b.*?EndFunc`,
    'si',
  );

  // Set the starting position for the regex search
  const functionStartIndex = document.offsetAt(document.lineAt(startingLineNumber).range.start);
  functionBodyPattern.lastIndex = functionStartIndex;
  const matchResult = functionBodyPattern.exec(scriptText);
  if (!matchResult) {
    return null;
  }
  const functionEndIndex = matchResult.index + matchResult[0].length;
  const functionStartPos = document.positionAt(matchResult.index);
  const functionEndPos = document.positionAt(functionEndIndex);
  const functionBodyRange = new Range(functionStartPos, functionEndPos);
  const functionSymbol = new SymbolInformation(
    functionName,
    SymbolKind.Function,
    '',
    new Location(document.uri, functionBodyRange),
  );

  return functionSymbol;
};

/**
 * Find the end index of a region in a document.
 * @param {string} documentText - The text of the document.
 * @param {number} startIndex - The starting index of the region.
 * @returns {number} - The end index of the region.
 */
const findRegionEndIndex = (documentText, startIndex) => {
  const regionDelimiterPattern = /#(Region|EndRegion)(?:\s|$)/g;
  let nestingLevel = 1;
  regionDelimiterPattern.lastIndex = startIndex;

  let match;
  for (
    match = regionDelimiterPattern.exec(documentText);
    match !== null;
    match = regionDelimiterPattern.exec(documentText)
  ) {
    if (match[1] === 'Region') {
      // Increase nesting level when entering a new region
      nestingLevel++;
    } else {
      // Decrease nesting level when exiting a region
      nestingLevel--;
      if (nestingLevel === 0) {
        // If we're back to the original nesting level, we've found our EndRegion
        return match.index;
      }
    }
  }

  return documentText.length;
};

/**
 * Generates a SymbolInformation object for a Region from a given TextDocument
 * that includes the full range of the region's body
 * @param {String} regionName The name of the region from the AutoIt script
 * @param {TextDocument} document The current document to search
 * @param {String} documentText The text from the document (usually generated through `TextDocument.getText()`)
 * @returns SymbolInformation
 */
const createRegionSymbol = (regionName, document, documentText) => {
  const startMatch = new RegExp(
    `#Region\\s[- ]{0,}(${regionName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`,
    's',
  ).exec(documentText);
  if (!startMatch) return null;

  const startIndex = startMatch.index + startMatch[0].length;
  const endIndex = findRegionEndIndex(documentText, startIndex);

  const startPosition = document.positionAt(startMatch.index);
  const endPosition = document.positionAt(endIndex + '#EndRegion'.length);
  const regionSymbol = new SymbolInformation(
    startMatch[1],
    SymbolKind.Namespace,
    '',
    new Location(document.uri, new Range(startPosition, endPosition)),
  );

  return regionSymbol;
};

/**
 * Extracts function symbols from a given text and adds them to a result array.
 *
 * @param {Object} params - An object containing the following properties:
 *   @param {string} params.text - The text to search for function symbols.
 *   @param {Set} params.processedSymbols - A set of already processed function symbols.
 *   @param {vscode.TextDocument} params.doc - The document object representing the text.
 *   @param {number} params.lineNum - The line number where the function symbol is located.
 *   @param {Array} params.result - An array to store the extracted function symbols.
 * @returns {void} None. The extracted function symbols are added to the `result` array provided in the `params` object.
 */
const parseFunctionFromText = params => {
  const { text, processedSymbols, doc, lineNum, result, scriptText } = params;

  const funcName = text.match(functionPattern);
  if (!funcName || processedSymbols.has(funcName[1])) return;

  const functionSymbol = generateFunctionSymbol(funcName[1], doc, text, lineNum, scriptText);
  if (!functionSymbol) return;

  result.push(functionSymbol);
  processedSymbols.add(funcName[1]);
};

/**
 * Parses the region from the given text and adds it to the result array and found set.
 *
 * @param {Object} params - An object containing the parameters.
 * @param {Array} params.regionName - An array containing the matched region name from the text.
 * @param {Set} params.found - A set containing the already found region names.
 * @param {Object} params.doc - The document object.
 * @param {Array} params.result - An array to store the symbol information objects.
 * @returns {void} This function does not return anything.
 */
const parseRegionFromText = params => {
  if (!config.showRegionsInGoToSymbol) return;

  const { regionName, found, doc, result } = params;
  if (!regionName || found.has(regionName[0])) return;

  const regionSymbol = createRegionSymbol(regionName[1], doc, doc.getText());
  if (!regionSymbol) return;
  result.push(regionSymbol);
  found.add(regionName[0]);
};

const delims = ["'", '"', ';'];

/**
 * Finds the variable container for a given line.
 * @param {Array} result - An array of symbols to search through.
 * @param {Object} line - The line to find the variable container for.
 * @returns {Object} The variable container or an empty object if not found.
 */
function findContainerForVariable(result, line) {
  return (
    result.find(
      symbolToTest =>
        symbolToTest.location.range.contains(line.range) &&
        symbolToTest.kind === SymbolKind.Function,
    ) || {}
  );
}

/**
 * Check whether a variable with the specified name and container is present in the given array of symbols.
 *
 * @param {Array} result - The array of symbols to search for the variable.
 * @param {string} variable - The name of the variable to search for.
 * @param {Object} container - The container object that the variable is expected to be found in.
 * @returns {boolean} `true` if the variable is found in the symbols array, `false` otherwise.
 */
const isVariableInResults = (result, variable, container) => {
  return !!result.find(
    symbol => symbol.name === variable && symbol.containerName === container.name,
  );
};

const variableRegex = /^\s*?(Local|Global)?\s*?(Const|Enum)/;

/**
 * Determines the kind of variable based on the text and inContinuation flag.
 * @param {string} text - The text to be matched against the variableRegex.
 * @returns {SymbolKind} The kind of variable determined by the function.
 */
function getVariableKind(text) {
  const [, , kind] = text.match(variableRegex) || [];

  switch (kind) {
    case 'Const':
      return SymbolKind.Constant;
    case 'Enum':
      return SymbolKind.Enum;
    default:
      return SymbolKind.Variable;
  }
}

/**
 * Determines whether a variable should be skipped or not based on certain conditions.
 *
 * @param {string} variable - The variable to check.
 * @returns {boolean} - A boolean value indicating whether the variable should be skipped or not.
 *
 * @example
 * const variable = 'someVariable';
 * const shouldSkip = shouldSkipVariable(variable);
 * console.log(shouldSkip); // true or false
 */
function shouldSkipVariable(variable) {
  return AI_CONSTANTS.includes(variable) || delims.includes(variable.charAt(0));
}

function addVariableToResults(result, variable, variableKind, doc, line, container) {
  result.push(
    createVariableSymbol({
      variable,
      variableKind,
      doc,
      line,
      container: container.name,
    }),
  );
}

/**
 * Extracts variables from a given text and adds them to a result array.
 * Determines the kind of variable and checks if it already exists in the result array.
 * @param {object} params - An object containing the following properties:
 *   @param {string} params.text - The text to parse for variables.
 *   @param {array} params.result - An array to store the extracted variables.
 *   @param {number} params.line - The line number of the text.
 *   @param {Set} params.found - A set to keep track of already found variables.
 *   @param {string} params.doc - The documentation for the variables.
 *   @param {boolean} params.inContinuation - Indicates if the text is a continuation of a previous line.
 *   @param {string} params.variableKind - The kind of variable (e.g., local, global).
 * @returns {object} An object containing the following properties:
 *   @returns {boolean} inContinuation - Indicates if the text is a continuation of a previous line.
 *   @returns {string} variableKind - The kind of variable (e.g., local, global).
 *   @returns {array} params.result - The updated array of extracted variables.
 *   @returns {Set} params.found - The set of found variables.
 */
function parseVariablesFromText(params) {
  const { text, result, line, found, doc } = params;
  let { inContinuation, variableKind } = params;

  if (!config.showVariablesInGoToSymbol) return { inContinuation, variableKind };

  const variables = text.match(variablePattern);
  if (!variables) return { inContinuation, variableKind };

  variableKind = inContinuation ? variableKind : getVariableKind(text);

  inContinuation = continuationRegex.test(text);

  for (let i = 0; i < variables.length; i += 1) {
    const variable = variables[i];

    if (shouldSkipVariable(variable)) {
      continue;
    }

    const container = findContainerForVariable(result, line);

    if (isVariableInResults(result, variable, container)) {
      continue;
    }

    addVariableToResults(result, variable, variableKind, doc, line, container);
    found.add(variable);
  }

  return { inContinuation, variableKind };
}

/**
 * Provides the document symbols for a given document.
 * It parses the text of the document line by line and extracts information about functions, variables, and regions.
 * Returns an array of symbol information objects.
 *
 * @param {Document} doc - The document for which to provide symbols.
 * @returns {Array} An array of symbol information objects, each containing the name, kind, and range of a symbol in the document.
 */
function provideDocumentSymbols(doc) {
  const result = [];
  const processedSymbols = new Set();
  let inComment = false;
  let inContinuation = false;
  let variableKind;
  const scriptText = doc.getText();

  const lineCount = Math.min(doc.lineCount, 10000);
  for (let lineNum = 0; lineNum < lineCount; lineNum += 1) {
    const line = doc.lineAt(lineNum);
    const lineText = line.text;
    const regionName = lineText.match(regionPattern);

    if (!isSkippableLine(line) || regionName) {
      if (!inComment) {
        parseFunctionFromText({
          text: lineText,
          processedSymbols,
          doc,
          lineNum,
          result,
          scriptText,
        });

        ({ inContinuation, variableKind } = parseVariablesFromText({
          inContinuation,
          text: lineText,
          found: processedSymbols,
          doc,
          result,
          line,
          variableKind,
        }));

        parseRegionFromText({ regionName, found: processedSymbols, doc, result });
      }
    }

    if (commentEndRegex.test(lineText)) {
      inComment = false;
    }

    if (commentStartRegex.test(lineText)) {
      inComment = true;
    }
  }

  return result;
}

export default languages.registerDocumentSymbolProvider(AUTOIT_MODE, { provideDocumentSymbols });
export { provideDocumentSymbols };
