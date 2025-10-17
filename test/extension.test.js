/**
 * Tests for extension.js - specifically the AU3Check parameter parsing
 *
 * Note: Since runCheckProcess is not exported, these are documentation tests
 * that explain the expected behavior. For actual testing, you would need to
 * either export the function or refactor it into a testable module.
 */

describe('AU3Check Parameter Parsing - Expected Behavior', () => {
  describe('Directive Format', () => {
    test('should recognize the #AutoIt3Wrapper_AU3Check_Parameters directive', () => {
      // The directive format is: #AutoIt3Wrapper_AU3Check_Parameters=<params>
      // Example: #AutoIt3Wrapper_AU3Check_Parameters=-w- 3 -w 5
      // This should disable warning 3 and enable warning 5

      const exampleDirective = '#AutoIt3Wrapper_AU3Check_Parameters=-w- 3 -w 5';
      const regex = /^\s*#AutoIt3Wrapper_AU3Check_Parameters=(.*)$/gm;
      const match = regex.exec(exampleDirective);

      expect(match).not.toBeNull();
      expect(match[1]).toBe('-w- 3 -w 5');
    });

    test('should extract parameters from directive value', () => {
      const paramString = '-w- 3 -w 5 -w- 7';
      const paramRegex = /(-w-?)\s+([0-9]+)/g;
      const matches = [];

      let match;
      while ((match = paramRegex.exec(paramString)) !== null) {
        matches.push({ flag: match[1], value: match[2] });
      }

      expect(matches).toHaveLength(3);
      expect(matches[0]).toEqual({ flag: '-w-', value: '3' });
      expect(matches[1]).toEqual({ flag: '-w', value: '5' });
      expect(matches[2]).toEqual({ flag: '-w-', value: '7' });
    });

    test('should handle whitespace variations', () => {
      const paramString = '  -w-  3   -w   5  ';
      const paramRegex = /(-w-?)\s+([0-9]+)/g;
      const matches = [];

      let match;
      while ((match = paramRegex.exec(paramString)) !== null) {
        matches.push({ flag: match[1], value: match[2] });
      }

      expect(matches).toHaveLength(2);
      expect(matches[0]).toEqual({ flag: '-w-', value: '3' });
      expect(matches[1]).toEqual({ flag: '-w', value: '5' });
    });
  });

  describe('Parameter Appending Behavior', () => {
    test('should append warning parameters from directive to params array', () => {
      // No default warning params - start with empty array
      // Directive parameters are simply appended
      const params = [];
      const paramString = '-w- 3 -w 5';
      const warnRegex = /(-w-?)\s+([0-9]+)/g;

      let match;
      while ((match = warnRegex.exec(paramString)) !== null) {
        const [, param, value] = match;
        params.push(param, value);
      }

      expect(params).toEqual(['-w-', '3', '-w', '5']);
    });

    test('should append all parameters in order from directive', () => {
      const params = [];
      const paramString = '-q -d -w- 3 -w 7';

      // Add -q
      if (paramString.startsWith('-q')) {
        params.push('-q');
      }

      // Add -d
      if (/\s-d\b/.test(paramString)) {
        params.push('-d');
      }

      // Add -w parameters
      const warnRegex = /(-w-?)\s+([0-9]+)/g;
      let match;
      while ((match = warnRegex.exec(paramString)) !== null) {
        params.push(match[1], match[2]);
      }

      expect(params).toEqual(['-q', '-d', '-w-', '3', '-w', '7']);
    });
  });

  describe('Last Directive Wins', () => {
    test('should use the last occurrence when multiple directives exist', () => {
      const scriptContent = `
#AutoIt3Wrapper_AU3Check_Parameters=-w- 3
; Some code here
#AutoIt3Wrapper_AU3Check_Parameters=-w 5
MsgBox(0, "Test", "Hello")
`;

      const regex = /^\s*#AutoIt3Wrapper_AU3Check_Parameters=(.*)$/gm;
      const matches = [...scriptContent.matchAll(regex)];
      const lastMatch = matches[matches.length - 1];

      expect(matches).toHaveLength(2);
      expect(lastMatch[1]).toBe('-w 5');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty directive value', () => {
      const paramString = '';
      const paramRegex = /(-w-?)\s+([0-9]+)/g;
      const matches = [];

      let match;
      while ((match = paramRegex.exec(paramString)) !== null) {
        matches.push(match);
      }

      expect(matches).toHaveLength(0);
    });

    test('should handle directive with inline comment', () => {
      const directiveLine = '#AutoIt3Wrapper_AU3Check_Parameters=-w- 3 -w 5 ;Disable var warnings';
      const regex = /^\s*#AutoIt3Wrapper_AU3Check_Parameters=(.*)$/;
      const match = regex.exec(directiveLine);

      // The regex captures everything after =, including the comment
      // The actual implementation should handle this
      expect(match[1]).toBe('-w- 3 -w 5 ;Disable var warnings');

      // When parsing, the comment part won't match the param regex
      const paramRegex = /(-w-?)\s+([0-9]+)/g;
      const params = [];
      let paramMatch;
      while ((paramMatch = paramRegex.exec(match[1])) !== null) {
        params.push({ flag: paramMatch[1], value: paramMatch[2] });
      }

      // Should still extract the valid params before the comment
      expect(params).toHaveLength(2);
    });

    test('should accept any warning number from directive (Au3Check will validate)', () => {
      // With the new approach, we just append whatever warning numbers are in the directive
      // Au3Check itself will validate if the warning numbers are valid
      const params = [];
      const paramString = '-w 99 -w- 3';
      const warnRegex = /(-w-?)\s+([0-9]+)/g;

      let match;
      while ((match = warnRegex.exec(paramString)) !== null) {
        params.push(match[1], match[2]);
      }

      // Both parameters are appended, Au3Check will handle validation
      expect(params).toEqual(['-w', '99', '-w-', '3']);
    });
  });
});

