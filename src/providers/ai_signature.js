import {
  Hover,
  MarkdownString,
  ParameterInformation,
  SignatureHelp,
  SignatureInformation,
  languages,
} from 'vscode';
import { AUTOIT_MODE } from '../utils/coreConstants';
import { buildFunctionSignature, getIncludeData } from '../utils/functionSignature';
import { REGEX_PATTERNS } from '../utils/regexPatterns';

const { functionDefinitionRegex, includePattern, libraryIncludePattern } = REGEX_PATTERNS;
import aiConfig from './ai_config';
import defaultSigs from '../signatures';
import { DEFAULT_UDFS } from '../constants';

const { findFilepath } = aiConfig;

const documentSignatureCache = new Map();
const FUNCTION_NAME_PART_INDEX_FROM_END = 2;

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

  const currentFunctionPartIndex = functionCallParts.length - FUNCTION_NAME_PART_INDEX_FROM_END;
  const functionCallPart = functionCallParts[currentFunctionPartIndex].match(/(.*)\b(\w+)/);
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
 * Parses the signatures of all functions provided by the given includes.
 *
 * @param {string[]} includesCheck - Include scripts referenced with `#include "..."`.
 * @param {string[]} libraryIncludes - Include file names referenced with `#include <...>`.
 * @param {import("vscode").TextDocument} doc - The document the includes belong to.
 * @returns {Object} An object containing the signatures found in the included files.
 */
function parseIncludedFunctionSignatures(includesCheck, libraryIncludes, doc) {
  const includes = {};

  includesCheck.forEach(script => {
    Object.assign(includes, getIncludeData(script, doc));
  });

  libraryIncludes.forEach(fileName => {
    if (DEFAULT_UDFS.indexOf(fileName.replace('.au3', '')) === -1) {
      const fullPath = findFilepath(fileName);
      if (typeof fullPath === 'string') {
        Object.assign(includes, getIncludeData(fullPath, doc));
      }
    }
  });

  return includes;
}

/**
 * Returns an object of AutoIt functions found within the given AutoIt script text
 * @param {string} text The full text of the AutoIt script
 * @param {string} fileName The name of the file the text belongs to
 * @returns {Object} Object containing SignatureInformation objects
 */
function parseLocalFunctionSignatures(text, fileName) {
  const functions = {};

  functionDefinitionRegex.lastIndex = 0;
  let functionMatch = functionDefinitionRegex.exec(text);
  while (functionMatch) {
    const functionData = buildFunctionSignature(functionMatch, text, fileName);
    functions[functionData.functionName] = functionData.functionObject;
    functionMatch = functionDefinitionRegex.exec(text);
  }

  return functions;
}

/**
 * Retrieves all function signatures (included and local) available to the given document.
 * Results are cached per document and reused while the document version is unchanged.
 * On edits, include data is reused as long as the document's include list is unchanged,
 * so only local functions are re-parsed.
 *
 * @param {import("vscode").TextDocument} doc - The document to collect signatures for.
 * @returns {Object} An object containing all signatures available to the document.
 */
function getDocumentSignatures(doc) {
  const cacheKey = doc.uri ? doc.uri.toString() : doc.fileName;
  const cached = documentSignatureCache.get(cacheKey);
  if (cached && cached.version === doc.version) {
    return cached.signatures;
  }

  const text = doc.getText();
  const includesCheck = getIncludesFromText(text);
  const libraryIncludes = getLibraryIncludesFromText(text).map(pattern => pattern[1]);
  const includeKey = JSON.stringify([includesCheck, libraryIncludes]);

  const includes =
    cached && cached.includeKey === includeKey
      ? cached.includes
      : parseIncludedFunctionSignatures(includesCheck, libraryIncludes, doc);

  const signatures = {
    ...includes,
    ...parseLocalFunctionSignatures(text, doc.fileName),
  };

  documentSignatureCache.set(cacheKey, {
    version: doc.version,
    includeKey,
    includes,
    signatures,
  });

  return signatures;
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

    const matchedSignature = getDocumentSignatures(document)[hoveredWord];

    if (!matchedSignature || !matchedSignature.label) return null;

    const description = matchedSignature.description || '';
    // documentation format: "Included from X" or "description\rIncluded from X"
    const includedFrom = matchedSignature.documentation.split('\r').at(-1) || '';
    const hoverText = [
      ...(description ? [description] : []),
      `##### ${includedFrom}`,
      `\`\`\`\r${matchedSignature.label}\r\`\`\``,
    ];

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
        ...getDocumentSignatures(document),
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
