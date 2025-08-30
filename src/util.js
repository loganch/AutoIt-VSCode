/// <reference types="vscode" />
import fs from 'fs';
import path from 'path';
import { CompletionItemKind, MarkdownString, workspace, window } from 'vscode';
import aiConfig from './ai_config';
const { findFilepath } = aiConfig;

const descriptionHeader = '|Description |Value |\n|:---|:---:|\n';
const valueFirstHeader = '\n|&nbsp;|&nbsp;&nbsp;&nbsp; |&nbsp;\n|---:|:---:|:---|';
const trueFalseHeader = `\n|&nbsp;|&nbsp;&nbsp;&nbsp;|&nbsp;
    :---|:---:|:---`;
const opt = '**[optional]**';
const br = '\u0020\u0020';
const defaultZero = `${br + br}\`Default = 0\``;

const setRegExpFlags = (regex, flags) => new RegExp(regex.source, flags);

const setDetailAndDocumentation = (array, detail, doc) => {
  const newArray = array.map(item => {
    return { ...item, detail, documentation: `${item.documentation}\n\n*${doc}*` };
  });

  return newArray;
};

const AI_CONSTANTS = [
  '$MB_ICONERROR',
  '$MB_ICONINFORMATION',
  '$MB_YESNO',
  '$MB_TASKMODAL',
  '$IDYES',
  '$IDNO',
];
const AUTOIT_MODE = { language: 'autoit', scheme: 'file' };

const isSkippableLine = line => {
  if (line.isEmptyOrWhitespace) {
    return true;
  }

  const firstChar = line.text.charAt(line.firstNonWhitespaceCharacterIndex);
  if (firstChar === ';') {
    return true;
  }

  if (firstChar === '#') {
    if (/^\s*#(cs|ce|comments-start|comments-end)/.test(line.text)) {
      return false;
    }
    return true;
  }

  return false;
};

/**
 * Normalize a path for cross-OS consistency and stable Map/Set keys.
 * - path.normalize
 * - absolute resolve (fallback to process.cwd() if relative)
 * - replace all backslashes with path.sep for internal consistency
 * - lowercase drive letter on Windows
 * @param {string} p
 * @returns {string}
 */
