/// <reference types="vscode" />
import fs from 'fs';
import path from 'path';
import { CompletionItemKind, MarkdownString, window, workspace } from 'vscode';
import aiConfig from './ai_config';

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

const { findFilepath } = aiConfig;

// Markdown formatting constants
const descriptionHeader = '|Description |Value |\n|:---|:---:|\n';
const valueFirstHeader = '\n|&nbsp;|&nbsp;&nbsp;&nbsp; |&nbsp;\n|---:|:---:|:---|';
const trueFalseHeader = `\n|&nbsp;|&nbsp;&nbsp;&nbsp;|&nbsp;
    :---|:---:|:---`;
const opt = '**[optional]**';
const br = '\u0020\u0020';
const defaultZero = `${br + br}\`Default = 0\``;

// AutoIt specific constants
const AI_CONSTANTS = [
  '$MB_ICONERROR',
  '$MB_ICONINFORMATION',
  '$MB_YESNO',
  '$MB_TASKMODAL',
  '$IDYES',
  '$IDNO',
];

const AUTOIT_MODE = { language: 'autoit', scheme: 'file' };

// ============================================================================
// CACHED REGEX PATTERNS (Performance Optimization)
// ============================================================================

// Cached regex patterns to avoid recreation
const REGEX_PATTERNS = Object.freeze({
  includePattern: /^#include\s"(.+)"/gm,
  relativeInclude: /^\s*#include\s"(.+)"/gm,
  libraryInclude: /^\s*#include\s<(.+)>/gm,
  libraryIncludePattern: /^#include\s+<([\w.]+\.au3)>/gm,
  functionPattern: /^[\t ]*(?:volatile[\t ]+)?Func[\t ]+(\w+)[\t ]*\(/i,
  functionDefinitionRegex: /^[\t ]*(?:volatile[\t ]+)?Func[\t ]+((\w+)[\t ]*\((.*)\))/gim,
  variablePattern: /(?:["'].*?["'])|(?:;.*)|(\$\w+)/g,
  regionPattern: /^[\t ]{0,}#region\s[- ]{0,}(.+)/i,
  commentBlockStart: /^\s*#(cs|comments-start)/,
  commentBlockEnd: /^\s*#(ce|comments-end)/,
  hasAngleBrackets: /^<.+>$/,
  hasQuotes: /^".+"$/,
  windowsDriveLetter: /^[A-Z]:[\\/]/,
  parameterDoc: paramEntry =>
    new RegExp(`;\\s*(?:Parameters\\s*\\.+:)?\\s*(?:\\${paramEntry})\\s+-\\s(?<documentation>.+)`),
  headerRegex: functionName =>
    new RegExp(
      `;\\s*Name\\s*\\.+:\\s+${functionName}\\s*[\r\n]` +
        ';\\s+Description\\s*\\.+:\\s+(?<description>.+)[\r\n]',
    ),
});

// ============================================================================
// ERROR HANDLING AND LOGGING
// ============================================================================

/**
 * Centralized error handler for consistent logging and user feedback
 * @param {string} operation - The operation that failed
 * @param {Error|string} error - The error object or message
 * @param {boolean} [showUser=false] - Whether to show error to user
 * @param {any} [context] - Additional context for debugging
 */
const handleError = (operation, error, showUser = false, context = null) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const fullMessage = context
    ? `${operation}: ${errorMessage} (Context: ${JSON.stringify(context)})`
    : `${operation}: ${errorMessage}`;

  // Always log to console for debugging
  console.error(`[AutoIt Extension] ${fullMessage}`);

  // Optionally show to user (reduced verbosity)
  if (showUser) {
    window.showErrorMessage(`AutoIt: ${operation} failed`);
  }
};

/**
 * Safe wrapper for operations that might throw
 * @template T
 * @param {() => T} operation - Function to execute safely
 * @param {T} defaultValue - Default value on error
 * @param {string} operationName - Name for error logging
 * @returns {T} Result or default value
 */
const safeExecute = (operation, defaultValue, operationName) => {
  try {
    return operation();
  } catch (error) {
    handleError(operationName, error, false);
    return defaultValue;
  }
};

// ============================================================================
// INPUT VALIDATION UTILITIES
// ============================================================================

/**
 * Validates and normalizes string input
 * @param {any} value - Value to validate
 * @param {string} [defaultValue=''] - Default value if invalid
 * @returns {string} Validated string
 */
const validateString = (value, defaultValue = '') => {
  return typeof value === 'string' && value.length > 0 ? value.trim() : defaultValue;
};

/**
 * Validates file path input
 * @param {any} filePath - Path to validate
 * @returns {boolean} True if valid path
 */
const isValidFilePath = filePath => {
  return typeof filePath === 'string' && filePath.length > 0 && filePath.trim().length > 0;
};

/**
 * Validates VSCode document object
 * @param {any} document - Document to validate
 * @returns {boolean} True if valid document
 */
const isValidDocument = document => {
  return (
    document &&
    (document.uri?.fsPath || document.fileName) &&
    typeof document.getText === 'function'
  );
};

// ============================================================================
// FILE SYSTEM UTILITIES
// ============================================================================

/**
 * Module-level cache for include file contents
 * Key: normalized absolute path
 * Value: { mtimeMs: number, content: string }
 */
const includeCache = new Map();

/**
 * Safely check if file exists with proper error handling
 * @param {string} filePath - Path to check
 * @returns {boolean} True if file exists and is accessible
 */
const safeFileExists = filePath => {
  if (!isValidFilePath(filePath)) return false;

  return safeExecute(() => fs.existsSync(filePath), false, `File existence check for ${filePath}`);
};

/**
 * Safely read file with proper error handling and encoding
 * @param {string} filePath - Path to read
 * @param {'utf8'|'utf-8'|'ascii'|'latin1'|'base64'|'hex'} [encoding='utf8'] - File encoding
 * @returns {string} File contents or empty string
 */
const safeReadFile = (filePath, encoding = 'utf8') => {
  if (!isValidFilePath(filePath)) return '';

  return safeExecute(() => fs.readFileSync(filePath, encoding), '', `Read file ${filePath}`);
};

/**
 * Safely get file stats with proper error handling
 * @param {string} filePath - Path to stat
 * @returns {fs.Stats|null} File stats or null
 */
const safeFileStat = filePath => {
  if (!isValidFilePath(filePath)) return null;

  return safeExecute(() => fs.statSync(filePath), null, `File stat for ${filePath}`);
};

/**
 * Converts a file path to a normalized, absolute path format that works consistently across operating systems.
 * This function ensures paths can be used safely as Map/Set keys by standardizing path separators,
 * making relative paths absolute, and normalizing drive letter casing on Windows.
 *
 * @param {any} inputPath - The file path to normalize (string expected, other types return empty string)
 * @returns {string} Normalized absolute path with consistent separators, or empty string if input is invalid
 */
const normalizePath = inputPath => {
  const rawPath = validateString(inputPath);
  if (!rawPath) return '';

  return safeExecute(
    () => {
      let normalized = path.normalize(rawPath);

      // Make absolute if necessary
      if (!path.isAbsolute(normalized)) {
        normalized = path.resolve(process.cwd(), normalized);
      }

      // Standardize path separators
      normalized = normalized.replace(/[/\\]+/g, path.sep);

      // Lowercase drive letter on Windows for consistency
      if (process.platform === 'win32' && REGEX_PATTERNS.windowsDriveLetter.test(normalized)) {
        normalized = normalized.charAt(0).toLowerCase() + normalized.slice(1);
      }

      return normalized;
    },
    '',
    'Path normalization',
  );
};

/**
 * Reads the contents of an AutoIt (.au3) file with intelligent caching based on file modification time.
 * Only processes .au3 files for security. Uses a module-level cache to avoid re-reading unchanged files,
 * significantly improving performance when the same include file is accessed multiple times.
 *
 * @param {string} filePath - Absolute or relative path to the .au3 file to read
 * @returns {string} Complete file contents as UTF-8 string, or empty string if file doesn't exist, isn't .au3, or read fails
 */
const getIncludeText = filePath => {
  const normalized = normalizePath(filePath);
  if (!normalized) return '';

  // Only process .au3 files for security and performance
  const ext = path.extname(normalized).toLowerCase();
  if (ext !== '.au3') return '';

  // Check file stats for caching
  const stat = safeFileStat(normalized);
  if (!stat) return '';

  const mtimeMs = stat.mtimeMs || 0;

  // Check cache first
  const cached = includeCache.get(normalized);
  if (cached?.mtimeMs === mtimeMs) {
    return cached.content;
  }

  // Read file and cache result
  const content = safeReadFile(normalized);
  if (content) {
    includeCache.set(normalized, { mtimeMs, content });
  }

  return content;
};

// ============================================================================
// PATH RESOLUTION AND INCLUDE HANDLING
// ============================================================================

/**
 * Resolves AutoIt include file paths to absolute file system paths, handling both library includes
 * (with angle brackets) and relative includes (with quotes). Uses AutoIt's include search paths
 * and the current document's directory to locate files. Supports both `#include <file.au3>`
 * and `#include "file.au3"` formats.
 *
 * @param {string} fileOrPath - Include path from AutoIt source (e.g., "<Array.au3>" or "helper.au3")
 * @param {import('vscode').TextDocument} document - Current VSCode document for resolving relative paths
 * @returns {string} Absolute file system path to the include file, or empty string if not found or invalid
 */
const getIncludePath = (fileOrPath, document) => {
  const rawPath = validateString(fileOrPath);
  if (!rawPath) return '';

  // Parse include format (angle brackets vs quotes)
  const hasAngle = REGEX_PATTERNS.hasAngleBrackets.test(rawPath);
  const isQuoted = REGEX_PATTERNS.hasQuotes.test(rawPath);
  const cleanPath = rawPath.replace(/^[<""]|[>"]$/g, '');

  // Return early if already absolute
  if (path.isAbsolute(cleanPath)) {
    return normalizePath(cleanPath);
  }

  // Library include resolution (angle brackets or simple .au3 files)
  if (hasAngle || (!isQuoted && cleanPath.endsWith('.au3') && !cleanPath.includes(path.sep))) {
    const libPath = safeExecute(
      () => findFilepath(cleanPath, true),
      null,
      `Library path resolution for ${cleanPath}`,
    );

    if (libPath && typeof libPath === 'string') {
      return normalizePath(libPath);
    }
  }

  // Relative include resolution
  if (isValidDocument(document)) {
    const docPath = document.uri?.fsPath || document.fileName || '';
    if (docPath) {
      const baseDir = path.dirname(docPath);
      const resolved = path.resolve(baseDir, cleanPath);

      if (safeFileExists(resolved)) {
        return normalizePath(resolved);
      }
    }
  }

  // Fallback to include search paths
  const fallbackPath = safeExecute(
    () => findFilepath(cleanPath, false),
    null,
    `Fallback path resolution for ${cleanPath}`,
  );

  return fallbackPath && typeof fallbackPath === 'string'
    ? normalizePath(fallbackPath)
    : normalizePath(cleanPath);
};

// ============================================================================
// DOCUMENT ANALYSIS UTILITIES
// ============================================================================

/**
 * Determines if a text line should be skipped during AutoIt code analysis by checking for
 * empty lines, whitespace-only lines, comment lines (starting with ;), and most preprocessor
 * directives (starting with #). Comment block delimiters (#cs/#ce) are not skipped as they
 * affect parsing state.
 *
 * @param {import('vscode').TextLine} line - VSCode text line object to analyze
 * @returns {boolean} True if the line should be ignored during code parsing, false if it contains relevant code
 */
const isSkippableLine = line => {
  if (!line || line.isEmptyOrWhitespace) return true;

  const firstChar = line.text.charAt(line.firstNonWhitespaceCharacterIndex);

  // Skip comment lines
  if (firstChar === ';') return true;

  // Handle preprocessor directives
  if (firstChar === '#') {
    return (
      !REGEX_PATTERNS.commentBlockStart.test(line.text) &&
      !REGEX_PATTERNS.commentBlockEnd.test(line.text)
    );
  }

  return false;
};

/**
 * Recursively collects all AutoIt include file paths referenced in a document and its nested includes.
 * Prevents circular dependencies by tracking visited files. Processes both relative includes
 * (`#include "file.au3"`) and library includes (`#include <file.au3>`). The results are accumulated
 * in the provided array, maintaining order while ensuring uniqueness.
 *
 * @param {import('vscode').TextDocument} document - Current VSCode document being analyzed
 * @param {string} docText - Complete text content of the document to scan for includes
 * @param {string[]} scriptsToSearch - Array that will be populated with resolved absolute paths to include files
 */
const getIncludeScripts = (document, docText, scriptsToSearch) => {
  if (!isValidDocument(document) || !docText || !Array.isArray(scriptsToSearch)) {
    return;
  }

  // Maintain visited set for circular dependency protection
  // @ts-ignore - Adding custom property for tracking
  let visited = scriptsToSearch.__visitedSet;
  if (!visited) {
    visited = new Set();
    // @ts-ignore - Adding custom property for tracking
    Object.defineProperty(scriptsToSearch, '__visitedSet', {
      value: visited,
      enumerable: false,
      configurable: true,
      writable: false,
    });
  }

  /**
   * Process individual include with enhanced error handling
   * @param {string} includePath - Path to process
   * @param {boolean} isLibrary - Whether this is a library include
   */
  const processInclude = (includePath, isLibrary = false) => {
    if (!includePath) return;

    // Resolve path with appropriate format hints
    const pathToResolve = isLibrary ? `<${includePath}>` : includePath;
    let resolvedPath = getIncludePath(pathToResolve, document);

    // Fallback resolution if needed
    if (!resolvedPath) {
      const fallback = safeExecute(
        () => findFilepath(includePath, isLibrary),
        null,
        `Include resolution for ${includePath}`,
      );
      resolvedPath = typeof fallback === 'string' ? fallback : null;
    }

    if (!resolvedPath) return;

    const normalized = normalizePath(resolvedPath);
    if (!normalized || path.extname(normalized).toLowerCase() !== '.au3') return;

    // Prevent circular dependencies
    if (visited.has(normalized)) return;

    // Verify file accessibility
    if (!safeFileExists(normalized)) return;

    // Add to collection (maintain order and uniqueness)
    if (!scriptsToSearch.includes(normalized)) {
      scriptsToSearch.push(normalized);
    }
    visited.add(normalized);

    // Recursive processing
    const includeContent = getIncludeText(normalized);
    if (includeContent) {
      getIncludeScripts(document, includeContent, scriptsToSearch);
    }
  };

  // Process relative includes
  const relativeMatches = [...docText.matchAll(REGEX_PATTERNS.relativeInclude)];
  relativeMatches.forEach(match => processInclude(match[1], false));

  // Process library includes
  const libraryMatches = [...docText.matchAll(REGEX_PATTERNS.libraryInclude)];
  libraryMatches.forEach(match => processInclude(match[1], true));
};

// ============================================================================
// COMPLETION AND SIGNATURE UTILITIES
// ============================================================================

// Configuration for completion behavior
let parenTriggerOn = workspace.getConfiguration('autoit').get('enableParenTriggerForFunctions');

workspace.onDidChangeConfiguration(event => {
  if (event.affectsConfiguration('autoit.enableParenTriggerForFunctions')) {
    parenTriggerOn = workspace.getConfiguration('autoit').get('enableParenTriggerForFunctions');
  }
});

/**
 * Creates a new regular expression with different flags while preserving the original pattern.
 * Validates inputs and provides error handling to prevent runtime failures. Used to modify
 * regex behavior (like adding global or case-insensitive flags) without changing the pattern.
 *
 * @param {RegExp} regex - Source regular expression to copy the pattern from
 * @param {string} flags - New regex flags to apply (e.g., "gi" for global + case-insensitive)
 * @returns {RegExp} New RegExp instance with the same pattern but different flags, or safe default if invalid input
 */
const setRegExpFlags = (regex, flags) => {
  if (!(regex instanceof RegExp) || typeof flags !== 'string') {
    handleError('setRegExpFlags', 'Invalid regex or flags provided', false, { regex, flags });
    return regex || /(?:)/; // Return safe default
  }
  return new RegExp(regex.source, flags);
};

/**
 * Transforms an array of completion entries into VSCode CompletionItem objects with consistent
 * formatting and behavior. Adds include statements for UDF functions, configures commit characters
 * for function completions, and handles markdown documentation. Used to standardize completion
 * items from various sources (built-in functions, UDFs, variables, etc.).
 *
 * @param {Array} entries - Array of raw completion objects with label and documentation properties
 * @param {CompletionItemKind} kind - VSCode completion item type (Function, Variable, Constant, etc.)
 * @param {string} [detail=''] - Additional text to append to each item's detail field
 * @param {string} [requiredScript=''] - AutoIt include file name to show in documentation (e.g., "Array.au3")
 * @returns {Array} Array of VSCode CompletionItem objects ready for IntelliSense display
 */
const fillCompletions = (entries, kind, detail = '', requiredScript = '') => {
  if (!Array.isArray(entries)) {
    handleError('fillCompletions', 'Invalid entries array', false, { entries });
    return [];
  }

  return entries.map(entry => {
    if (!entry || typeof entry.label !== 'string') {
      return entry; // Return as-is if invalid
    }

    const newDoc = new MarkdownString(entry.documentation || '');
    if (requiredScript) {
      newDoc.appendCodeblock(`#include <${requiredScript}>`, 'autoit');
    }

    const newDetail = entry.detail ? `${entry.detail}${detail}` : detail;

    return {
      ...entry,
      kind,
      detail: newDetail,
      get commitCharacters() {
        return kind === CompletionItemKind.Function && parenTriggerOn ? ['('] : [];
      },
      documentation: newDoc,
    };
  });
};

/**
 * Modifies completion items by setting consistent detail text and appending documentation.
 * Creates new objects to avoid mutating the original array. Used to add contextual information
 * like "UDF Function" or source file information to completion items.
 *
 * @param {Array} array - Array of completion item objects to modify
 * @param {string} detail - Text to set as the detail field for all items (replaces existing detail)
 * @param {string} doc - Documentation text to append to existing documentation with italic formatting
 * @returns {Array} New array with modified completion items, or empty array if input is invalid
 */
const setDetailAndDocumentation = (array, detail, doc) => {
  if (!Array.isArray(array)) {
    handleError('setDetailAndDocumentation', 'Invalid array provided', false, { array });
    return [];
  }

  return array.map(item => ({
    ...item,
    detail: detail || '',
    documentation: `${item.documentation || ''}\n\n*${doc || ''}*`,
  }));
};

/**
 * Converts function signature definitions into hover information objects for VSCode's hover provider.
 * Transforms structured signature data (with label and documentation) into the format expected
 * by the hover system, including code block formatting for function signatures.
 *
 * @param {Object} signatures - Object where keys are function names and values are signature objects with label/documentation
 * @returns {Object} Object where keys are function names and values are arrays of [documentation, formatted_code_block]
 */
const signatureToHover = signatures => {
  if (!signatures || typeof signatures !== 'object') {
    handleError('signatureToHover', 'Invalid signatures object', false, { signatures });
    return {};
  }

  const hoverObjects = {};

  Object.entries(signatures).forEach(([key, signature]) => {
    if (signature && typeof signature === 'object') {
      hoverObjects[key] = [
        signature.documentation || '',
        `\`\`\`\r${signature.label || key}\r\`\`\``,
      ];
    }
  });

  return hoverObjects;
};

/**
 * Extracts hover information from completion items by using their labels as keys and documentation
 * as hover content. This allows completion data to be reused for hover functionality, ensuring
 * consistency between IntelliSense suggestions and hover information.
 *
 * @param {Array} completions - Array of completion items with label and documentation properties
 * @returns {Object} Object mapping function/item names to their documentation strings for hover display
 */
const completionToHover = completions => {
  if (!Array.isArray(completions)) {
    handleError('completionToHover', 'Invalid completions array', false, { completions });
    return {};
  }

  const hoverObjects = {};

  completions.forEach(item => {
    if (item && typeof item.label === 'string') {
      hoverObjects[item.label] = item.documentation || '';
    }
  });

  return hoverObjects;
};

/**
 * Transforms function signature definitions into completion items for VSCode's IntelliSense.
 * Takes structured signature data and creates completion objects with the appropriate kind,
 * detail text, and documentation. Used to convert function signatures into selectable completions.
 *
 * @param {Object} signatures - Object where keys are function names and values contain documentation
 * @param {CompletionItemKind} kind - VSCode completion item type to assign to all generated items
 * @param {string} detail - Detail text to display for all completion items (e.g., "Built-in Function")
 * @returns {Array} Array of completion objects ready for VSCode IntelliSense display
 */
const signatureToCompletion = (signatures, kind, detail) => {
  if (!signatures || typeof signatures !== 'object') {
    handleError('signatureToCompletion', 'Invalid signatures object', false, { signatures });
    return [];
  }

  return Object.entries(signatures).map(([key, signature]) => ({
    label: key,
    documentation: signature?.documentation || '',
    kind: kind || CompletionItemKind.Function,
    detail: detail || '',
  }));
};

// ============================================================================
// FUNCTION SIGNATURE ANALYSIS
// ============================================================================

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

  const headerSubstring = text.substring(headerIndex);
  const paramRegex = REGEX_PATTERNS.parameterDoc(paramEntry);

  const match = paramRegex.exec(headerSubstring);
  return match?.groups?.documentation || '';
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
const getParams = (paramText, text, headerIndex) => {
  const params = {};

  if (!validateString(paramText) || typeof text !== 'string') {
    return params;
  }

  const paramList = paramText
    .split(',')
    .map(param => param.trim())
    .filter(param => param.length > 0);

  paramList.forEach(param => {
    const paramEntry = param
      .split('=')[0]
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
 * @returns {Object} Object with functionName (string) and functionObject (signature data with label, documentation, params)
 */
const buildFunctionSignature = (functionMatch, fileText, fileName) => {
  if (!functionMatch || !Array.isArray(functionMatch) || functionMatch.length < 4) {
    handleError('buildFunctionSignature', 'Invalid function match', false, { functionMatch });
    return { functionName: '', functionObject: {} };
  }

  const [, functionLabel, functionName, paramsText] = functionMatch;

  if (!validateString(functionName)) {
    return { functionName: '', functionObject: {} };
  }

  const headerRegex = REGEX_PATTERNS.headerRegex(functionName);
  const headerMatch = fileText.match(headerRegex);
  const description = headerMatch?.groups?.description || '';
  const functionDocumentation = `${description ? `${description}\r` : ''}Included from ${fileName || 'unknown'}`;
  const functionIndex = headerMatch?.index ?? -1;

  return {
    functionName,
    functionObject: {
      label: functionLabel || functionName,
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
const getIncludeData = (fileName, doc) => {
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

// ============================================================================
// EXPORTS (Maintaining API Compatibility)
// ============================================================================

// Markdown formatting exports
export { descriptionHeader };
export { valueFirstHeader };
export { trueFalseHeader };
export { opt };
export { br };
export { defaultZero };

// AutoIt specific constants
export { AI_CONSTANTS };
export { AUTOIT_MODE };

// Utility functions
export { isSkippableLine };
export { normalizePath };
export { setRegExpFlags };

// File operations
export { getIncludeText };
export { getIncludePath };
export { getIncludeScripts };
export { findFilepath }; // Re-export from aiConfig for backward compatibility

// Completion and signature utilities
export { fillCompletions };
export { signatureToHover };
export { completionToHover };
export { signatureToCompletion };
export { setDetailAndDocumentation as setDetail };

// Function analysis
export { buildFunctionSignature };
export { getParams };
export { getIncludeData };

// Regex patterns (maintaining compatibility)
export { REGEX_PATTERNS as patterns };

// Individual pattern exports for backward compatibility
export const { includePattern } = REGEX_PATTERNS;
export const { functionPattern } = REGEX_PATTERNS;
export const { functionDefinitionRegex } = REGEX_PATTERNS;
export const { variablePattern } = REGEX_PATTERNS;
export const { regionPattern } = REGEX_PATTERNS;
export const { libraryIncludePattern } = REGEX_PATTERNS;
