/**
 * ai_references.test.js
 * Function-level tests for src/ai_references.js using Jest with a mocked VS Code API.
 * The vscode mock is forward-compatible with later tasks (document symbols, workspace scanning).
 */

const path = require('path');

const MAIN_PATH = path.join(process.cwd(), 'test', 'fixtures', 'main.au3');

// Minimal VS Code stubs
class MockUri {
  static file(p) {
    return { fsPath: path.normalize(p) };
  }
}

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

class MockLocation {
  constructor(uri, range) {
    this.uri = uri;
    this.range = range;
  }
}

// Helper: implement a VS Code-like TextDocument for AutoIt
class MockTextDocument {
  constructor(text, filePath) {
    this._text = text;
    this.uri = MockUri.file(filePath || MAIN_PATH);
    const lines = text.split(/\r?\n/);
    this._lineOffsets = new Array(lines.length);
    let offset = 0;
    for (let i = 0; i < lines.length; i++) {
      this._lineOffsets[i] = offset;
      offset += lines[i].length + 1; // assume \n
    }
  }

  getText(range) {
    if (!range) return this._text;
    const start = this.offsetAt(range.start);
    const end = this.offsetAt(range.end);
    return this._text.substring(start, end);
  }

  positionAt(offset) {
    if (offset < 0) offset = 0;
    if (offset > this._text.length) offset = this._text.length;
    // binary search line
    let low = 0,
      high = this._lineOffsets.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      const mo = this._lineOffsets[mid];
      if (mo === offset) {
        return new MockPosition(mid, 0);
      }
      if (mo < offset) low = mid + 1;
      else high = mid - 1;
    }
    const line = Math.max(0, high);
    const lineOffset = this._lineOffsets[line];
    return new MockPosition(line, offset - lineOffset);
  }

  offsetAt(position) {
    const line = Math.max(0, Math.min(position.line, this._lineOffsets.length - 1));
    const off = this._lineOffsets[line] + Math.max(0, position.character);
    return Math.max(0, Math.min(off, this._text.length));
  }

  // AutoIt words include $ for variables, letters, digits, and underscore.
  getWordRangeAtPosition(pos, regex) {
    const offset = this.offsetAt(pos);
    const text = this._text;
    const pattern = regex || /\$?[A-Za-z_][A-Za-z0-9_]*/g;
    // scan the line containing position
    const { line } = pos;
    const lineStart = this._lineOffsets[line];
    const nextLineStart =
      line + 1 < this._lineOffsets.length ? this._lineOffsets[line + 1] : text.length;
    const segment = text.substring(lineStart, nextLineStart);
    let match;
    while ((match = pattern.exec(segment)) !== null) {
      const start = lineStart + match.index;
      const end = start + match[0].length;
      if (offset >= start && offset <= end) {
        const startPos = this.positionAt(start);
        const endPos = this.positionAt(end);
        return new MockRange(startPos, endPos);
      }
    }
    return null;
  }

  get lineCount() {
    return this._lineOffsets.length;
  }

  lineAt(lineNo) {
    const start = this._lineOffsets[lineNo];
    const end =
      lineNo + 1 < this._lineOffsets.length ? this._lineOffsets[lineNo + 1] - 1 : this._text.length;
    const text = this._text.substring(start, end);
    const range = new MockRange(new MockPosition(lineNo, 0), new MockPosition(lineNo, text.length));
    return {
      text,
      range,
      lineNumber: lineNo,
      firstNonWhitespaceCharacterIndex: text.length - text.replace(/^\s+/, '').length,
    };
  }
}

// jest mocks
jest.mock(
  'vscode',
  () => ({
    Uri: MockUri,
    Position: MockPosition,
    Range: MockRange,
    Location: MockLocation,
    languages: {
      registerReferenceProvider: jest.fn(() => ({ dispose: jest.fn() })),
      registerDefinitionProvider: jest.fn(() => ({ dispose: jest.fn() })),
      registerDocumentSymbolProvider: jest.fn(() => ({ dispose: jest.fn() })),
      registerWorkspaceSymbolProvider: jest.fn(() => ({ dispose: jest.fn() })),
    },
    workspace: {
      onDidChangeTextDocument: jest.fn(),
      onDidChangeConfiguration: jest.fn(),
      getConfiguration: jest.fn(() => ({ get: (key, def) => def })),
      findFiles: jest.fn(() => Promise.resolve([])),
      openTextDocument: jest.fn(),
      createFileSystemWatcher: jest.fn(() => ({
        onDidChange: jest.fn(),
        onDidCreate: jest.fn(),
        onDidDelete: jest.fn(),
      })),
      workspaceFolders: [],
    },
    window: {
      showErrorMessage: jest.fn(),
      showInformationMessage: jest.fn(),
      showWarningMessage: jest.fn(),
      createOutputChannel: jest.fn(() => ({ appendLine: jest.fn() })),
    },
    SymbolKind: { Function: 11, Variable: 12, Constant: 13, Enum: 9, Key: 19, Namespace: 2 },
    SymbolInformation: class {
      constructor(name, kind, containerName, location) {
        Object.assign(this, { name, kind, containerName, location });
      }
    },
    DocumentSymbol: class {
      constructor(name, detail, kind, range, selectionRange) {
        Object.assign(this, { name, detail, kind, range, selectionRange, children: [] });
      }
    },
  }),
  { virtual: true },
);

