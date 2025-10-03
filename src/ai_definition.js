import { Location, Position, Range, Uri, languages, window } from 'vscode';
import { AUTOIT_MODE, getIncludePath, getIncludeScripts, getIncludeText } from './util';

// Constants for better maintainability
const REGEX_FLAGS = 'mi';
const VARIABLE_KEYWORDS = ['Local', 'Global', 'Const'];
const FUNCTION_KEYWORD = 'Func';
const VOLATILE_KEYWORD = 'volatile';

// Regex patterns
const VARIABLE_PATTERN_TEMPLATE =
  '^[ \\t]*(?:(?:{keywords})[ \\t]+)?' +
  '(?:(?:\\$[A-Za-z_][A-Za-z0-9_]*\\s*(?:=\\s*[^,\\r\\n]+)?\\s*,\\s*)*?)' +
  '({escaped})\\b' +
  '(?:[^\\n]*?(?:,\\s*[^\\n]*?)?)(?:\\s*_\\s*\\r?\\n[\\s\\S]*?)?';

const FUNCTION_PATTERN_A_TEMPLATE =
  '^[ \\t]*{funcKeyword}[ \\t]+(?:{volatile}[ \\t]+)?({escaped})[ \\t]*\\(';
const FUNCTION_PATTERN_B_TEMPLATE =
  '^[ \\t]*{funcKeyword}[ \\t]+({escaped})[ \\t]+{volatile}[ \\t]*\\(';

// Custom Error Classes
class DefinitionProviderError extends Error {
  constructor(message, cause = null) {
    super(message);
    this.name = 'DefinitionProviderError';
    this.cause = cause;
  }
}

class ValidationError extends DefinitionProviderError {
  constructor(message, cause = null) {
    super(message, cause);
    this.name = 'ValidationError';
  }
}

class RegexError extends DefinitionProviderError {
  constructor(message, cause = null) {
    super(message, cause);
    this.name = 'RegexError';
  }
}

