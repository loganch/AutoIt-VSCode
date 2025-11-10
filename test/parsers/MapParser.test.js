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

  describe('parseFunctionBoundaries', () => {
    it('should detect function start and end', () => {
      const source = `Func MyFunction()
    Local $x = 1
EndFunc`;
      const parser = new MapParser(source);
      const functions = parser.parseFunctionBoundaries();

      expect(functions).toHaveLength(1);
      expect(functions[0]).toMatchObject({
        name: 'MyFunction',
        startLine: 0,
        endLine: 2,
      });
    });

    it('should detect multiple functions', () => {
      const source = `Func First()
EndFunc

Func Second()
    Local $x = 1
EndFunc`;
      const parser = new MapParser(source);
      const functions = parser.parseFunctionBoundaries();

      expect(functions).toHaveLength(2);
      expect(functions[0].name).toBe('First');
      expect(functions[1].name).toBe('Second');
    });

    it('should detect function parameters', () => {
      const source = `Func ProcessUser($mUser, $name)
EndFunc`;
      const parser = new MapParser(source);
      const functions = parser.parseFunctionBoundaries();

      expect(functions).toHaveLength(1);
      expect(functions[0].parameters).toEqual(['$mUser', '$name']);
    });
  });

  describe('getFunctionAtLine', () => {
    it('should return function containing the line', () => {
      const source = `Func MyFunction()
    Local $x = 1
EndFunc`;
      const parser = new MapParser(source);
      parser.parseFunctionBoundaries();
      const func = parser.getFunctionAtLine(1);

      expect(func).toBeDefined();
      expect(func.name).toBe('MyFunction');
    });

    it('should return null for line outside functions', () => {
      const source = `Func MyFunction()
EndFunc
Local $x = 1`;
      const parser = new MapParser(source);
      parser.parseFunctionBoundaries();
      const func = parser.getFunctionAtLine(2);

      expect(func).toBeNull();
    });
  });

  describe('getKeysForMapAtLine', () => {
    it('should return keys for Map at specific line', () => {
      const source = `Local $mUser[]
$mUser.name = "John"
$mUser.age = 30
Local $x = $mUser.`;
      const parser = new MapParser(source);
      const keys = parser.getKeysForMapAtLine('$mUser', 3);

      expect(keys).toHaveLength(2);
      expect(keys).toContain('name');
      expect(keys).toContain('age');
    });

    it('should respect scope shadowing - closest wins', () => {
      const source = `Global $mConfig[]
$mConfig.apiKey = "global"

Func DoWork()
    Local $mConfig[]
    $mConfig.tempData = "local"
    Local $x = $mConfig.
EndFunc`;
      const parser = new MapParser(source);
      const keys = parser.getKeysForMapAtLine('$mConfig', 6);

      expect(keys).toHaveLength(1);
      expect(keys).toContain('tempData');
      expect(keys).not.toContain('apiKey');
    });

    it('should use global scope when outside functions', () => {
      const source = `Global $mConfig[]
$mConfig.apiKey = "global"

Func DoWork()
    Local $mConfig[]
    $mConfig.tempData = "local"
EndFunc

Local $x = $mConfig.`;
      const parser = new MapParser(source);
      const keys = parser.getKeysForMapAtLine('$mConfig', 8);

      expect(keys).toHaveLength(1);
      expect(keys).toContain('apiKey');
      expect(keys).not.toContain('tempData');
    });

    it('should only include assignments before the target line', () => {
      const source = `Local $mUser[]
$mUser.name = "John"
Local $x = $mUser.
$mUser.age = 30`;
      const parser = new MapParser(source);
      const keys = parser.getKeysForMapAtLine('$mUser', 2);

      expect(keys).toHaveLength(1);
      expect(keys).toContain('name');
      expect(keys).not.toContain('age');
    });

    it('should handle case-insensitive variable names', () => {
      const source = `Local $mUser[]
$mUser.name = "John"
$MUSER.age = 30
$muser.email = "test@example.com"
Local $x = $MuSeR.`;
      const parser = new MapParser(source);
      const keys = parser.getKeysForMapAtLine('$mUser', 4);

      expect(keys).toHaveLength(3);
      expect(keys).toContain('name');
      expect(keys).toContain('age');
      expect(keys).toContain('email');
    });

    it('should ignore commented assignments', () => {
      const source = `Local $mUser[]
$mUser.name = "John"
; $mUser.commented = "should not appear"
;$mUser.alsoCommented = "ignored"
$mUser.active = true
Local $x = $mUser.`;
      const parser = new MapParser(source);
      const keys = parser.getKeysForMapAtLine('$mUser', 5);

      expect(keys).toHaveLength(2);
      expect(keys).toContain('name');
      expect(keys).toContain('active');
      expect(keys).not.toContain('commented');
      expect(keys).not.toContain('alsoCommented');
    });

    it('should access global scope from function when no local shadowing', () => {
      const source = `Global $mConfig[]
$mConfig.apiKey = "global-key"
$mConfig.baseUrl = "https://api.example.com"

Func DoWork()
    ; No local $mConfig declaration - should see global
    Local $x = $mConfig.
EndFunc`;
      const parser = new MapParser(source);
      const keys = parser.getKeysForMapAtLine('$mConfig', 6);

      expect(keys).toHaveLength(2);
      expect(keys).toContain('apiKey');
      expect(keys).toContain('baseUrl');
    });
  });

  describe('getFunctionParameterKeys', () => {
    it('should detect keys added to Map parameter in function', () => {
      const source = `Func AddUserData($userMap)
    $userMap.name = "test"
    $userMap.id = 123
EndFunc`;
      const parser = new MapParser(source);
      const keys = parser.getFunctionParameterKeys('AddUserData', '$userMap');

      expect(keys).toHaveLength(2);
      expect(keys).toContainEqual({
        key: 'name',
        line: 1,
        addedInFunction: true,
      });
      expect(keys).toContainEqual({
        key: 'id',
        line: 2,
        addedInFunction: true,
      });
    });

    it('should return empty array for non-existent function', () => {
      const source = `Func MyFunc()
EndFunc`;
      const parser = new MapParser(source);
      const keys = parser.getFunctionParameterKeys('OtherFunc', '$map');

      expect(keys).toHaveLength(0);
    });

    it('should only return keys for specified parameter', () => {
      const source = `Func Process($mUser, $mData)
    $mUser.name = "test"
    $mData.value = 123
EndFunc`;
      const parser = new MapParser(source);
      const keys = parser.getFunctionParameterKeys('Process', '$mUser');

      expect(keys).toHaveLength(1);
      expect(keys[0].key).toBe('name');
    });
  });

  describe('getKeysFromFunctionCalls', () => {
    it('should detect keys added when Map is passed to function', () => {
      const source = `Func AddUserData($userMap)
    $userMap.name = "test"
    $userMap.id = 123
EndFunc

Local $mUser[]
AddUserData($mUser)
Local $x = $mUser.`;
      const parser = new MapParser(source);
      const keys = parser.getKeysFromFunctionCalls('$mUser', 7);

      expect(keys).toHaveLength(2);
      expect(keys[0].addedInFunction).toBe(true);
      expect(keys.map(k => k.key)).toContain('name');
      expect(keys.map(k => k.key)).toContain('id');
    });

    it('should only include function calls before target line', () => {
      const source = `Func AddData($map)
    $map.key1 = "value"
EndFunc

Local $mData[]
Local $x = $mData.
AddData($mData)`;
      const parser = new MapParser(source);
      const keys = parser.getKeysFromFunctionCalls('$mData', 5);

      expect(keys).toHaveLength(0);
    });

    it('should handle multiple function calls', () => {
      const source = `Func AddName($map)
    $map.name = "test"
EndFunc

Func AddId($map)
    $map.id = 123
EndFunc

Local $mUser[]
AddName($mUser)
AddId($mUser)
Local $x = $mUser.`;
      const parser = new MapParser(source);
      const keys = parser.getKeysFromFunctionCalls('$mUser', 11);

      expect(keys).toHaveLength(2);
      expect(keys.map(k => k.key)).toContain('name');
      expect(keys.map(k => k.key)).toContain('id');
    });
  });
});
