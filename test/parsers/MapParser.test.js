import MapParser from '../../src/parsers/MapParser.js';

describe('MapParser', () => {
  describe('parseMapDeclarations', () => {
    it('should detect Local Map declaration', () => {
      const source = 'Local $mUser[]';
      const parser = new MapParser(source);
      const maps = parser.parseMapDeclarations();

      expect(maps).toHaveLength(1);
      expect(maps[0]).toMatchObject({
        name: '$mUser',
        scope: 'Local',
        line: 0,
      });
    });

    it('should detect Global Map declaration', () => {
      const source = 'Global $mConfig[]';
      const parser = new MapParser(source);
      const maps = parser.parseMapDeclarations();

      expect(maps).toHaveLength(1);
      expect(maps[0]).toMatchObject({
        name: '$mConfig',
        scope: 'Global',
        line: 0,
      });
    });

    it('should detect multiple Map declarations', () => {
      const source = `Local $mUser[]
Global $mData[]
Dim $mSettings[]`;
      const parser = new MapParser(source);
      const maps = parser.parseMapDeclarations();

      expect(maps).toHaveLength(3);
      expect(maps[0].name).toBe('$mUser');
      expect(maps[1].name).toBe('$mData');
      expect(maps[2].name).toBe('$mSettings');
    });
  });
});