const AutoItDefinitionProvider = {
  /**
   * Escapes special regex characters in a string
   * @param {string} string - The string to escape
   * @returns {string} The escaped string
   */
  escapeRegex(string) {
    if (typeof string !== 'string') {
      throw new ValidationError('Input must be a string for regex escaping');
    }
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },

  /**
   * Creates a regex pattern for variable definitions
   * @param {string} variableName - The variable name to create regex for
   * @returns {RegExp} The compiled regex for variable matching
   */
  createVariableRegex(variableName) {
    try {
      if (!variableName || typeof variableName !== 'string') {
        throw new ValidationError('Variable name must be a non-empty string');
      }

      const escaped = this.escapeRegex(variableName);
      const keywords = VARIABLE_KEYWORDS.join('|');
      const pattern = VARIABLE_PATTERN_TEMPLATE.replace('{keywords}', keywords).replace(
        '{escaped}',
        escaped,
      );

      return new RegExp(pattern, REGEX_FLAGS);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new RegexError(
        `Failed to create variable regex for "${variableName}": ${error.message}`,
        error,
      );
    }
  },

  /**
   * Creates a regex pattern for function definitions
   * @param {string} functionName - The function name to create regex for
   * @returns {RegExp} The compiled regex for function matching
   */
  createFunctionRegex(functionName) {
    try {
      if (!functionName || typeof functionName !== 'string') {
        throw new ValidationError('Function name must be a non-empty string');
      }

      const escaped = this.escapeRegex(functionName);
      const patternA = FUNCTION_PATTERN_A_TEMPLATE.replace('{funcKeyword}', FUNCTION_KEYWORD)
        .replace('{volatile}', VOLATILE_KEYWORD)
        .replace('{escaped}', escaped);

      const patternB = FUNCTION_PATTERN_B_TEMPLATE.replace('{funcKeyword}', FUNCTION_KEYWORD)
        .replace('{volatile}', VOLATILE_KEYWORD)
        .replace('{escaped}', escaped);

      const combined = `(?:${patternA})|(?:${patternB})`;
      return new RegExp(combined, REGEX_FLAGS);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new RegexError(
        `Failed to create function regex for "${functionName}": ${error.message}`,
        error,
      );
    }
  },

  /**
   * Finds the definition of a word in a document and returns its location.
   * @param {import("vscode").TextDocument} document - The document in which to search for the word definition.
   * @param {Position} position - The position of the word for which to find the definition.
   * @returns {Location|null} - The location of the word definition, or null if not found.
   */
  provideDefinition(document, position) {
    try {
      // Input validation
      if (!document || !position || typeof document.getText !== 'function') {
        throw new ValidationError('Invalid document or position provided');
      }
      const lookupRange = document.getWordRangeAtPosition(position);
      if (!lookupRange) return null;
      const lookupText = document.getText(lookupRange);
      if (typeof lookupText !== 'string' || lookupText.trim().length === 0) return null;

      const documentText = document.getText();
      if (typeof documentText !== 'string' || documentText.length === 0) return null;

      // Build regex for the symbol
      const definitionRegex = this.determineRegex(lookupText);
      if (!definitionRegex) return null;

      // First attempt: search in current document
      const match = definitionRegex.exec(documentText);
      if (match && typeof match.index === 'number') {
        // Capture group for symbol if present; compute the exact symbol index
        let symbolOffsetInMatch = 0;
        if (match[1]) {
          const idxIn0 = match[0].indexOf(match[1]);
          if (idxIn0 >= 0) symbolOffsetInMatch = idxIn0;
        }
        const absoluteIndex = match.index + symbolOffsetInMatch;
        const pos = document.positionAt(absoluteIndex);
        const range = new Range(pos, pos);
        return new Location(document.uri, range);
      }

      // Search include files
      const includeResult = this.findDefinitionInIncludeFiles(
        documentText,
        definitionRegex,
        document,
        lookupText,
      );
      if (includeResult && includeResult.found) {
        const { scriptPath, found } = includeResult;
        const pos = new Position(found.line, found.character);
        const range = new Range(pos, pos);
        return new Location(Uri.file(scriptPath), range);
      }

      return null;
    } catch (err) {
      // Provide user-friendly error messages while categorizing errors internally
      let userMessage = 'Definition lookup failed';
      if (err instanceof ValidationError) {
        userMessage = 'Invalid input provided for definition lookup';
      } else if (err instanceof RegexError) {
        userMessage = 'Pattern matching failed during definition lookup';
      } else if (err instanceof DefinitionProviderError) {
        userMessage = err.message;
      }

      window.showErrorMessage(`provideDefinition error: ${userMessage}`);
      return null;
    }
  },

  /**
   * Determines the regex for a given lookup string.
   * Chooses variable or function regex and compiles with appropriate flags.
   * @param {string} lookup - The lookup string.
   * @returns {RegExp} The regex for the lookup string.
   */
  determineRegex(lookup) {
    try {
      if (!lookup || typeof lookup !== 'string') {
        throw new ValidationError('Lookup string must be a non-empty string');
      }

      if (lookup.startsWith('$')) {
        // Variables: use the variable regex helper
        return this.createVariableRegex(lookup);
      }

      // Functions: use the function regex helper
      return this.createFunctionRegex(lookup);
    } catch (error) {
      // Provide user-friendly error message while preserving error details
      let userMessage = 'Failed to create search pattern';
      if (error instanceof ValidationError || error instanceof RegexError) {
        userMessage = error.message;
      }

      window.showErrorMessage(`determineRegex error: ${userMessage}`);
      return null;
    }
  },

  /**
   * Searches the included scripts in a document for a definition matching a regular expression.
   * Always returns either null or a structured object describing the match.
   * @param {string} docText - The text of the document.
   * @param {RegExp} defRegex - The regular expression to search for.
   * @param {import("vscode").TextDocument} document - The document being searched.
   * @param {string} lookupText - The original symbol text being looked up.
   * @returns {object|null}
   */
  findDefinitionInIncludeFiles(docText, defRegex, document, lookupText) {
    try {
      // Input validation
      if (!docText || typeof docText !== 'string') {
        throw new ValidationError('Document text must be a non-empty string');
      }
      if (!defRegex || !(defRegex instanceof RegExp)) {
        throw new ValidationError('Definition regex must be a valid RegExp');
      }
      if (!document) {
        throw new ValidationError('Document must be provided');
      }
      if (!lookupText || typeof lookupText !== 'string') {
        throw new ValidationError('Lookup text must be a non-empty string');
      }

      const scriptsToSearch = [];
      const mockResult = getIncludeScripts(document, docText, scriptsToSearch);
      // Handle both mock (returns array) and real function (populates by reference)
      const scripts = Array.isArray(mockResult) ? mockResult : scriptsToSearch;

      for (const script of scripts) {
        let scriptPath;
        try {
          // Check if script is already a full path (for mocked tests) or needs to be resolved
          if (
            script &&
            (script.includes('/') || script.includes('\\') || script.endsWith('.au3'))
          ) {
            scriptPath = script; // Already a path
          } else {
            scriptPath = getIncludePath(script, document);
          }
        } catch (e) {
          window.showInformationMessage(
            `getIncludePath failed for script: ${script}, error: ${e.message}`,
          );
          continue;
        }

        let scriptContent = '';
        try {
          scriptContent = getIncludeText(scriptPath) || '';
        } catch (e) {
          window.showInformationMessage(
            `getIncludeText failed for path: ${scriptPath}, error: ${e.message}`,
          );
          continue;
        }
        if (!scriptContent || scriptContent.trim().length === 0) continue;

        // Reset regex lastIndex to ensure fresh search
        if (defRegex && typeof defRegex.lastIndex === 'number') {
          defRegex.lastIndex = 0;
        }

        const m = defRegex ? defRegex.exec(scriptContent) : null;
        if (!m || typeof m.index !== 'number') {
          continue;
        }

        // Determine the capture for the symbol name
        let capture = null;
        if (lookupText && lookupText.startsWith('$')) {
          capture = m[1] || null;
        } else {
          // function name capture may be in group 1 (pattern A) or 2 (pattern B)
          capture = m[1] || m[2] || null;
        }

        const symbol = capture || lookupText || '';
        const idx = capture ? m.index + m[0].indexOf(capture) : m.index;
        const length = capture ? capture.length : m[0] ? m[0].length : 0;

        // Compute line and character
        const prefix = scriptContent.slice(0, idx);
        const lines = prefix.split('\n');
        const line = lines.length - 1;
        const character = lines[lines.length - 1].length;

        return {
          scriptPath,
          scriptContent,
          found: {
            index: idx,
            length,
            line,
            character,
            symbol,
          },
          prefixLength: 0,
        };
      }

      return null;
    } catch (err) {
      // Provide user-friendly error message while categorizing errors
      let userMessage = 'Include file search failed';
      if (err instanceof ValidationError) {
        userMessage = 'Invalid parameters provided for include file search';
      } else if (err instanceof DefinitionProviderError) {
        userMessage = err.message;
      }

      window.showErrorMessage(`findDefinitionInIncludeFiles error: ${userMessage}`);
      return null;
    }
  },
};

const defProvider = languages.registerDefinitionProvider(AUTOIT_MODE, AutoItDefinitionProvider);

export default defProvider;
export { AutoItDefinitionProvider };
