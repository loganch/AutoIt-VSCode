const fs = require('fs');
const path = require('path');

const descriptionHeader = '|Description |Value |\n|:---|:---:|\n';
const valueFirstHeader = '\n|&nbsp;|&nbsp;&nbsp;&nbsp; |&nbsp;\n|---:|:---:|:---|';
const trueFalseHeader = `\n|&nbsp;|&nbsp;&nbsp;&nbsp;|&nbsp;
    :---|:---:|:---`;
const opt = '**[optional]**';
const br = '\u0020\u0020';
const defaultZero = `${br + br}\`Default = 0\``;

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
  const skipChars = [';', '#'];

  if (line.isEmptyOrWhitespace) {
    return true;
  }

  const firstChar = line.text.charAt(line.firstNonWhitespaceCharacterIndex);
  if (skipChars.includes(firstChar)) {
    return true;
  }

  return false;
};

const getIncludeText = filePath => {
  return fs.readFileSync(filePath).toString();
};

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

const fillCompletions = (entries, kind, detail) => {
  const filledCompletion = entries.map(entry => {
    return { ...entry, kind, detail };
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
const functionPattern = /^[\t ]{0,}Func\s(.+)\(/;

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
  completionToHover,
  signatureToCompletion,
};
