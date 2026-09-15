jest.mock('vscode', () => ({
  Range: class Range {
    constructor(start, end) {
      this.start = start;
      this.end = end;
    }
  },
}));

const {
  stripLineComment,
  stringMask,
  blankStrings,
  findEnclosingFunctionInDocument,
  isInComment,
  rangeContainsRange,
  isLocalDeclaredInBody,
} = require('../../src/utils/textUtils');

describe('stripLineComment', () => {
  test('strips a trailing comment', () => {
    expect(stripLineComment('$x = 1 ; a comment')).toBe('$x = 1 ');
  });

  test('ignores a semicolon inside a double-quoted string', () => {
    expect(stripLineComment('$x = "a;b" ; real comment')).toBe('$x = "a;b" ');
  });

  test('ignores a semicolon inside a single-quoted string', () => {
    expect(stripLineComment("$x = 'a;b' ; real comment")).toBe("$x = 'a;b' ");
  });

  test('returns the line unchanged when there is no comment', () => {
    expect(stripLineComment('$x = 1')).toBe('$x = 1');
  });
});

describe('stringMask', () => {
  test('marks quote characters and their contents as true, code as false', () => {
    expect(stringMask('a"bc"d')).toEqual([false, true, true, true, true, false]);
  });

  test('returns an all-false mask for a line with no quotes', () => {
    expect(stringMask('abc')).toEqual([false, false, false]);
  });

  test('handles nested quote-type switching (single inside double, and vice versa)', () => {
    expect(stringMask(`"it's"`)).toEqual([true, true, true, true, true, true]);
  });
});

describe('blankStrings', () => {
  test('replaces quoted string contents with spaces, preserving length', () => {
    const line = '$x = "secret" & 1';
    const result = blankStrings(line);
    expect(result).toHaveLength(line.length);
    expect(result).toBe('$x =          & 1');
  });

  test('leaves a line with no quotes unchanged', () => {
    expect(blankStrings('$x = 1')).toBe('$x = 1');
  });
});

describe('isInComment', () => {
  const makeLine = text => ({ text, firstNonWhitespaceCharacterIndex: text.search(/\S/) });
  const makeDocument = lines => ({
    lineAt: jest.fn(i => makeLine(lines[i])),
  });

  test('returns true for a line starting with a semicolon comment', () => {
    const document = makeDocument(['  ; a comment']);
    expect(isInComment(document, { line: 0 })).toBe(true);
  });

  test('returns false for a plain code line', () => {
    const document = makeDocument(['$x = 1']);
    expect(isInComment(document, { line: 0 })).toBe(false);
  });

  test('returns true for a line inside a #cs/#ce block', () => {
    const document = makeDocument(['#cs', '$x = 1', '#ce']);
    expect(isInComment(document, { line: 1 })).toBe(true);
  });

  test('returns false for a line after the matching #ce', () => {
    const document = makeDocument(['#cs', '$x = 1', '#ce', '$y = 2']);
    expect(isInComment(document, { line: 3 })).toBe(false);
  });
});

describe('findEnclosingFunctionInDocument', () => {
  const makeDocument = lines => ({
    lineCount: lines.length,
    lineAt: jest.fn(i => ({
      text: lines[i],
      range: { start: { line: i, character: 0 }, end: { line: i, character: lines[i].length } },
    })),
  });

  test('finds the enclosing Func/EndFunc range for a position inside the body', () => {
    const lines = ['Func MyFunc()', '  $x = 1', 'EndFunc'];
    const document = makeDocument(lines);

    const range = findEnclosingFunctionInDocument(document, { line: 1 });

    expect(range.start.line).toBe(0);
    expect(range.end.line).toBe(2);
  });

  test('returns null when the position is outside any function', () => {
    const lines = ['Func MyFunc()', 'EndFunc', '$x = 1'];
    const document = makeDocument(lines);

    expect(findEnclosingFunctionInDocument(document, { line: 2 })).toBeNull();
  });

  test('returns null when there is no matching EndFunc', () => {
    const lines = ['Func MyFunc()', '  $x = 1'];
    const document = makeDocument(lines);

    expect(findEnclosingFunctionInDocument(document, { line: 1 })).toBeNull();
  });
});

describe('rangeContainsRange', () => {
  const pos = (line, character) => ({ line, character });
  const range = (start, end) => ({ start, end });

  test('returns true when the inner range lies fully within the outer range', () => {
    const outer = range(pos(0, 0), pos(5, 0));
    const inner = range(pos(1, 0), pos(2, 0));
    expect(rangeContainsRange(outer, inner)).toBe(true);
  });

  test('returns false when the inner range starts before the outer range', () => {
    const outer = range(pos(1, 0), pos(5, 0));
    const inner = range(pos(0, 0), pos(2, 0));
    expect(rangeContainsRange(outer, inner)).toBe(false);
  });

  test('returns false when the inner range ends after the outer range', () => {
    const outer = range(pos(0, 0), pos(3, 0));
    const inner = range(pos(0, 0), pos(4, 0));
    expect(rangeContainsRange(outer, inner)).toBe(false);
  });
});

describe('isLocalDeclaredInBody', () => {
  test('returns true when the name is declared Local', () => {
    expect(isLocalDeclaredInBody('Local $x = 1', '$x')).toBe(true);
  });

  test('returns true when the name is a function parameter', () => {
    expect(isLocalDeclaredInBody('Func MyFunc($x)', '$x')).toBe(true);
  });

  test('returns false when the name is not declared or a parameter', () => {
    expect(isLocalDeclaredInBody('Local $y = 1', '$x')).toBe(false);
  });

  test('ignores mentions inside comments and strings', () => {
    expect(isLocalDeclaredInBody('; Local $x is not real\n$x = "Local $x"', '$x')).toBe(false);
  });
});
