/// <reference types="vscode" />
import { CompletionItemKind, MarkdownString, workspace } from 'vscode';
import { handleError } from './errorUtils';

// ============================================================================
// COMPLETION AND SIGNATURE TRANSFORMS
// ============================================================================
//
// Turns the pure data in signatures/ and completions/ into VS Code
// completion and hover items. Extracted from util.js so the ~97 data files
// import only what they use from here instead of funnelling through the
// util.js God module (tech-debt finding F7).

// Markdown formatting constants used by the data files' documentation.
const descriptionHeader = '|Description |Value |\n|:---|:---:|\n';
const valueFirstHeader = '\n|&nbsp;|&nbsp;&nbsp;&nbsp; |&nbsp;\n|---:|:---:|:---|';
const trueFalseHeader = `\n|&nbsp;|&nbsp;&nbsp;&nbsp;|&nbsp;
    :---|:---:|:---`;
const opt = '**[optional]**';
const br = '  ';
const defaultZero = `${br + br}\`Default = 0\``;

// Configuration for completion behavior
let parenTriggerOn = workspace.getConfiguration('autoit').get('enableParenTriggerForFunctions');

workspace.onDidChangeConfiguration(event => {
  if (event.affectsConfiguration('autoit.enableParenTriggerForFunctions')) {
    parenTriggerOn = workspace.getConfiguration('autoit').get('enableParenTriggerForFunctions');
  }
});

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
      ...(requiredScript ? { requiredInclude: requiredScript } : {}),
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

  const includeMatch = typeof detail === 'string' ? detail.match(/#include\s+<([^>]+)>/) : null;
  const requiredInclude = includeMatch ? includeMatch[1] : undefined;

  return Object.entries(signatures).map(([key, signature]) => ({
    label: key,
    documentation: signature?.documentation || '',
    kind: kind || CompletionItemKind.Function,
    detail: detail || '',
    ...(requiredInclude ? { requiredInclude } : {}),
  }));
};

export {
  descriptionHeader,
  valueFirstHeader,
  trueFalseHeader,
  opt,
  br,
  defaultZero,
  fillCompletions,
  setDetailAndDocumentation,
  setDetailAndDocumentation as setDetail,
  signatureToHover,
  completionToHover,
  signatureToCompletion,
};
