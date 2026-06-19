import { handleError, safeExecute } from '../errorUtils';
import { splitTopLevel } from './functionSignatureParsing';
import { REGEX_PATTERNS } from './regexPatterns';
import { validateString, isValidDocument, safeFileExists, getIncludeText } from './fsCache';
import { getIncludePath } from './includeResolution';
import aiConfig from '../providers/ai_config';

const { findFilepath } = aiConfig;

const MIN_FUNCTION_MATCH_PARTS = 4;

/**
 * Extracts parameter documentation from AutoIt function header comments using regex matching.
 * Searches for parameter documentation in the format "; $paramName - description" within
 * function header comments. Used to build comprehensive function signatures with parameter help.
 *
 * @param {string} text - Complete source code text containing the function and its documentation
 * @param {string} paramEntry - Name of the parameter to find documentation for (without $ prefix)
 * @param {number} headerIndex - Starting index in text where the function header comment begins
 * @returns {string} Documentation text for the parameter, or empty string if not found
 */
const extractParamDocumentation = (text, paramEntry, headerIndex) => {
  if (typeof text !== 'string' || typeof paramEntry !== 'string' || headerIndex === -1) {
    return '';
  }

  return safeExecute(
    () => {
      const headerSubstring = text.substring(headerIndex);
      const paramRegex = REGEX_PATTERNS.parameterDoc(paramEntry);

      const match = paramRegex.exec(headerSubstring);
      return match?.groups?.documentation || '';
    },
    '',
    'extractParamDocumentation',
  );
};

/**
 * Parses AutoIt function parameter definitions and extracts documentation for each parameter.
 * Handles parameter lists with default values, ByRef parameters, and comma separation.
 * Attempts to find documentation for each parameter from function header comments.
 *
 * @param {string} paramText - Raw parameter list text from function definition (e.g., "$param1, $param2 = 0")
 * @param {string} text - Complete source file content containing parameter documentation
 * @param {number} headerIndex - Index where function header documentation begins in the text
 * @returns {Object} Object where keys are parameter names and values are parameter info objects with label and documentation
 */
export const getParams = (paramText, text, headerIndex) => {
  const params = {};

  if (!validateString(paramText) || typeof text !== 'string') {
    return params;
  }

  const paramList = splitTopLevel(paramText, ',')
    .map(param => param.trim())
    .filter(param => param.length > 0);

  paramList.forEach(param => {
    const paramEntry = splitTopLevel(param, '=')[0]
      .trim()
      .replace(/^ByRef\s*/, '');

    if (paramEntry) {
      const paramDoc = extractParamDocumentation(text, paramEntry, headerIndex);

      params[paramEntry] = {
        label: paramEntry,
        documentation: paramDoc,
      };
    }
  });

  return params;
};

/**
 * Constructs a complete function signature object from regex match results, including parameter
 * information and documentation extracted from header comments. Builds the data structure used
 * by VSCode's signature help provider to display function information during typing.
 *
 * @param {RegExpExecArray} functionMatch - Regex match result containing function definition parts [full_match, label, name, params]
 * @param {string} fileText - Complete content of the source file containing the function
 * @param {string} fileName - Name of the file containing the function (used in documentation)
 * @returns {Object} Object with functionName (string) and functionObject (signature data with label, description, documentation, params)
 */
export const buildFunctionSignature = (functionMatch, fileText, fileName) => {
  if (
    !functionMatch ||
    !Array.isArray(functionMatch) ||
    functionMatch.length < MIN_FUNCTION_MATCH_PARTS
  ) {
    handleError('buildFunctionSignature', 'Invalid function match', false, { functionMatch });
    return { functionName: '', functionObject: {} };
  }

  const [, functionLabel, functionName, paramsText] = functionMatch;

  if (!validateString(functionName)) {
    return { functionName: '', functionObject: {} };
  }

  let description = '';
  let functionIndex = -1;

  safeExecute(
    () => {
      const headerRegex = REGEX_PATTERNS.headerRegex(functionName);
      const headerMatch = fileText.match(headerRegex);
      description = headerMatch?.groups?.description || '';
      functionIndex = headerMatch?.index ?? -1;

      // Fallback: collect consecutive ; comment lines immediately above the Func declaration.
      // Only applies when there is no structured header block at all (functionIndex === -1),
      // so an intentionally-empty Description in a header is not overridden.
      if (!description && functionIndex === -1 && functionMatch.index !== undefined) {
        const rawLines = fileText.slice(0, functionMatch.index).split(/\r?\n/);
        // Drop the trailing empty string that results when the slice ends with a newline.
        while (rawLines.length && rawLines[rawLines.length - 1].trim() === '') rawLines.pop();
        const lines = rawLines;
        const commentLines = [];
        for (let i = lines.length - 1; i >= 0; i--) {
          const trimmed = lines[i].trim();
          if (!trimmed) break;
          const m = trimmed.match(/^;[ \t]*(.*)/);
          if (m) {
            commentLines.unshift(m[1].trim());
          } else {
            break;
          }
        }
        // '\n\n' is intentional: VSCode MarkdownString renders double-newline as a visible paragraph break
        description = commentLines.join('\n\n').trim();
      }
      return null;
    },
    null,
    'buildFunctionSignature header parsing',
  );

  const functionDocumentation = `${description ? `${description}\r` : ''}Included from ${fileName || 'unknown'}`;

  return {
    functionName,
    functionObject: {
      label: functionLabel || functionName,
      description,
      documentation: functionDocumentation,
      params: getParams(paramsText || '', fileText, functionIndex),
    },
  };
};

/**
 * Processes an AutoIt include file to extract all function definitions and build signature objects
 * for IntelliSense and hover information. Resolves the include file path, reads its contents,
 * and parses all function definitions to create comprehensive signature data with parameter
 * information and documentation.
 *
 * @param {string} fileName - Name or path of the include file to process (e.g., "Array.au3" or "<WinAPI.au3>")
 * @param {import('vscode').TextDocument} doc - Current VSCode document used for resolving relative include paths
 * @returns {Object} Object where keys are function names and values are complete signature objects with documentation and parameters
 */
export const getIncludeData = (fileName, doc) => {
  const functions = {};

  if (!validateString(fileName) || !isValidDocument(doc)) {
    return functions;
  }

  let filePath = getIncludePath(fileName, doc);

  // Fallback path resolution
  if (!safeFileExists(filePath)) {
    const foundPath = safeExecute(
      () => findFilepath(fileName, false),
      null,
      `Include data path resolution for ${fileName}`,
    );

    if (foundPath && typeof foundPath === 'string') {
      filePath = foundPath;
    }
  }

  const fileData = getIncludeText(filePath);
  if (!fileData) return functions;

  // Reset regex state for global matching
  REGEX_PATTERNS.functionDefinitionRegex.lastIndex = 0;

  let functionMatch;
  while ((functionMatch = REGEX_PATTERNS.functionDefinitionRegex.exec(fileData)) !== null) {
    const functionData = buildFunctionSignature(functionMatch, fileData, fileName);
    if (functionData.functionName) {
      functions[functionData.functionName] = functionData.functionObject;
    }
  }

  return functions;
};
