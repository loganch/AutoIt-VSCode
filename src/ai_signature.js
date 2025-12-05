import {
  Hover,
  MarkdownString,
  ParameterInformation,
  SignatureHelp,
  SignatureInformation,
  languages,
} from 'vscode';
import {
  AUTOIT_MODE,
  buildFunctionSignature,
  findFilepath,
  functionDefinitionRegex,
  getIncludeData,
  includePattern,
  libraryIncludePattern,
} from './util';
import defaultSigs from './signatures';
import { DEFAULT_UDFS } from './constants';

let currentIncludeFiles = [];
let includes = {};

/**
 * Reduces a partial line of code to the current Function for parsing
 * @param {string} code The line of code
 */
function getParsableCode(code) {
  const reducedCode = code
    .replace(/\w+\([^()]*\)/g, '')
    .replace(/"[^"]*"/g, '')
    .replace(/'[^']*'/g, '') // Remove double/single quote sets
    .replace(/"[^"]*(?=$)/g, '') // Remove double quote and text at end of line
    .replace(/'[^']*(?=$)/g, '') // Remove single quote and text at end of line
    .replace(/\([^()]*\)/g, '') // Remove paren sets
    .replace(/\({2,}/g, '('); // Reduce multiple open parens

  return reducedCode;
}

/**
 * Parses the current function calling for SignatureHelp from a string of AutoIt code.
 * Gets the second-to-last part (right before the last open parenthesis)
 * and extracts the function name
 *
 * @param {string} code - The AutoIt code to parse.
 * @returns {?string} - The name of the current function, or null if it couldn't be parsed.
 */
function getCurrentFunction(code) {
  const functionCallParts = code.split('(');
  if (functionCallParts.length <= 1) {
    return null;
  }

  const functionCallPart = functionCallParts[functionCallParts.length - 2].match(/(.*)\b(\w+)/);
  if (functionCallPart) {
    return functionCallPart[2];
  }

  return null;
}

