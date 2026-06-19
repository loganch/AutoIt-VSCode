import {
  DocumentSymbol,
  Location,
  Range,
  SymbolInformation,
  SymbolKind,
  languages,
  window,
  workspace,
} from 'vscode';
import {
  AI_CONSTANTS,
  AUTOIT_MODE,
  functionPattern,
  isSkippableLine,
  regionPattern,
  variablePattern,
} from '../util';
import { rangeContainsRange as sharedRangeContainsRange } from '../utils/textUtils';
import { DEFAULT_MAX_INCLUDE_DEPTH } from '../constants';
import MapTrackingService from '../services/MapTrackingService.js';
const commentEndRegex = /^\s*#(?:ce|comments-end)/;
const commentStartRegex = /^\s*#(?:cs|comments-start)/;
const continuationRegex = /\s_\b\s*(;.*)?\s*/;

// Default maximum number of lines to process for symbol indexing (performance limit)
const DEFAULT_SYMBOL_MAX_LINES = 50000;

// Track which files have been warned about to avoid repeated warnings
const warnedFiles = new Set();

// Lazily created singleton; output channels are never disposed, so creating
// one per error would leak channels
let errorOutputChannel;
const getErrorOutputChannel = () => {
  if (!errorOutputChannel) {
    errorOutputChannel = window.createOutputChannel('AutoIt');
  }
  return errorOutputChannel;
};

/**
 * Creates a symbol information object for a variable.
 *
 * @param {Object} params - The input parameters.
 * @param {string} params.variable - The name of the variable.
 * @param {SymbolKind} params.variableKind - The kind of the variable symbol.
 * @param {import("vscode").TextDocument} params.doc - The document where the variable is defined.
 * @param {import("vscode").TextLine} params.line - The line where the variable is defined.
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
 * @param {import("vscode").TextDocument} document The current document to search
 * @param {Number} startingLineNumber The function's starting line number within the document
 * @returns {SymbolInformation} The generated SymbolInformation object
 */
