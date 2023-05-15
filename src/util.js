const fs = require('fs');
const path = require('path');
const { CompletionItemKind, MarkdownString, workspace } = require('vscode');
const { findFilepath } = require('./ai_config').default;

const descriptionHeader = '|Description |Value |\n|:---|:---:|\n';
const valueFirstHeader = '\n|&nbsp;|&nbsp;&nbsp;&nbsp; |&nbsp;\n|---:|:---:|:---|';
const trueFalseHeader = `\n|&nbsp;|&nbsp;&nbsp;&nbsp;|&nbsp;
    :---|:---:|:---`;
const opt = '**[optional]**';
const br = '\u0020\u0020';
const defaultZero = `${br + br}\`Default = 0\``;
// eslint-disable-next-line no-extend-native
RegExp.prototype.setFlags = function setFlags(flags) {
  return RegExp(this.source, flags);
};

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

const getIncludeText = filePath => {
  return fs.readFileSync(filePath).toString();
};

/**
 * Returns the include path of a given file or path based on the provided document.
 * @param {string} fileOrPath - The file or path to get the include path of.
 * @param {TextDocument} document - The document object to use for determining the include path.
 * @returns {string} The include path of the given file or path.
 */
const getIncludePath = (fileOrPath, document) => {
  let includePath = '';

  if (fileOrPath.charAt(1) === ':') {
    includePath = fileOrPath;
  } else {
    let docDir = path.dirname(document.fileName);

    docDir +=
      (fileOrPath.charAt(0) === '\\' || fileOrPath.charAt(0) === '/' ? '' : '\\') + fileOrPath;
    includePath = path.normalize(docDir);
  }

  includePath = includePath.charAt(0).toUpperCase() + includePath.slice(1);

  return includePath;
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
  let hoverObjects = {};
  const sigKeys = Object.keys(signatures);
  sigKeys.forEach(item => {
    hoverObjects = {
      ...hoverObjects,
      [item]: [signatures[item].documentation, `\`\`\`\r${signatures[item].label}\r\`\`\``],
    };
  });

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
 * that includes the full range of the region's body
 * @param {TextDocument} document The current document to search
 * @param {String} docText The text from the document
 * @param {Array} scriptsToSearch The destination array
 * @returns SymbolInformation
 */
const getIncludeScripts = (document, docText, scriptsToSearch) => {
  const relativeInclude = /^\s*#include\s"(.+)"/gm;
  const libraryInclude = /^\s*#include\s<(.+)>/gm;
  let includeFile;
  let scriptContent;

  let found = relativeInclude.exec(docText);
  while (found) {
    // Check if file exists in document directory
    includeFile = getIncludePath(found[1], document);
    if (!fs.existsSync(includeFile)) {
      // Find first instance using include paths
      includeFile = findFilepath(found[1], false);
    }
    if (includeFile && scriptsToSearch.indexOf(includeFile) === -1) {
      scriptsToSearch.push(includeFile);
      scriptContent = getIncludeText(includeFile);
      getIncludeScripts(document, scriptContent, scriptsToSearch);
    }
    found = relativeInclude.exec(docText);
  }

  found = libraryInclude.exec(docText);
  while (found) {
    // Find first instance using include paths
    includeFile = findFilepath(found[1], false);
    if (includeFile && scriptsToSearch.indexOf(includeFile) === -1) {
      scriptsToSearch.push(includeFile);
      scriptContent = getIncludeText(includeFile);
      getIncludeScripts(document, scriptContent, scriptsToSearch);
    }
    found = libraryInclude.exec(docText);
  }
};

/**
 * Returns an object with each parameter as a key and an object with label and documentation properties as its value.
 * @param {string} paramText - A string of comma-separated parameters.
 * @param {string} text - The text from the document
 * @returns {Object} An object with each parameter as a key and an object with label and documentation properties as its value.
 */
const getParams = (paramText, functionName, text) => {
  const params = {};

  if (!paramText) {
    return params;
  }

  paramText.split(',').forEach(param => {
    let paramEntry = param.split('=')[0].trim();
    if (paramEntry.startsWith('ByRef')) paramEntry = paramEntry.slice(6);

    const parameterDocRegex = new RegExp(
      `;\\s*(?:Parameters\\s*\\.+:)?\\s*(?:\\${paramEntry})\\s+-\\s(?<documentation>.+)`,
    );

    //   new RegExp(
    //   `;\\s*(?:Parameters\\s*\\.+:)?\\s*(?:\\${paramEntry})\\s+-\\s*(?<documentation>.+?);`,
    // );
    const paramDocMatch = text.match(parameterDocRegex);
    const paramDoc = paramDocMatch ? paramDocMatch.groups.documentation : '';

    params[paramEntry] = {
      label: paramEntry,
      documentation: paramDoc,
    };
  });

  return params;
};

/**
 * Extracts function data from pattern and returns an object containing function name and object
 * @param {RegExpExecArray} functionMatch The results of the includeFuncPattern match
 * @param {string} fileText The contents of the AutoIt Script
 * @param {string} fileName The name of the AutoIt Script
 * @returns {Object} Object containing function name and object
 */
const buildFunctionSignature = (functionMatch, fileText, fileName) => {
  const functionName = functionMatch[2];
  const functionLabel = functionMatch[1];
  const headerRegex = new RegExp(
    `;\\s*Name\\s*\\.+:\\s+${functionName}\\s*[\r\n];\\s+Description\\s*\\.+:\\s+(?<description>.+)[\r\n];\\s*Syntax`,
  );
  const headerMatch = fileText.match(headerRegex);
  const description = headerMatch ? `${headerMatch.groups.description}\r` : '';
  const functionDocumentation = `${description}Included from ${fileName}`;

  return {
    functionName,
    functionObject: {
      label: functionLabel,
      documentation: functionDocumentation,
      params: getParams(functionMatch[3], functionName, fileText),
    },
  };
};

/**
 * Returns an object of AutoIt functions found within a VSCode TextDocument
 * @param {string} fileName The name of the AutoIt script
 * @param {vscode.TextDocument} doc The  TextDocument object representing the AutoIt script
 * @returns {Object} Object containing SignatureInformation objects
 */
const getIncludeData = (fileName, doc) => {
  const functions = {};
  let filePath = getIncludePath(fileName, doc);

  if (!fs.existsSync(filePath)) {
    // Find first instance using include paths
    filePath = findFilepath(fileName, false);
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

module.exports = {
  descriptionHeader,
  valueFirstHeader,
  setDetail: setDetailAndDocumentation,
  opt,
  trueFalseHeader,
  br,
  AI_CONSTANTS,
  defaultZero,
  AUTOIT_MODE,
  isSkippableLine,
  getIncludeText,
  getIncludePath,
  fillCompletions,
  signatureToHover,
  includePattern,
  functionPattern,
  variablePattern,
  regionPattern,
  libraryIncludePattern,
  completionToHover,
  signatureToCompletion,
  findFilepath,
  getIncludeData,
  getParams,
  getIncludeScripts,
  buildFunctionSignature,
  functionDefinitionRegex,
};
