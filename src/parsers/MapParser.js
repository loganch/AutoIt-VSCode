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
          line: index
        });
      }
    });

    return declarations;
  }
}
