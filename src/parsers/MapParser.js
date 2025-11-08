/**
 * Parses AutoIt source code to extract Map variable information
 */
export default class MapParser {
  constructor(source) {
    this.source = source;
    this.lines = source.split('\n');
  }

  /**
   * Parse Map declarations (Local/Global/Dim/Static $varName[])
   * @returns {Array<{name: string, scope: string, line: number}>}
   */
  parseMapDeclarations() {
    const declarations = [];
    const mapDeclPattern = /^\s*(Local|Global|Dim|Static)\s+(\$[a-zA-Z_]\w*)\s*\[\s*\]/i;

    this.lines.forEach((line, index) => {
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
      // Check dot notation
      const dotMatch = line.match(dotPattern);
      if (dotMatch) {
        assignments.push({
          key: dotMatch[1],
          line: index,
          notation: 'dot'
        });
        return;
      }

      // Check bracket notation
      const bracketMatch = line.match(bracketPattern);
      if (bracketMatch) {
        assignments.push({
          key: bracketMatch[1],
          line: index,
          notation: 'bracket'
        });
      }
    });

    return assignments;
  }
}
