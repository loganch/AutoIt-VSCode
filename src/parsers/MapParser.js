/**
 * Parses AutoIt source code to extract Map variable information
 */
export default class MapParser {
  constructor(source) {
    this.source = source;
    this.lines = source.split('\n');
    this.functions = []; // Add this
  }

  /**
   * Parse Map declarations (Local/Global/Dim/Static $varName[])
   * @returns {Array<{name: string, scope: string, line: number}>}
   */
  parseMapDeclarations() {
    const declarations = [];
    const mapDeclPattern = /^\s*(Local|Global|Dim|Static)\s+(\$[a-zA-Z_]\w*)\s*\[\s*\]/i;

    this.lines.forEach((line, index) => {
      if (line.trim().startsWith(';')) return;
      const match = line.match(mapDeclPattern);
      if (match) {
        declarations.push({
          name: match[2],
          scope: match[1],
          line: index,
        });
      }
    });

    return declarations;
  }

  /**
   * Parse key assignments for a specific Map variable
   * @param {string} mapName - The Map variable name (e.g., '$mUser')
   * @returns {Array<{key: string, line: number, notation: string}>}
   */
  parseKeyAssignments(mapName) {
    const assignments = [];
    const escapedName = mapName.replace(/\$/g, '\\$');

    // Dot notation: $mUser.key = value
    const dotPattern = new RegExp(`^\\s*${escapedName}\\.(\\w+)\\s*=`, 'i');

    // Bracket notation: $mUser["key"] = value or $mUser['key'] = value
    const bracketPattern = new RegExp(`^\\s*${escapedName}\\[["']([^"']+)["']\\]\\s*=`, 'i');

    this.lines.forEach((line, index) => {
      if (line.trim().startsWith(';')) return;
      // Check dot notation
      const dotMatch = line.match(dotPattern);
      if (dotMatch) {
        assignments.push({
          key: dotMatch[1],
          line: index,
          notation: 'dot',
        });
        return;
      }

      // Check bracket notation
      const bracketMatch = line.match(bracketPattern);
      if (bracketMatch) {
        assignments.push({
          key: bracketMatch[1],
          line: index,
          notation: 'bracket',
        });
      }
    });

    return assignments;
  }

