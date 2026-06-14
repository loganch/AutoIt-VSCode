const path = require('path');

class MockPosition {
  constructor(line, character) {
    this.line = line;
    this.character = character;
  }
}

class MockRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

class MockTextDocument {
  constructor(text) {
    this._text = text;
    const lines = text.split(/\r?\n/);
    this._lineOffsets = new Array(lines.length);
    let offset = 0;
    for (let i = 0; i < lines.length; i++) {
      this._lineOffsets[i] = offset;
      offset += lines[i].length + 1;
    }
  }

  lineAt(lineNo) {
    const start = this._lineOffsets[lineNo];
    const end = lineNo + 1 < this._lineOffsets.length ? this._lineOffsets[lineNo + 1] - 1 : this._text.length;
    const text = this._text.substring(start, end);
    return { text, range: new MockRange(new MockPosition(lineNo, 0), new MockPosition(lineNo, text.length)) };
  }

  positionAt(offset) {
    if (offset < 0) offset = 0;
    if (offset > this._text.length) offset = this._text.length;
    let line = 0;
    for (let i = 0; i < this._lineOffsets.length; i++) {
      if (this._lineOffsets[i] <= offset) line = i;
      else break;
    }
    return new MockPosition(line, offset - this._lineOffsets[line]);
  }

  offsetAt(position) {
    return this._lineOffsets[position.line] + position.character;
  }

  get lineCount() {
    return this._lineOffsets.length;
  }
}

jest.mock('vscode', () => ({
  Range: MockRange,
}), { virtual: true });

const { findEnclosingFunctionFromText, isLocalDeclaredInBody } = require('../src/utils/scopeAnalysis');

const SAMPLE = [
  'Global $g = 0',
  'Func Alpha($p)',
  '    Local $x = 1',
  '    $g = $x + $p',
  'EndFunc',
  'Func Beta()',
  '    ; Local $x in a comment',
  '    Local $s = "Local $not"',
  'EndFunc',
].join('\n');

describe('scopeAnalysis helper', () => {
  test('finds the enclosing function range from text', () => {
    const doc = new MockTextDocument(SAMPLE);
    const range = findEnclosingFunctionFromText(doc, new MockPosition(3, 4));

    expect(range).not.toBeNull();
    expect(range.start.line).toBe(1);
    expect(range.end.line).toBe(4);
  });

  test('detects local declarations and parameters but ignores comment/string decoys', () => {
    const alphaBody = SAMPLE.split(/\r?\n/).slice(1, 5).join('\n');
    const betaBody = SAMPLE.split(/\r?\n/).slice(5).join('\n');

    expect(isLocalDeclaredInBody(alphaBody, '$x')).toBe(true);
    expect(isLocalDeclaredInBody(alphaBody, '$p')).toBe(true);
    expect(isLocalDeclaredInBody(betaBody, '$x')).toBe(false);
    expect(isLocalDeclaredInBody(betaBody, '$not')).toBe(false);
  });
});