function countCommas(code) {
  // Find the position of the closest/last open paren
  const openParen = code.lastIndexOf('(');
  // Count non-string commas in text following open paren
  let commas = code.slice(openParen).match(/(?!\B["'][^"']*),(?![^"']*['"]\B)/g);
  if (commas === null) {
    commas = 0;
  } else {
    commas = commas.length;
  }

  return commas;
}

function getCallInfo(doc, pos) {
  // Acquire the text up the point where the current cursor/paren/comma is at
  const codeAtPosition = doc.lineAt(pos.line).text.substring(0, pos.character);
  const cleanCode = getParsableCode(codeAtPosition);

  return {
    func: getCurrentFunction(cleanCode),
    commas: countCommas(cleanCode),
  };
}

function arraysMatch(arr1, arr2) {
  if (arr1.length === arr2.length && arr1.some(v => arr2.indexOf(v) <= 0)) {
    return true;
  }
  return false;
}

/**
 * Retrieves the includes from the given text.
 *
 * @param {string} text - The text to search for includes.
 * @returns {string[]} An array of includes found in the text.
 */
function getIncludesFromText(text) {
  const includesCheck = [];
  let pattern = includePattern.exec(text);
  while (pattern) {
    includesCheck.push(pattern[1]);
    pattern = includePattern.exec(text);
  }
  return includesCheck;
}

/**
 * Retrieves the library includes from the given text.
 *
 * @param {string} text - The text to search for library includes.
 * @returns {RegExpMatchArray[]} An array of library includes found in the text.
 */
function getLibraryIncludesFromText(text) {
  const libraryIncludes = [];
  let pattern = libraryIncludePattern.exec(text);
  while (pattern) {
    libraryIncludes.push(pattern);
    pattern = libraryIncludePattern.exec(text);
  }
  return libraryIncludes;
}

/**
 * Retrieves the includes and library includes from the given document.
 * Determines whether includes should be re-parsed or not.
 *
 * @param {Object} doc - The document to search for includes.
 * @returns {Object} An object containing the includes found in the document.
 */
function getIncludedFunctionSignatures(doc) {
  const text = doc.getText();
  const includesCheck = getIncludesFromText(text);
  const libraryIncludes = getLibraryIncludesFromText(text);

  if (!arraysMatch(includesCheck, currentIncludeFiles)) {
    includes = {};
    includesCheck.forEach(script => {
      const newIncludes = getIncludeData(script, doc);
      Object.assign(includes, newIncludes);
    });
    currentIncludeFiles = includesCheck;
  }

  libraryIncludes.forEach(pattern => {
    const filename = pattern[1].replace('.au3', '');
    if (DEFAULT_UDFS.indexOf(filename) === -1) {
      const fullPath = findFilepath(pattern[1]);
      if (fullPath) {
        const newData = getIncludeData(fullPath, doc);
        Object.assign(includes, newData);
      }
    }
  });

  return includes;
}

/**
 * Returns an object of AutoIt functions found within the current AutoIt script
 * @param {import("vscode").TextDocument} doc The TextDocument object representing the AutoIt script
 * @returns {Object} Object containing SignatureInformation objects
 */
function getLocalFunctionSignatures(doc) {
  const text = doc.getText();
  const functions = {};

  let functionMatch = functionDefinitionRegex.exec(text);
  while (functionMatch) {
    const functionData = buildFunctionSignature(functionMatch, text, doc.fileName);
    functions[functionData.functionName] = functionData.functionObject;
    functionMatch = functionDefinitionRegex.exec(text);
  }

  return functions;
}

/**
 * Creates a SignatureInformation object from a given signature.
 * @param {Object} foundSig - The signature to create the SignatureInformation object from.
 * @returns {SignatureInformation} The created SignatureInformation object.
 */
function createSignatureInfo(foundSig) {
  const signatureInfo = new SignatureInformation(
    foundSig.label,
    new MarkdownString(`##### ${foundSig.documentation}`),
  );
  signatureInfo.parameters = Object.keys(foundSig.params).map(
    key =>
      new ParameterInformation(
        foundSig.params[key].label,
        new MarkdownString(foundSig.params[key].documentation),
      ),
  );
  return signatureInfo;
}

/**
 * Creates a Hover object for the user created functions.
 *
 * @param {import("vscode").TextDocument} document - The TextDocument object representing the AutoIt script
 * @param {import("vscode").Position} position - The position of the cursor when the function was called * @returns {Hover | null} - A Hover object containing the hover info, or null if no info found.
 */
export const signatureHoverProvider = languages.registerHoverProvider(AUTOIT_MODE, {
  provideHover(document, position) {
    const hoveredPosition = document.getWordRangeAtPosition(position);
    if (!hoveredPosition) return null;
    const hoveredWord = document.getText(hoveredPosition);

    const allSignatures = {
      ...getIncludedFunctionSignatures(document),
      ...getLocalFunctionSignatures(document),
    };

    const matchedSignature = allSignatures[hoveredWord];

    if (!matchedSignature || !matchedSignature.label) return null;

    const documentationLines = matchedSignature.documentation.split('\r');
    documentationLines[1] = `##### ${documentationLines[1]}`;
    const hoverText = [...documentationLines, `\`\`\`\r${matchedSignature.label}\r\`\`\``];

    return new Hover(hoverText);
  },
});

export default languages.registerSignatureHelpProvider(
  AUTOIT_MODE,
  {
    /**
     * Provides signature help for a given document and position.
     * @param {import("vscode").TextDocument} document - The document to provide signature help for.
     * @param {import("vscode").Position} position - The position in the document to provide signature help for.
     */
    provideSignatureHelp(document, position) {
      const caller = getCallInfo(document, position);
      if (!caller.func) return null;

      const allSignatures = {
        ...defaultSigs,
        ...getIncludedFunctionSignatures(document),
        ...getLocalFunctionSignatures(document),
      };

      const matchedSignature = allSignatures[caller.func];
      if (!matchedSignature) return null;

      const result = new SignatureHelp();
      result.signatures = [createSignatureInfo(matchedSignature)];
      result.activeSignature = 0;
      result.activeParameter = caller.commas;
      return result;
    },
  },
  '(',
  ',',
);