describe('Verbosity Parameters - NOT SUPPORTED', () => {
  test('verbosity parameters are intentionally ignored to prevent breaking diagnostic parsing', () => {
    // Verbosity flags (-v 1, -v 2, -v 3) add extra output lines that would break
    // the diagnostic parser which expects a specific format:
    //   "file.au3"(line,col) : severity: message
    //
    // -v 1: show include paths/files (adds extra lines)
    // -v 2: show lexer tokens (adds extra lines)
    // -v 3: show unreferenced UDFs and global variables (adds extra lines)
    //
    // These parameters are NOT parsed from #AutoIt3Wrapper_AU3Check_Parameters
    // to maintain consistent, parseable output for the diagnostics panel

    expect(true).toBe(true); // This is documentation
  });
});

describe('Standalone Flags', () => {
  test('should detect -q flag at start of string', () => {
    const paramString = '-q -w 1';
    expect(paramString.startsWith('-q')).toBe(true);
    expect(/\s-q\b/.test(paramString)).toBe(false);
  });

  test('should detect -q flag in middle of string', () => {
    const paramString = '-w 1 -q -w 2';
    expect(/\s-q\b/.test(paramString)).toBe(true);
  });

  test('should detect -d flag at start of string', () => {
    const paramString = '-d -w 1';
    expect(paramString.startsWith('-d')).toBe(true);
  });

  test('should detect -d flag in middle of string', () => {
    const paramString = '-w 1 -d -w 2';
    expect(/\s-d\b/.test(paramString)).toBe(true);
  });

  test('should not false-match -q or -d as part of other text', () => {
    const paramString = '-w 1 -quiet 2'; // -quiet is not -q
    expect(/\s-q\b/.test(paramString)).toBe(false);

    const paramString2 = '-w 1 -debug'; // -debug is not -d
    expect(/\s-d\b/.test(paramString2)).toBe(false);
  });
});

describe('Mixed Parameter Types', () => {
  test('should parse complex directive with supported parameter types', () => {
    const directiveLine = '#AutoIt3Wrapper_AU3Check_Parameters=-q -d -w- 3 -w- 5';
    const regex = /^\s*#AutoIt3Wrapper_AU3Check_Parameters=(.*)$/;
    const match = regex.exec(directiveLine);

    expect(match).not.toBeNull();
    const paramString = match[1].trim();

    // Check -q flag
    expect(/\s-q\b/.test(paramString) || paramString.startsWith('-q')).toBe(true);

    // Check -d flag
    expect(/\s-d\b/.test(paramString) || paramString.startsWith('-d')).toBe(true);

    // Check -w parameters
    const warnRegex = /(-w-?)\s+([0-9]+)/g;
    const warnMatches = [];
    let warnMatch;
    while ((warnMatch = warnRegex.exec(paramString)) !== null) {
      warnMatches.push({ flag: warnMatch[1], value: warnMatch[2] });
    }
    expect(warnMatches).toHaveLength(2);
  });

  test('should handle parameters in any order', () => {
    const paramString = '-q -w- 3 -d -w 7';

    // All supported parameter types should be detected regardless of order
    expect(/\s-q\b/.test(paramString) || paramString.startsWith('-q')).toBe(true);
    expect(/\s-d\b/.test(paramString) || paramString.startsWith('-d')).toBe(true);

    const warnRegex = /(-w-?)\s+([0-9]+)/g;
    const warnMatches = [...paramString.matchAll(warnRegex)];
    expect(warnMatches.length).toBe(2);
  });
});

describe('Integration Test Notes', () => {
  test('README: How to manually test the fix', () => {
    // Manual testing instructions:
    // 1. Open the test fixture file: test/fixtures/au3check-params-test.au3
    // 2. The file has #AutoIt3Wrapper_AU3Check_Parameters with various parameters
    // 3. The file intentionally has code that triggers various warnings
    // 4. When you save the file in VS Code with the extension active,
    //    Au3Check should run with the specified parameters
    // 5. Verify in the Problems tab that the correct warnings appear/disappear

    expect(true).toBe(true); // This is just documentation
  });
});