  /**
   * Parse function boundaries and parameters
   * @returns {Array<{name: string, startLine: number, endLine: number, parameters: string[]}>}
   */
  parseFunctionBoundaries() {
    this.functions = [];
    const funcStartPattern = /^\s*Func\s+(\w+)\s*\((.*?)\)/i;
    const funcEndPattern = /^\s*EndFunc/i;

    let currentFunc = null;

    this.lines.forEach((line, index) => {
      const funcStart = line.match(funcStartPattern);
      if (funcStart) {
        // Parse parameters
        const paramsStr = funcStart[2].trim();
        const parameters = paramsStr
          ? paramsStr.split(',').map(p => p.trim().split('=')[0].trim())
          : [];

        currentFunc = {
          name: funcStart[1],
          startLine: index,
          endLine: -1,
          parameters,
        };
        return;
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
   * Get the function containing a specific line
   * @param {number} line - Line number
   * @returns {object|null} Function object or null
   */
  getFunctionAtLine(line) {
    if (this.functions.length === 0) {
      this.parseFunctionBoundaries();
    }

    return this.functions.find(func => line >= func.startLine && line <= func.endLine) || null;
  }

  /**
   * Get all keys for a Map variable at a specific line (scope-aware)
   * @param {string} mapName - The Map variable name
   * @param {number} targetLine - The line where completion is requested
   * @returns {string[]} Array of key names
   */
  getKeysForMapAtLine(mapName, targetLine) {
    // Ensure functions are parsed
    if (this.functions.length === 0) {
      this.parseFunctionBoundaries();
    }

    // Find the closest Map declaration to targetLine
    const declarations = this.parseMapDeclarations();
    const currentFunc = this.getFunctionAtLine(targetLine);

    let closestDecl = null;
    let closestDistance = Infinity;

    for (const decl of declarations) {
      if (decl.name.toLowerCase() !== mapName.toLowerCase()) continue;
      if (decl.line > targetLine) continue; // Must be before target

      // Check if declaration is in same scope
      const declFunc = this.getFunctionAtLine(decl.line);

      // If target is in a function, only consider declarations in same function or global
      if (currentFunc) {
        if (declFunc && declFunc.name === currentFunc.name) {
          // Same function - local takes precedence
          const distance = targetLine - decl.line;
          if (distance < closestDistance) {
            closestDistance = distance;
            closestDecl = decl;
          }
        } else if (!declFunc && decl.scope.toLowerCase() === 'global') {
          // Global declaration, but only use if no local found
          if (closestDecl === null || closestDecl.scope.toLowerCase() !== 'local') {
            const distance = targetLine - decl.line;
            if (distance < closestDistance) {
              closestDistance = distance;
              closestDecl = decl;
            }
          }
        }
      } else {
        // Target is outside functions, only consider global scope
        if (!declFunc) {
          const distance = targetLine - decl.line;
          if (distance < closestDistance) {
            closestDistance = distance;
            closestDecl = decl;
          }
        }
      }
    }

    if (!closestDecl) {
      return [];
    }

    // Get all assignments for this Map in the same scope, before targetLine
    const assignments = this.parseKeyAssignments(mapName);
    const validKeys = new Set();

    for (const assignment of assignments) {
      if (assignment.line >= targetLine) continue; // Must be before target

      const assignFunc = this.getFunctionAtLine(assignment.line);

      // Check if assignment is in same scope as the declaration we're using
      if (currentFunc) {
        if (assignFunc && assignFunc.name === currentFunc.name) {
          validKeys.add(assignment.key);
        } else if (!assignFunc && closestDecl.scope.toLowerCase() === 'global') {
          validKeys.add(assignment.key);
        }
      } else {
        if (!assignFunc) {
          validKeys.add(assignment.key);
        }
      }
    }

    return Array.from(validKeys);
  }

  /**
   * Get keys added to a Map parameter within a function
   * @param {string} functionName - Function name
   * @param {string} parameterName - Parameter variable name
   * @returns {Array<{key: string, line: number, addedInFunction: boolean}>}
   */
  getFunctionParameterKeys(functionName, parameterName) {
    if (this.functions.length === 0) {
      this.parseFunctionBoundaries();
    }

    const func = this.functions.find(f => f.name === functionName);
    if (!func || !func.parameters.includes(parameterName)) {
      return [];
    }

    const assignments = this.parseKeyAssignments(parameterName);
    return assignments
      .filter(a => a.line >= func.startLine && a.line <= func.endLine)
      .map(a => ({
        key: a.key,
        line: a.line,
        addedInFunction: true,
      }));
  }

  /**
   * Get keys added to a Map via function calls
   * @param {string} mapName - The Map variable name
   * @param {number} targetLine - The line where completion is requested
   * @returns {Array<{key: string, addedInFunction: boolean}>}
   */
  getKeysFromFunctionCalls(mapName, targetLine) {
    if (this.functions.length === 0) {
      this.parseFunctionBoundaries();
    }

    const functionCallPattern = /^\s*(\w+)\s*\((.*?)\)/;
    const keys = [];
    const seenKeys = new Set();

    this.lines.forEach((line, index) => {
      if (index >= targetLine) return; // Only before target

      const match = line.match(functionCallPattern);
      if (!match) return;

      const funcName = match[1];
      const args = match[2].split(',').map(a => a.trim());

      // Check if our Map is passed as an argument
      const argIndex = args.indexOf(mapName);
      if (argIndex === -1) return;

      // Find the function definition
      const func = this.functions.find(f => f.name === funcName);
      if (!func || argIndex >= func.parameters.length) return;

      const paramName = func.parameters[argIndex];
      const paramKeys = this.getFunctionParameterKeys(funcName, paramName);

      paramKeys.forEach(k => {
        if (!seenKeys.has(k.key)) {
          seenKeys.add(k.key);
          keys.push({
            key: k.key,
            addedInFunction: true,
          });
        }
      });
    });

    return keys;
  }
}