// Mock util to provide AUTOIT_MODE without triggering the heavy ai_config load chain.
jest.mock('../src/util', () => ({
  AUTOIT_MODE: { language: 'autoit', scheme: 'file' },
}));

const { AutoItReferenceProvider } = require('../src/ai_references');

const CONTEXT_WITH_DECL = { includeDeclaration: true };

// Cursor character offsets used by the symbol-extraction tests.
const CURSOR_IN_MYVAR = 8; // inside $myVar on "Local $myVar = 1"
const CURSOR_IN_DOWORK = 7; // inside DoWork on "Func DoWork()"
const CURSOR_ON_WHITESPACE = 1; // on a whitespace-only line

// Expected match index of the second hit ($foo) in '$Foo = $foo + $FooBar'.
const SECOND_VAR_MATCH_INDEX = 7;

// Expected hit for 'DoWork' on the indented second line 'x = 1\n   DoWork()'.
const INDENTED_HIT_LINE = 1;
const INDENTED_HIT_CHARACTER = 3;
const DOWORK_LENGTH = 6;

// Expected surviving-match line numbers for the scanText filtering tests.
const LINE_AFTER_COMMENT = 2; // third line, after a `;` comment line
const LINE_AFTER_BLOCK = 4; // fifth line, after a #cs/#ce block

describe('AutoItReferenceProvider', () => {
  test('returns empty array when cursor is not on a word', async () => {
    const doc = new MockTextDocument('Func Foo()\nEndFunc\n', MAIN_PATH);
    const result = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(0, 0),
      CONTEXT_WITH_DECL,
      { isCancellationRequested: false },
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });
});

describe('symbol extraction', () => {
  test('extracts a $variable token at the cursor', () => {
    const doc = new MockTextDocument('Local $myVar = 1\n', MAIN_PATH);
    const info = AutoItReferenceProvider.getSymbolAtPosition(
      doc,
      new MockPosition(0, CURSOR_IN_MYVAR),
    );
    expect(info).toEqual({ name: '$myVar', isVariable: true });
  });

  test('extracts a function-name token at the cursor', () => {
    const doc = new MockTextDocument('Func DoWork()\nEndFunc\n', MAIN_PATH);
    const info = AutoItReferenceProvider.getSymbolAtPosition(
      doc,
      new MockPosition(0, CURSOR_IN_DOWORK),
    );
    expect(info).toEqual({ name: 'DoWork', isVariable: false });
  });

  test('returns null on whitespace', () => {
    const doc = new MockTextDocument('   \n', MAIN_PATH);
    expect(
      AutoItReferenceProvider.getSymbolAtPosition(doc, new MockPosition(0, CURSOR_ON_WHITESPACE)),
    ).toBeNull();
  });
});

describe('match regex', () => {
  test('variable regex is case-insensitive and word-bounded', () => {
    const re = AutoItReferenceProvider.buildMatchRegex('$Foo', true);
    const text = '$Foo = $foo + $FooBar';
    const hits = [...text.matchAll(re)].map(m => m.index);
    expect(hits).toEqual([0, SECOND_VAR_MATCH_INDEX]); // matches $Foo and $foo, NOT $FooBar
  });

  test('function regex does not match substrings', () => {
    const re = AutoItReferenceProvider.buildMatchRegex('Work', false);
    const text = 'Work() + DoWork() + Working';
    const hits = [...text.matchAll(re)].map(m => m.index);
    expect(hits).toEqual([0]); // only the standalone Work
  });
});

describe('scanText filtering', () => {
  const find = (text, name, isVar) =>
    AutoItReferenceProvider.scanText(
      text,
      AutoItReferenceProvider.buildMatchRegex(name, isVar),
    ).map(m => m.line);

  test('excludes matches in line comments', () => {
    const text = 'DoWork()\n; DoWork() here is a comment\nDoWork()';
    expect(find(text, 'DoWork', false)).toEqual([0, LINE_AFTER_COMMENT]);
  });

  test('excludes matches inside #cs/#ce blocks', () => {
    const text = 'DoWork()\n#cs\nDoWork()\n#ce\nDoWork()';
    expect(find(text, 'DoWork', false)).toEqual([0, LINE_AFTER_BLOCK]);
  });

  test('excludes matches inside double-quoted strings', () => {
    const text = 'DoWork()\nMsgBox(0, "title", "call DoWork() now")';
    expect(find(text, 'DoWork', false)).toEqual([0]);
  });

  test('returns line and character for each match', () => {
    const text = 'x = 1\n   DoWork()';
    const hits = AutoItReferenceProvider.scanText(
      text,
      AutoItReferenceProvider.buildMatchRegex('DoWork', false),
    );
    expect(hits).toEqual([
      { line: INDENTED_HIT_LINE, character: INDENTED_HIT_CHARACTER, length: DOWORK_LENGTH },
    ]);
  });
});
