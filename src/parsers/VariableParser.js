/**
 * Parses AutoIt source code to extract variable declarations with scope information
 * Based on MapParser.js structure and patterns
 */

import VariablePatterns from '../utils/VariablePatterns.js';
import {
  parseFunctionDeclarationLine,
  parseParameterNames,
} from '../utils/functionSignatureParsing.js';

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
    // Pattern to match keyword followed by comma-separated variables
    const pattern = new RegExp(`^\\s*${keyword}\\s+((\\$\\w+(?:\\s*,\\s*\\$\\w+)*))`, 'i');
    const match = cleanedLine.match(pattern);

    if (match) {
      const currentFunction = this.getFunctionAtLine(lineIndex);
      const variablesStr = match[1];

      // Split by comma and process each variable
      const variables = variablesStr
        .split(',')
        .map(v => v.trim())
        .filter(v => v);

      // Find keyword position to search from there
      const keywordMatch = cleanedLine.match(new RegExp(`^\\s*${keyword}`, 'i'));
      let searchFrom = keywordMatch ? keywordMatch[0].length : 0;

      variables.forEach(varName => {
        // Find the column position of this variable starting after the keyword
        const column = cleanedLine.indexOf(varName, searchFrom);
        // Update search position for next variable
        searchFrom = column + varName.length;

        this.variables.push({
          name: varName,
          type,
          scope: type === 'global' ? 'global' : 'function',
          functionName: currentFunction?.name || null,
          position: { line: lineIndex, column },
          declarationKeyword: keyword,
        });
      });
    }
  }

  /**
   * Parse Dim declarations (context-dependent: global at script level, local in functions)
   * @private
   */
  parseDimDeclarations(cleanedLine, lineIndex) {
    // Pattern to match Dim followed by comma-separated variables
    const pattern = /^[ \t]*Dim\s+((\$\w+(?:\s*,\s*\$\w+)*))/i;
    const match = cleanedLine.match(pattern);

    if (match) {
      const currentFunction = this.getFunctionAtLine(lineIndex);
      const variablesStr = match[1];

      // Determine scope based on context
      const isInFunction = !!currentFunction;
      const scope = isInFunction ? 'function' : 'global';

      // Split by comma and process each variable
      const variables = variablesStr
        .split(',')
        .map(v => v.trim())
        .filter(v => v);

      // Find Dim keyword position to search from there
      const keywordMatch = cleanedLine.match(/^[ \t]*Dim/i);
      let searchFrom = keywordMatch ? keywordMatch[0].length : 0;

      variables.forEach(varName => {
        // Find the column position of this variable starting after the keyword
        const column = cleanedLine.indexOf(varName, searchFrom);
        // Update search position for next variable
        searchFrom = column + varName.length;

        this.variables.push({
          name: varName,
          type: 'dim',
          scope,
          functionName: currentFunction?.name || null,
          position: { line: lineIndex, column },
          declarationKeyword: 'Dim',
        });
      });
    }
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
        // Must be in same function and declared before target line
        if (currentFunction && variable.functionName === currentFunction.name) {
          return variable.position.line <= targetLine;
        }
        // Not accessible if target is not in same function or no current function
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