const generateFunctionSymbol = (functionName, document, text, startingLineNumber, scriptText) => {
  // The g flag is required for lastIndex to be honored when searching from the
  // function's starting offset
  const functionBodyPattern = new RegExp(
    `[\t ]*(?:volatile[\t ]+)?Func[\t ]+\\b${functionName}\\b.*?EndFunc`,
    'gsi',
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
 * @param {import("vscode").TextDocument} document The current document to search
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
 *   @param {import("vscode").TextDocument} params.doc - The document object representing the text.
 *   @param {number} params.lineNum - The line number where the function symbol is located.
 *   @param {Array} params.result - An array to store the extracted function symbols.
 *   @param {string} params.scriptText - The full text of the script.
 * @returns {SymbolInformation|null} The extracted function symbol (also added to the `result` array), or null if none was found.
 */
const parseFunctionFromText = params => {
  const { text, processedSymbols, doc, lineNum, result, scriptText } = params;

  const funcName = text.match(functionPattern);
  if (!funcName || processedSymbols.has(funcName[1])) return null;

  const functionSymbol = generateFunctionSymbol(funcName[1], doc, text, lineNum, scriptText);
  if (!functionSymbol) return null;

  result.push(functionSymbol);
  processedSymbols.add(funcName[1]);
  return functionSymbol;
};

/**
 * Parses the region from the given text and adds it to the result array and found set.
 *
 * @param {Object} params - An object containing the parameters.
 * @param {Array} params.regionName - An array containing the matched region name from the text.
 * @param {Set} params.found - A set containing the already found region names.
 * @param {Object} params.doc - The document object.
 * @param {Array} params.result - An array to store the symbol information objects.
 * @param {string} params.scriptText - The full text of the script.
 * @param {import("vscode").WorkspaceConfiguration} params.config - The current AutoIt configuration.
 * @returns {void} This function does not return anything.
 */
const parseRegionFromText = params => {
  const { regionName, found, doc, result, scriptText, config } = params;
  if (!config.get('showRegionsInGoToSymbol', true)) return;

  if (!regionName || found.has(regionName[0])) return;

  const regionSymbol = createRegionSymbol(regionName[1], doc, scriptText);
  if (!regionSymbol) return;
  result.push(regionSymbol);
  found.add(regionName[0]);
};

const delims = ["'", '"', ';'];

const variableRegex = /^\s*?(Local|Global)?\s*?(Const|Enum)/;

function comparePositions(left, right) {
  if (left.line !== right.line) {
    return left.line - right.line;
  }

  return left.character - right.character;
}

function rangeContainsRange(outerRange, innerRange) {
  return sharedRangeContainsRange(outerRange, innerRange);
}

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
 * @param {string} lineText - The full line text to check for Map declarations.
 * @returns {boolean} - A boolean value indicating whether the variable should be skipped or not.
 *
 * @example
 * const variable = 'someVariable';
 * const shouldSkip = shouldSkipVariable(variable, line.text);
 * console.log(shouldSkip); // true or false
 */
function shouldSkipVariable(variable, lineText = '') {
  // Skip constants and delimiter-prefixed variables
  if (AI_CONSTANTS.includes(variable) || delims.includes(variable.charAt(0))) {
    return true;
  }

  const escapedVariable = variable.replace(/\$/g, '\\$');

  // Skip Map declarations (variables followed by [])
  // Pattern: Local/Global/Dim/Static $var[]
  const mapDeclPattern = new RegExp(
    `(Local|Global|Dim|Static)\\s+${escapedVariable}\\s*\\[\\s*\\]`,
    'i',
  );
  if (mapDeclPattern.test(lineText)) {
    return true;
  }

  // Skip Map member access so the parent Map variable is not duplicated as a
  // regular variable symbol.
  const mapDotAccessPattern = new RegExp(`${escapedVariable}\\s*\\.`, 'i');
  const mapBracketAccessPattern = new RegExp(`${escapedVariable}\\s*\\[(?:["'$])`, 'i');
  if (mapDotAccessPattern.test(lineText) || mapBracketAccessPattern.test(lineText)) {
    return true;
  }

  return false;
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
 *   @param {import("vscode").TextLine} params.line - The line object from the document.
 *   @param {Set} params.addedVariables - A set of `name::container` keys for variables already added.
 *   @param {import("vscode").TextDocument} params.doc - The document object.
 *   @param {boolean} params.inContinuation - Indicates if the text is a continuation of a previous line.
 *   @param {SymbolKind} params.variableKind - The kind of variable (e.g., local, global).
 *   @param {SymbolInformation} params.currentFunction - The most recently parsed function symbol, if any.
 *   @param {import("vscode").WorkspaceConfiguration} params.config - The current AutoIt configuration.
 * @returns {{inContinuation: boolean, variableKind: SymbolKind}} An object containing inContinuation (indicates if the text is a continuation) and variableKind (the kind of variable).
 */
function parseVariablesFromText(params) {
  const { text, result, line, addedVariables, doc, currentFunction, config } = params;
  let { inContinuation, variableKind } = params;

  if (!config.get('showVariablesInGoToSymbol', true)) {
    return { inContinuation, variableKind };
  }

  const variables = text.match(variablePattern);
  if (!variables) return { inContinuation, variableKind };

  variableKind = inContinuation ? variableKind : getVariableKind(text);

  inContinuation = continuationRegex.test(text);

  // Functions appear in source order and don't nest in AutoIt, so the most
  // recently parsed function is the only possible container for this line
  const container =
    currentFunction && rangeContainsRange(currentFunction.location.range, line.range)
      ? currentFunction
      : {};

  for (let i = 0; i < variables.length; i += 1) {
    const variable = variables[i];

    if (shouldSkipVariable(variable, text)) {
      continue;
    }

    const dedupKey = `${variable}::${container.name || ''}`;
    if (addedVariables.has(dedupKey)) {
      continue;
    }

    addVariableToResults(result, variable, variableKind, doc, line, container);
    addedVariables.add(dedupKey);
  }

  return { inContinuation, variableKind };
}

/**
 * Create DocumentSymbol array for Map keys (flat, single-level)
 * @param {import('vscode').TextDocument} doc - The document
 * @param {Array} keysArray - Array of key objects {key, line, isDynamic}
 * @param {string} containerName - Parent Map variable name
 * @returns {Array<import('vscode').DocumentSymbol>}
 */
function createKeySymbols(doc, keysArray, containerName) {
  const keySymbols = [];

  // Sort keys by line number (order of first appearance)
  const sortedKeys = keysArray.sort((a, b) => a.line - b.line);

  sortedKeys.forEach(keyInfo => {
    const { key, line, isDynamic } = keyInfo;

    // Format key display
    const displayKey = isDynamic ? `[${key}]` : `"${key}"`;

    // Find the key string in the source line
    const sourceLine = doc.lineAt(line);
    const lineText = sourceLine.text;

    // Find key position in line
    let keyStart = 0;
    let keyEnd = lineText.length;

    if (isDynamic) {
      // Dynamic key: find variable name
      const varMatch = lineText.indexOf(key);
      if (varMatch !== -1) {
        keyStart = varMatch;
        keyEnd = varMatch + key.length;
      }
    } else {
      // Static key: find quoted string or dot notation
      // Try to find the key in bracket notation first
      const quotedPattern = new RegExp(`["']${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`);
      const match = lineText.match(quotedPattern);
      if (match) {
        keyStart = lineText.indexOf(match[0]) + 1; // Skip opening quote
        keyEnd = keyStart + key.length;
      } else {
        // Try dot notation
        const dotPattern = new RegExp(`\\.${key}\\s*=`);
        const dotMatch = lineText.match(dotPattern);
        if (dotMatch) {
          const dotIndex = lineText.indexOf(dotMatch[0]);
          keyStart = dotIndex + 1; // Skip the dot
          keyEnd = keyStart + key.length;
        }
      }
    }

    const keyRange = new Range(line, keyStart, line, keyEnd);

    // Create key DocumentSymbol (flat, no children)
    const keySymbol = new DocumentSymbol(
      displayKey,
      containerName,
      SymbolKind.Key,
      keyRange,
      keyRange,
    );

    keySymbols.push(keySymbol);
  });

  return keySymbols;
}

/**
 * Create DocumentSymbol for Map variable with key children
 * @param {import('vscode').TextDocument} doc - The document
 * @param {object} mapDeclaration - Map declaration info from MapParser
 * @param {object} keysData - Flat keys from MapTrackingService
 * @param {object} parser - MapParser instance to get assignment details
 * @returns {import('vscode').DocumentSymbol}
 */
function createMapSymbols(doc, mapDeclaration, keysData, parser) {
  const { name, line } = mapDeclaration;

  // Create parent Map symbol
  const mapLine = doc.lineAt(line);
  const mapRange = mapLine.range;
  const mapSymbol = new DocumentSymbol(name, 'Map', SymbolKind.Variable, mapRange, mapRange);

  // Get all assignments to find line numbers
  const assignments = parser.parseKeyAssignments(name);
  const keyLineMap = new Map();
  assignments.forEach(assign => {
    keyLineMap.set(assign.key, { line: assign.line, isDynamic: assign.isDynamic });
  });

  // Combine direct keys and function keys into flat array with line numbers
  const allKeys = [];

  keysData.directKeys.forEach(key => {
    const info = keyLineMap.get(key);
    if (info) {
      allKeys.push({ key, line: info.line, isDynamic: info.isDynamic });
    }
  });

  keysData.functionKeys.forEach(fkey => {
    const info = keyLineMap.get(fkey.key);
    if (info) {
      allKeys.push({ key: fkey.key, line: info.line, isDynamic: info.isDynamic });
    }
  });

  // Add key children
  mapSymbol.children = createKeySymbols(doc, allKeys, name);

  return mapSymbol;
}

/**
 * Convert SymbolInformation array to DocumentSymbol array, rebuilding the
 * outline hierarchy from range containment.
 *
 * Functions and regions are emitted with an empty containerName, so nesting
 * cannot be derived from text alone. Instead we nest each symbol under the
 * innermost other symbol whose range contains it. This reproduces the tree
 * VSCode previously built automatically from the SymbolInformation ranges
 * (e.g. functions inside #Region blocks, variables inside functions, and
 * nested regions).
 *
 * @param {Array<SymbolInformation>} symbolInfoArray - Array of SymbolInformation
 * @returns {Array<DocumentSymbol>} Array of DocumentSymbol
 */
function convertToDocumentSymbols(symbolInfoArray) {
  const nodes = symbolInfoArray.map(({ name, kind, containerName, location }) => ({
    symbol: new DocumentSymbol(name, containerName || '', kind, location.range, location.range),
    range: location.range,
  }));

  // Order by start position; for equal starts, the wider range comes first so a
  // container is always processed before the symbols it contains.
  nodes.sort((a, b) => {
    const startCmp = comparePositions(a.range.start, b.range.start);
    if (startCmp !== 0) return startCmp;
    return comparePositions(b.range.end, a.range.end);
  });

  const documentSymbols = [];
  const stack = []; // ancestors of the current symbol, innermost last

  // A symbol only nests when its parent's range is strictly wider. Symbols that
  // share an identical range (e.g. several variables declared on one line, which
  // all carry the whole line's range) are siblings, not parent and child.
  const strictlyContains = (outer, inner) =>
    rangeContainsRange(outer, inner) && !rangeContainsRange(inner, outer);

  nodes.forEach(node => {
    // Drop ancestors that don't strictly contain the current symbol
    while (stack.length > 0 && !strictlyContains(stack[stack.length - 1].range, node.range)) {
      stack.pop();
    }

    if (stack.length > 0) {
      stack[stack.length - 1].symbol.children.push(node.symbol);
    } else {
      documentSymbols.push(node.symbol);
    }

    stack.push(node);
  });

  return documentSymbols;
}

/**
 * Add Map variable symbols to results
 * @param {import('vscode').TextDocument} doc - The document
 * @param {Array} result - Array to add symbols to
 */
async function addMapSymbols(doc, result) {
  try {
    // Get AutoIt configuration
    const autoitConfig = workspace.getConfiguration('autoit');
    const { workspaceFolders } = workspace;
    const workspaceRoot =
      workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : '';
    const includePaths = autoitConfig.get('includePaths', []);
    const includeDepth = autoitConfig.get('maps.includeDepth', DEFAULT_MAX_INCLUDE_DEPTH);

    // Get MapTrackingService instance
    const mapService = MapTrackingService.getInstance(workspaceRoot, includePaths, includeDepth);

    // Update file in service (immediate, not debounced for document symbols)
    const filePath = doc.uri.fsPath;
    const source = doc.getText();
    mapService.updateFileImmediate(filePath, source);

    // Get Map declarations from the current file's parser
    const parser = mapService.fileParsers.get(filePath);
    if (!parser) return;

    const mapDeclarations = parser.parseMapDeclarations();

    // Create symbols for each Map
    for (const mapDecl of mapDeclarations) {
      const keysData = await mapService.getKeysForMapWithIncludes(filePath, mapDecl.name, Infinity);

      const mapSymbol = createMapSymbols(doc, mapDecl, keysData, parser);
      result.push(mapSymbol);
    }
  } catch (error) {
    // Log error but don't break symbol generation
    console.error('[AutoIt] Error generating Map symbols:', error);

    // Log to output channel for debugging
    getErrorOutputChannel().appendLine(`Error generating Map symbols: ${error.message}`);
  }
}

/**
 * Provides the document symbols for a given document.
 * It parses the text of the document line by line and extracts information about functions, variables, and regions.
 * Returns an array of symbol information objects.
 *
 * @param {import("vscode").TextDocument} doc - The document for which to provide symbols.
 * @returns {Promise<Array>} A promise that resolves to an array of symbol information objects, each containing the name, kind, and range of a symbol in the document.
 */
async function provideDocumentSymbols(doc) {
  const result = [];
  const processedSymbols = new Set();
  const addedVariables = new Set();
  let inComment = false;
  let inContinuation = false;
  let variableKind;
  let currentFunction = null;
  const scriptText = doc.getText();

  // Read the configuration fresh on each invocation so setting changes take
  // effect without a window reload
  const currentConfig = workspace.getConfiguration('autoit');
  const maxLines = currentConfig.get('symbolMaxLines', DEFAULT_SYMBOL_MAX_LINES);
  const lineCount = Math.min(doc.lineCount, maxLines);

  // Warn user once per file if document exceeds the symbol processing limit
  if (doc.lineCount > maxLines && !warnedFiles.has(doc.uri.toString())) {
    warnedFiles.add(doc.uri.toString());
    window.showWarningMessage(
      `AutoIt: File has ${doc.lineCount} lines but only processing first ${maxLines} for symbols. Increase 'autoit.symbolMaxLines' to index more lines.`,
    );
  }

  for (let lineNum = 0; lineNum < lineCount; lineNum += 1) {
    const line = doc.lineAt(lineNum);
    const lineText = line.text;
    const regionName = lineText.match(regionPattern);

    if (!isSkippableLine(line) || regionName) {
      if (!inComment) {
        const functionSymbol = parseFunctionFromText({
          text: lineText,
          processedSymbols,
          doc,
          lineNum,
          result,
          scriptText,
        });
        if (functionSymbol) currentFunction = functionSymbol;

        ({ inContinuation, variableKind } = parseVariablesFromText({
          inContinuation,
          text: lineText,
          addedVariables,
          doc,
          result,
          line,
          variableKind,
          currentFunction,
          config: currentConfig,
        }));

        parseRegionFromText({
          regionName,
          found: processedSymbols,
          doc,
          result,
          scriptText,
          config: currentConfig,
        });
      }
    }

    if (commentEndRegex.test(lineText)) {
      inComment = false;
    }

    if (commentStartRegex.test(lineText)) {
      inComment = true;
    }
  }

  // Add Map symbols if Map intelligence is enabled
  const mapConfig = workspace.getConfiguration('autoit.maps');
  const enableMapIntelligence = mapConfig.get('enableIntelligence', true);

  if (enableMapIntelligence) {
    // When Map intelligence is enabled, convert all SymbolInformation to DocumentSymbol
    // to support hierarchical Map keys
    const documentSymbols = convertToDocumentSymbols(result);
    await addMapSymbols(doc, documentSymbols);
    return documentSymbols;
  }

  return result;
}

export default languages.registerDocumentSymbolProvider(AUTOIT_MODE, { provideDocumentSymbols });
export { provideDocumentSymbols };