const normalizePath = p => {
  try {
    if (typeof p !== 'string' || p.length === 0) return '';
    let out = p;
    // Normalize first
    out = path.normalize(out);

    // Make absolute if necessary, resolve against cwd as fallback
    if (!path.isAbsolute(out)) {
      out = path.resolve(process.cwd(), out);
    }

    // Replace backslashes with path.sep for internal consistency
    if (path.sep === '/') {
      out = out.replace(/\\/g, '/');
    } else {
      // On Windows keep native sep but still collapse any stray forward slashes
      out = out.replace(/\//g, '\\');
    }

    // Lowercase drive letter on Windows (e.g., C:\ -> c:\)
    if (process.platform === 'win32' && /^[A-Z]:[\\/]/.test(out)) {
      out = out.charAt(0).toLowerCase() + out.slice(1);
    }

    return out;
  } catch (e) {
    window.showInformationMessage(`normalizePath error: ${e}`);
    return '';
  }
};

// Module-level cache for include file contents
// key = normalized absolute path; value = { mtimeMs: number, content: string }
const includeCache = new Map();

/**
 * Safely read include file text with caching and .au3 filtering.
 * @param {string} filePath
 * @returns {string} file content or ''
 */
const getIncludeText = filePath => {
  try {
    const normalized = normalizePath(filePath);
    if (!normalized) return '';

    // Only process .au3 files (case-insensitive)
    const ext = path.extname(normalized).toLowerCase();
    if (ext !== '.au3') return '';

    let stat;
    try {
      stat = fs.statSync(normalized);
    } catch (e) {
      window.showInformationMessage(`getIncludeText stat error: ${normalized} ${e}`);
      return '';
    }

    const mtimeMs = stat && typeof stat.mtimeMs === 'number' ? stat.mtimeMs : 0;

    const cached = includeCache.get(normalized);
    if (cached && cached.mtimeMs === mtimeMs) {
      return cached.content;
    }

    let data = '';
    try {
      data = fs.readFileSync(normalized, { encoding: 'utf8' });
    } catch (e) {
      window.showInformationMessage(`getIncludeText read error: ${normalized} ${e}`);
      return '';
    }

    includeCache.set(normalized, { mtimeMs, content: data });
    return data;
  } catch (err) {
    window.showInformationMessage(`getIncludeText error: ${err}`);
    return '';
  }
};

/**
 * Returns the include path of a given file or path based on the provided document.
 * Enhanced normalization and cross-OS consistency.
 * - Relative includes resolved against document path when possible.
 * - Library includes resolved using findFilepath.
 * - normalizePath is applied before return.
 * - Never throws; returns empty string when not resolvable.
 * @param {string} fileOrPath - The file or path to get the include path of.
 * @param {import('vscode').TextDocument} document - The document object to use for determining the include path.
 * @returns {string} The include path of the given file or path.
 */
const getIncludePath = (fileOrPath, document) => {
  try {
    if (!fileOrPath || typeof fileOrPath !== 'string') return '';
    const raw = fileOrPath.trim();

    // Detect if this is a library include (originally had angle brackets) vs relative include
    const hasAngle = /^<.+>$/.test(raw);
    const isQuoted = /^".+"$/.test(raw);
    const candidate = raw.replace(/^<|>$/g, '').replace(/^"|"$/g, '');

    // If path is already absolute, normalize and return
    if (path.isAbsolute(candidate)) {
      return normalizePath(candidate);
    }

    // For library includes (angle brackets), prioritize library paths
    if (
      hasAngle ||
      (!isQuoted &&
        candidate.endsWith('.au3') &&
        !candidate.includes('\\') &&
        !candidate.includes('/'))
    ) {
      try {
        const libPath = findFilepath(candidate, true); // Search library paths first
        if (libPath && typeof libPath === 'string') {
          return normalizePath(libPath);
        }
      } catch (e) {
        window.showInformationMessage(
          `getIncludePath findFilepath library error: ${candidate} ${e}`,
        );
      }
    }

    // For quoted includes or when library search failed, try relative to document
    let resolved = '';
    try {
      const docFsPath =
        document && document.uri && document.uri.fsPath
          ? document.uri.fsPath
          : (document && document.fileName) || '';
      const baseDir = docFsPath ? path.dirname(docFsPath) : process.cwd();
      resolved = path.resolve(baseDir, candidate);
    } catch {
      // ignore
    }

    // If a file exists at resolved path, return it
    try {
      if (resolved && fs.existsSync(resolved)) {
        return normalizePath(resolved);
      }
    } catch {
      window.showInformationMessage(`getIncludePath existsSync error: ${resolved}`);
    }

    // Use include search paths as fallback
    try {
      const libPath = findFilepath(candidate, false); // Search user paths
      if (libPath && typeof libPath === 'string') {
        return normalizePath(libPath);
      }
    } catch (e) {
      window.showInformationMessage(
        `getIncludePath findFilepath fallback error: ${candidate} ${e}`,
      );
    }

    // Fallback: normalized of what we had resolved or candidate
    return normalizePath(resolved || candidate);
  } catch (err) {
    window.showInformationMessage(`getIncludePath error: ${err}`);
    return '';
  }
};

let parenTriggerOn = workspace.getConfiguration('autoit').get('enableParenTriggerForFunctions');

workspace.onDidChangeConfiguration(event => {
  if (event.affectsConfiguration('autoit.enableParenTriggerForFunctions'))
    parenTriggerOn = workspace.getConfiguration('autoit').get('enableParenTriggerForFunctions');
});

/**
 * Generates a new array of Completions that include a common kind, detail and
 * potentially commitCharacter(s)
 * @param {*} entries The array of Completions to be modified
 * @param {*} kind The enum value of CompletionItemKind to determine icon
 * @param {*} detail Additional information about the entries
 * @param {*} requiredScript Script where completion is defined
 * @returns Returns an array of Completion objects
 */
const fillCompletions = (entries, kind, detail = '', requiredScript = '') => {
  const filledCompletion = entries.map(entry => {
    const newDoc = new MarkdownString(entry.documentation);
    if (requiredScript) newDoc.appendCodeblock(`#include <${requiredScript}>`, 'autoit');

    const newDetail = entry.detail ? entry.detail + detail : detail;

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

  return filledCompletion;
};

/**
 * Generates an object of Hover objects for a set of signatures
 * @param signatures An object containing Signature objects
 * @returns Returns an empty object or with Hover objects
 */
const signatureToHover = signatures => {
  const hoverObjects = {};

  for (const item of Object.keys(signatures)) {
    hoverObjects[item] = [
      signatures[item].documentation,
      `\`\`\`\r${signatures[item].label}\r\`\`\``,
    ];
  }

  return hoverObjects;
};

/**
 * Generates an object of Hover objects from completions
 * @param completions An object containing Completions
 * @returns Returns an empty object or Hover objects
 */
const completionToHover = completions => {
  const hoverObjects = {};

  completions.forEach(item => {
    hoverObjects[item.label] = item.documentation;
  });

  return hoverObjects;
};

const includePattern = /^#include\s"(.+)"/gm;
const functionPattern = /^[\t ]*(?:volatile[\t ]+)?Func[\t ]+(\w+)[\t ]*\(/i;
const functionDefinitionRegex = /^[\t ]*(?:volatile[\t ]+)?Func[\t ]+((\w+)[\t ]*\((.*)\))/gim;
const variablePattern = /(?:["'].*?["'])|(?:;.*)|(\$\w+)/g;
const regionPattern = /^[\t ]{0,}#region\s[- ]{0,}(.+)/i;
const libraryIncludePattern = /^#include\s+<([\w.]+\.au3)>/gm;

/**
 * Generates an array of Completions from a signature object
 * @param signatures Signature object
 * @param kind The CompletionItemKind
 * @param detail A human-readable string with additional information about this item, like type or symbol information.
 * @returns {Array} an array of completions
 */
const signatureToCompletion = (signatures, kind, detail) => {
  const completionSet = Object.keys(signatures).map(key => {
    return { label: key, documentation: signatures[key].documentation, kind, detail };
  });

  return completionSet;
};

/**
 * Generates an array of Include scripts to search
 * Supports circular dependency protection and .au3 filtering.
 * Maintains API compatibility with existing call sites.
 * @param {import('vscode').TextDocument} document The current document to search
 * @param {String} docText The text from the document
 * @param {Array} scriptsToSearch The destination array (unique, stable order)
 * @returns {void}
 */
const getIncludeScripts = (document, docText, scriptsToSearch) => {
  try {
    const relativeInclude = /^\s*#include\s"(.+)"/gm;
    const libraryInclude = /^\s*#include\s<(.+)>/gm;

    // Maintain a visited set across recursion attached to the array for API compatibility
    // Use a non-enumerable property to avoid affecting consumer iteration
    const _scripts = /** @type {any} */ (scriptsToSearch);
    let visited = _scripts && _scripts.__visitedSet;
    if (!visited) {
      visited = new Set();
      Object.defineProperty(_scripts, '__visitedSet', {
        value: visited,
        enumerable: false,
        configurable: true,
        writable: false,
      });
    }

    const processInclude = (incRaw, isLibrary = false) => {
      try {
        if (!incRaw) return;
        // Add angle brackets back for library includes to help getIncludePath distinguish them
        const pathToResolve = isLibrary ? `<${incRaw}>` : incRaw;
        // Resolve path using getIncludePath and library search
        let p = getIncludePath(pathToResolve, document);
        if (!p) {
          try {
            const alt = findFilepath(incRaw, isLibrary);
            if (alt && typeof alt === 'string') p = alt;
          } catch (e) {
            window.showInformationMessage(`findFilepath error for ${incRaw} ${e}`);
          }
        }
        if (!p) return;

        const normalized = normalizePath(p);
        if (!normalized) return;

        // Only .au3 files
        if (path.extname(normalized).toLowerCase() !== '.au3') return;

        if (visited.has(normalized)) return;

        // Check readability
        try {
          if (!fs.existsSync(normalized)) return;
        } catch (e) {
          window.showInformationMessage(`existsSync error for ${normalized} ${e}`);
          return;
        }

        // stable-order uniqueness
        if (scriptsToSearch.indexOf(normalized) === -1) {
          scriptsToSearch.push(normalized);
        }
        visited.add(normalized);

        // Recurse using file content
        const txt = getIncludeText(normalized);
        if (!txt) return;
        getIncludeScripts(document, txt, scriptsToSearch);
      } catch (e) {
        window.showInformationMessage(`processInclude error: ${incRaw} ${e}`);
      }
    };

    let found = relativeInclude.exec(docText);
    while (found) {
      processInclude(found[1], false);
      found = relativeInclude.exec(docText);
    }

    found = libraryInclude.exec(docText);
    while (found) {
      processInclude(found[1], true);
      found = libraryInclude.exec(docText);
    }
  } catch (err) {
    window.showInformationMessage(`getIncludeScripts error: ${err}`);
  }
};

/**
 * Extracts the documentation for a specific parameter from a given text.
 *
 * @param {string} text - The text containing the parameter documentation.
 * @param {string} paramEntry - The name of the parameter entry to extract the documentation for.
 * @param {number} headerIndex - The index where the header starts in the text.
 * @returns {string} The documentation for the specified parameter, or an empty string if not found.
 */
const extractParamDocumentation = (text, paramEntry, headerIndex) => {
  if (headerIndex === -1) return '';

  const headerSubstring = text.substring(headerIndex);
  const parameterDocRegex = new RegExp(
    `;\\s*(?:Parameters\\s*\\.+:)?\\s*(?:\\${paramEntry})\\s+-\\s(?<documentation>.+)`,
  );

  const paramDocMatch = parameterDocRegex.exec(headerSubstring);
  const paramDoc = paramDocMatch ? paramDocMatch.groups.documentation : '';

  return paramDoc;
};

/**
 * Returns an object with each parameter as a key and an object with label and documentation properties as its value.
 * @param {string} paramText - A string of comma-separated parameters.
 * @param {string} text - The text from the document
 * @returns {Object} An object with each parameter as a key and an object with label and documentation properties as its value.
 */
const getParams = (paramText, text, headerIndex) => {
  const params = {};

  if (!paramText) return params;

  const paramList = paramText.split(',');
  for (const param of paramList) {
    const paramEntry = param
      .split('=')[0]
      .trim()
      .replace(/^ByRef\s*/, '');

    const paramDoc = extractParamDocumentation(text, paramEntry, headerIndex);

    params[paramEntry] = {
      label: paramEntry,
      documentation: paramDoc,
    };
  }

  return params;
};

const getHeaderRegex = functionName =>
  new RegExp(
    `;\\s*Name\\s*\\.+:\\s+${functionName}\\s*[\r\n]` +
      ';\\s+Description\\s*\\.+:\\s+(?<description>.+)[\r\n]',
  );

/**
 * Extracts function data from pattern and returns an object containing function name and object
 * @param {RegExpExecArray} functionMatch The results of the includeFuncPattern match
 * @param {string} fileText The contents of the AutoIt Script
 * @param {string} fileName The name of the AutoIt Script
 * @returns {Object} Object containing function name and object
 */
const buildFunctionSignature = (functionMatch, fileText, fileName) => {
  const { 1: functionLabel, 2: functionName, 3: paramsText } = functionMatch;

  const headerRegex = getHeaderRegex(functionName);
  const headerMatch = fileText.match(headerRegex);
  const description = headerMatch ? `${headerMatch.groups.description}\r` : '';
  const functionDocumentation = `${description}Included from ${fileName}`;
  const functionIndex = headerMatch ? headerMatch.index : -1;

  return {
    functionName,
    functionObject: {
      label: functionLabel,
      documentation: functionDocumentation,
      params: getParams(paramsText, fileText, functionIndex),
    },
  };
};

/**
 * Returns an object of AutoIt functions found within a VSCode TextDocument
 * @param {string} fileName The name of the AutoIt script
 * @param {import('vscode').TextDocument} doc The  TextDocument object representing the AutoIt script
 * @returns {Object} Object containing SignatureInformation objects
 */
const getIncludeData = (fileName, doc) => {
  const functions = {};
  let filePath = getIncludePath(fileName, doc);

  if (!fs.existsSync(filePath)) {
    // Find first instance using include paths
    const foundPath = findFilepath(fileName, false);
    if (foundPath && typeof foundPath === 'string') {
      filePath = foundPath;
    }
  }
  let functionMatch = null;
  const fileData = getIncludeText(filePath);
  do {
    functionMatch = functionDefinitionRegex.exec(fileData);
    if (functionMatch) {
      const functionData = buildFunctionSignature(functionMatch, fileData, fileName);
      functions[functionData.functionName] = functionData.functionObject;
    }
  } while (functionMatch);

  return functions;
};

export { descriptionHeader };
export { valueFirstHeader };
export { setDetailAndDocumentation as setDetail };
export { opt };
export { trueFalseHeader };
export { br };
export { AI_CONSTANTS };
export { defaultZero };
export { AUTOIT_MODE };
export { isSkippableLine };
export { getIncludeText };
export { getIncludePath };
export { fillCompletions };
export { signatureToHover };
export { includePattern };
export { functionPattern };
export { variablePattern };
export { regionPattern };
export { libraryIncludePattern };
export { completionToHover };
export { signatureToCompletion };
export { getIncludeData };
export { getParams };
export { getIncludeScripts };
export { buildFunctionSignature };
export { functionDefinitionRegex };
export { setRegExpFlags };
