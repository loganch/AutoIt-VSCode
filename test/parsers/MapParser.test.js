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

  describe('parseKeyAssignments', () => {
    it('should detect dot notation key assignments', () => {
      const source = `Local $mUser[]
$mUser.name = "John"
$mUser.age = 30`;
      const parser = new MapParser(source);
      const assignments = parser.parseKeyAssignments('$mUser');

      expect(assignments).toHaveLength(2);
      expect(assignments).toContainEqual({
        key: 'name',
        line: 1,
        notation: 'dot',
      });
      expect(assignments).toContainEqual({
        key: 'age',
        line: 2,
        notation: 'dot',
      });
    });

    it('should detect bracket notation key assignments', () => {
      const source = `Local $mUser[]
$mUser["email"] = "test@example.com"
$mUser['phone'] = "555-1234"`;
      const parser = new MapParser(source);
      const assignments = parser.parseKeyAssignments('$mUser');

      expect(assignments).toHaveLength(2);
      expect(assignments).toContainEqual({
        key: 'email',
        line: 1,
        notation: 'bracket',
      });
      expect(assignments).toContainEqual({
        key: 'phone',
        line: 2,
        notation: 'bracket',
      });
    });

    it('should detect mixed notation assignments', () => {
      const source = `Local $mData[]
$mData.prop1 = "value"
$mData["prop2"] = 123`;
      const parser = new MapParser(source);
      const assignments = parser.parseKeyAssignments('$mData');

      expect(assignments).toHaveLength(2);
      expect(assignments[0].key).toBe('prop1');
      expect(assignments[1].key).toBe('prop2');
    });

    it('should ignore assignments to other variables', () => {
      const source = `Local $mUser[]
$mUser.name = "John"
$mOther.key = "value"`;
      const parser = new MapParser(source);
      const assignments = parser.parseKeyAssignments('$mUser');

      expect(assignments).toHaveLength(1);
      expect(assignments[0].key).toBe('name');
    });
  });
});
