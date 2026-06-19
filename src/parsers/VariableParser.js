/**
 * Parses AutoIt source code to extract variable declarations with scope information
 * Based on MapParser.js structure and patterns
 */

import VariablePatterns from '../utils/VariablePatterns.js';
import {
  parseFunctionDeclarationLine,
  parseParameterNames,
} from '../utils/functionSignatureParsing.js';

/**
 * Split a string by commas that are not inside parentheses or brackets.
 * Needed to correctly separate multi-declaration variables that have initializers
 * containing function calls, e.g. `$a = Func(1, 2), $b = Other()`.
 * @param {string} str
 * @returns {string[]}
 */
function splitByTopLevelCommas(str) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    else if (ch === ',' && depth === 0) {
      parts.push(str.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(str.slice(start));
  return parts;
}

class VariableParser {
  constructor(source, filePath = '') {
    this.source = source;
    this.filePath = filePath;
    this.lines = source.split('\n');
    this.patterns = new VariablePatterns();
    this.functions = []; // Populated by parseFunctionBoundaries()
    this.variables = []; // Populated by parseVariableDeclarations()
  }

  /**
   * Parse function boundaries and extract function names and parameters
   * Reuses logic from MapParser.parseFunctionBoundaries()
   * @returns {Array<{name: string, startLine: number, endLine: number, parameters: string[]}>}
   */
  parseFunctionBoundaries() {
    this.functions = [];
    const funcEndPattern = /^\s*EndFunc/i;

    let currentFunc = null;

    this.lines.forEach((line, index) => {
      const funcDeclaration = parseFunctionDeclarationLine(line);
      if (funcDeclaration) {
        // Parse parameters from function signature
        const parameters = parseParameterNames(funcDeclaration.paramsText, true);

        currentFunc = {
          name: funcDeclaration.functionName,
          startLine: index,
          endLine: -1,
          parameters,
        };
      }

      const funcEnd = line.match(funcEndPattern);
      if (funcEnd && currentFunc) {
        currentFunc.endLine = index;
        this.functions.push(currentFunc);
        currentFunc = null;
      }
    });

    return this.functions;
  }

  /**
   * Parse all variable declarations (Global, Local, Static, Dim)
   * Also includes function parameters as variables
   * @returns {Array<{name: string, type: string, scope: string, functionName: string|null, position: {line: number, column: number}, declarationKeyword: string}>}
   */
  parseVariableDeclarations() {
    this.variables = [];

    // Ensure function boundaries are parsed first
    if (this.functions.length === 0) {
      this.parseFunctionBoundaries();
    }

    // Parse explicit declarations and parameters
    this.lines.forEach((line, lineIndex) => {
      // Skip comment lines
      if (this.patterns.isComment(line)) {
        return;
      }

      // Clean line for analysis
      const cleanedLine = this.patterns.cleanLine(line);

      // Parse Global declarations
      this.parseExplicitDeclarations(cleanedLine, lineIndex, 'Global', 'global');

      // Parse Local declarations
      this.parseExplicitDeclarations(cleanedLine, lineIndex, 'Local', 'local');

      // Parse Static declarations
      this.parseExplicitDeclarations(cleanedLine, lineIndex, 'Static', 'static');

      // Parse Dim declarations (context-dependent)
      this.parseDimDeclarations(cleanedLine, lineIndex);

      // Parse bare assignments ($var = value, no scope keyword)
      this.parseAssignments(cleanedLine, lineIndex);

      // Parse function parameters as variables
      this.parseFunctionParameters(line, lineIndex);
    });

    return this.variables;
  }

  /**
   * Parse explicit declarations (Global, Local, Static)
   * @private
   */
  parseExplicitDeclarations(cleanedLine, lineIndex, keyword, type) {
    const headerPattern = new RegExp(`^\\s*${keyword}\\s+`, 'i');
    const headerMatch = cleanedLine.match(headerPattern);
    if (!headerMatch) return;

    const currentFunction = this.getFunctionAtLine(lineIndex);
    const afterKeyword = cleanedLine.slice(headerMatch[0].length);

    this._pushDeclarationSegments(cleanedLine, afterKeyword, headerMatch[0].length, lineIndex, {
      type,
      scope: type === 'global' ? 'global' : 'function',
      functionName: currentFunction?.name || null,
      declarationKeyword: keyword,
    });
  }

  /**
   * Parse Dim declarations (context-dependent: global at script level, local in functions)
   * @private
   */
  parseDimDeclarations(cleanedLine, lineIndex) {
    const headerMatch = cleanedLine.match(/^[ \t]*Dim\s+/i);
    if (!headerMatch) return;

    const currentFunction = this.getFunctionAtLine(lineIndex);
    const afterKeyword = cleanedLine.slice(headerMatch[0].length);

    this._pushDeclarationSegments(cleanedLine, afterKeyword, headerMatch[0].length, lineIndex, {
      type: 'dim',
      scope: currentFunction ? 'function' : 'global',
      functionName: currentFunction?.name || null,
      declarationKeyword: 'Dim',
    });
  }

  /**
   * Shared loop: split afterKeyword by top-level commas, extract each $var, push to this.variables.
   * @private
   */
  _pushDeclarationSegments(cleanedLine, afterKeyword, searchFromOffset, lineIndex, varMeta) {
    const segments = splitByTopLevelCommas(afterKeyword);
    let searchFrom = searchFromOffset;

    segments.forEach(segment => {
      const varMatch = segment.trimStart().match(/^\$\w+/);
      if (!varMatch) return;

      const varName = varMatch[0];
      const column = cleanedLine.indexOf(varName, searchFrom);
      searchFrom = column + varName.length;

      this.variables.push({
        name: varName,
        position: { line: lineIndex, column },
        ...varMeta,
      });
    });
  }

  /**
   * Parse bare variable assignments that have no scope keyword (e.g. `$var = value`).
   * Script-level bare assignments are treated as global; ones inside a function are local.
   * Only fires when `$` is the first non-whitespace character so lines that start with
   * Local/Global/Static/Dim are never double-counted.
   * @private
   */
  parseAssignments(cleanedLine, lineIndex) {
    const match = cleanedLine.match(/^\s*(\$\w+)\s*=/);
    if (!match) return;

    const currentFunction = this.getFunctionAtLine(lineIndex);
    const varName = match[1];
    const functionName = currentFunction?.name || null;

    // Only register the first assignment — subsequent ones are usages, not new declarations
    const alreadyDeclared = this.variables.some(
      v => v.name === varName && v.functionName === functionName,
    );
    if (alreadyDeclared) return;

    const column = cleanedLine.indexOf(varName);

    this.variables.push({
      name: varName,
      type: 'assignment',
      scope: currentFunction ? 'function' : 'global',
      functionName,
      position: { line: lineIndex, column },
      declarationKeyword: null,
    });
  }

  /**
   * Parse function parameters as variables within the function scope
   * @private
   */
  parseFunctionParameters(line, lineIndex) {
    const funcDeclaration = parseFunctionDeclarationLine(line);
    if (!funcDeclaration) {
      return;
    }

    const { functionName, paramsText: paramsStr, paramsStartIndex } = funcDeclaration;

    if (!paramsStr) {
      return; // No parameters
    }

    // Parse parameter list
    const parameters = parseParameterNames(paramsStr, true);

    // Find opening parenthesis to search from there
    let searchFrom = paramsStartIndex;

    // Add each parameter as a variable
    parameters.forEach(param => {
      // Find the column position starting after the opening parenthesis
      const column = line.indexOf(param, searchFrom);
      // Update search position for next parameter
      searchFrom = column + param.length;

      this.variables.push({
        name: param,
        type: 'parameter',
        scope: 'function',
        functionName,
        position: { line: lineIndex, column },
        declarationKeyword: null, // Parameters don't have declaration keywords
      });
    });
  }

  /**
   * Get the function containing a specific line
   * @param {number} lineIndex - Line number (0-based)
   * @returns {object|null} Function object or null
   */
  getFunctionAtLine(lineIndex) {
    if (this.functions.length === 0) {
      this.parseFunctionBoundaries();
    }

    return (
      this.functions.find(func => lineIndex >= func.startLine && lineIndex <= func.endLine) || null
    );
  }

  /**
   * Get variables accessible at a specific line (scope-aware)
   * @param {number} targetLine - The line number where completion is requested (0-based)
   * @returns {Array<{name: string, type: string, scope: string, functionName: string|null, position: {line: number, column: number}}>}
   */
  getVariablesAtLine(targetLine) {
    // Ensure variables are parsed
    if (this.variables.length === 0) {
      this.parseVariableDeclarations();
    }

    const currentFunction = this.getFunctionAtLine(targetLine);

    return this.variables.filter(variable => {
      // Global variables (scope === 'global') are always accessible
      if (variable.scope === 'global') {
        return true;
      }

      // Function-scoped variables are only accessible within their function
      if (variable.scope === 'function') {
        // Script-level declaration (no enclosing function) — visible at script level only
        if (!currentFunction && variable.functionName === null) {
          return variable.position.line <= targetLine;
        }
        // Must be in same function and declared before target line
        if (currentFunction && variable.functionName === currentFunction.name) {
          return variable.position.line <= targetLine;
        }
        return false;
      }

      return false;
    });
  }

  /**
   * Get all variables (no scope filtering)
   * @returns {Array}
   */
  getAllVariables() {
    if (this.variables.length === 0) {
      this.parseVariableDeclarations();
    }
    return this.variables;
  }
}

export default VariableParser;
