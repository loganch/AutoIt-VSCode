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
      getConfiguration: jest.fn(() => ({
        get: (key, def) => {
          // Disable Map intelligence so the symbol provider mock stays simple
          // and deterministic under the mock.
          if (key === 'enableIntelligence') return false;
          return def;
        },
      })),
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
    CompletionItemKind: { Keyword: 14 },
    SymbolInformation: class {
      constructor(name, kind, containerName, location) {
        Object.assign(this, { name, kind, containerName, location });
      }
    },
    SnippetString: class {
      constructor(value) {
        this.value = value;
      }
      appendPlaceholder(text) {
        this.value += text;
        return this;
      }
      appendText(text) {
        this.value += text;
        return this;
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

// Mock the lazily-required definition provider so workspace tests can control
// what declaration collectWorkspace resolves. The default implementation
// delegates to the REAL provider so the local-variable includeDeclaration:false
// test (which relies on resolving $x's declaration line) still passes; only the
// workspace decl-drop test overrides the return value.
jest.mock('../src/providers/ai_definition', () => ({
  AutoItDefinitionProvider: {
    provideDefinition: jest.fn((...args) =>
      jest
        .requireActual('../src/providers/ai_definition')
        .AutoItDefinitionProvider.provideDefinition(...args),
    ),
  },
}));

const vscode = require('vscode');
const { AutoItReferenceProvider } = require('../src/providers/ai_references');
const { AutoItDefinitionProvider } = require('../src/providers/ai_definition');

// clearMocks/restoreMocks strips the delegating default before each test, so the
// local-path test would otherwise get `undefined` from provideDefinition.
// Re-install the delegate every test; workspace tests override it as needed.
beforeEach(() => {
  AutoItDefinitionProvider.provideDefinition.mockImplementation((...args) =>
    jest
      .requireActual('../src/providers/ai_definition')
      .AutoItDefinitionProvider.provideDefinition(...args),
  );
});

// Jest is configured with clearMocks/restoreMocks, which strips the factory
// implementations from mock functions before every test. Re-install the
// getConfiguration implementation so symbol tests can read settings and Map
// intelligence stays disabled for determinism.
beforeEach(() => {
  vscode.workspace.getConfiguration.mockImplementation(() => ({
    get: (key, def) => (key === 'enableIntelligence' ? false : def),
  }));
});

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

// Scope-classification fixture and cursor coordinates.
const SCOPE_SRC = [
  'Global $g = 0', //                0
  'Func Alpha($p)', //              1  ($p is a parameter -> Local to Alpha)
  '    Local $x = 1', //            2  ($x is Local to Alpha)
  '    $g = $x + $p', //            3
  'EndFunc', //                     4
  'Func Beta()', //                 5
  '    $x = 99', //                 6  (auto-global $x usage in another func)
  'EndFunc', //                     7
].join('\n');

const ALPHA_FUNC_START_LINE = 1; // Func Alpha
const ALPHA_FUNC_END_LINE = 4; // EndFunc
const SCOPE_X_DECL_LINE = 2; // Local $x = 1
const SCOPE_X_DECL_CHAR = 11; // cursor on $x in the declaration
const SCOPE_P_USE_LINE = 3; // $g = $x + $p
const SCOPE_P_USE_CHAR = 14; // cursor on $p usage
const SCOPE_G_DECL_LINE = 0; // Global $g = 0
const SCOPE_G_DECL_CHAR = 8; // cursor on $g
const SCOPE_X_IN_BETA_LINE = 6; // $x = 99 inside Beta
const SCOPE_X_IN_BETA_CHAR = 4; // cursor on $x

// Decoy fixtures: a comment / string mentioning `Local $name` must NOT cause a
// workspace-global variable to be misclassified as function-local.
const COMMENT_DECOY_SRC = [
  'Global $g = 0', //              0
  'Func F()', //                  1
  '    ; Local $g here', //       2  decoy comment, not a real declaration
  '    $g = 1', //                3  usage of the global
  'EndFunc', //                   4
].join('\n');

const STRING_DECOY_SRC = [
  'Global $s = 0', //             0
  'Func G()', //                 1
  '    $msg = "Local $s"', //    2  decoy inside a string literal
  '    $s = 2', //               3  usage of the global
  'EndFunc', //                  4
].join('\n');

const DECOY_USE_LINE = 3; // line where the global is actually used
const COMMENT_DECOY_USE_CHAR = 4; // cursor on $g in "$g = 1"
const STRING_DECOY_USE_CHAR = 4; // cursor on $s in "$s = 2"

// Shadowing fixture: a Global $x at the top is shadowed by a Local $x inside
// Func F(). The in-scope Local declaration (line 2) must be the one dropped when
// includeDeclaration is false -- NOT the earlier Global line 0 (which the
// whole-file definition provider would return first, and which is out of range).
const SHADOW_SRC = [
  'Global $x = 0', //              0  shadowed global (out of F's range)
  'Func F()', //                  1
  '    Local $x = 1', //          2  in-scope Local declaration
  '    $x = $x + 1', //           3  usage of the local
  'EndFunc', //                   4
].join('\n');

const SHADOW_LOCAL_DECL_LINE = 2; // Local $x = 1 (in-scope declaration)
const SHADOW_LOCAL_DECL_CHAR = 11; // cursor on $x in the Local declaration
const SHADOW_LOCAL_USE_LINE = 3; // $x = $x + 1 (usage line)

// Parameter shadowing/drop fixture: $p is a parameter of Func P(). With
// includeDeclaration false, the Func signature line (where the parameter is
// declared) must be dropped.
const PARAM_DROP_SRC = [
  'Func P($p)', //                0  parameter declaration (Func signature)
  '    $p = $p + 1', //           1  usage of the parameter
  'EndFunc', //                   2
].join('\n');

const PARAM_SIG_LINE = 0; // Func P($p) signature line
const PARAM_USE_LINE = 1; // $p = $p + 1 usage line
const PARAM_USE_CHAR = 4; // cursor on first $p in the usage line

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

describe('scope classification', () => {
  test('Local-declared variable is scoped to its function', async () => {
    const doc = new MockTextDocument(SCOPE_SRC, MAIN_PATH);
    const scope = await AutoItReferenceProvider.classifyScope(
      doc,
      new MockPosition(SCOPE_X_DECL_LINE, SCOPE_X_DECL_CHAR),
      '$x',
    );
    expect(scope.kind).toBe('local');
    expect(scope.range.start.line).toBe(ALPHA_FUNC_START_LINE);
    expect(scope.range.end.line).toBe(ALPHA_FUNC_END_LINE);
  });

  test('parameter is scoped to its function', async () => {
    const doc = new MockTextDocument(SCOPE_SRC, MAIN_PATH);
    const scope = await AutoItReferenceProvider.classifyScope(
      doc,
      new MockPosition(SCOPE_P_USE_LINE, SCOPE_P_USE_CHAR),
      '$p',
    );
    expect(scope.kind).toBe('local');
    expect(scope.range.start.line).toBe(ALPHA_FUNC_START_LINE);
  });

  test('Global variable is workspace-wide', async () => {
    const doc = new MockTextDocument(SCOPE_SRC, MAIN_PATH);
    const scope = await AutoItReferenceProvider.classifyScope(
      doc,
      new MockPosition(SCOPE_G_DECL_LINE, SCOPE_G_DECL_CHAR),
      '$g',
    );
    expect(scope.kind).toBe('global');
  });

  test('variable used inside a function but never Local-declared there is global', async () => {
    const doc = new MockTextDocument(SCOPE_SRC, MAIN_PATH);
    const scope = await AutoItReferenceProvider.classifyScope(
      doc,
      new MockPosition(SCOPE_X_IN_BETA_LINE, SCOPE_X_IN_BETA_CHAR),
      '$x',
    );
    expect(scope.kind).toBe('global'); // not Local in Beta -> treated as global/auto-global
  });

  test('comment decoy "; Local $g" does not misclassify a global as local', async () => {
    const doc = new MockTextDocument(COMMENT_DECOY_SRC, MAIN_PATH);
    const scope = await AutoItReferenceProvider.classifyScope(
      doc,
      new MockPosition(DECOY_USE_LINE, COMMENT_DECOY_USE_CHAR),
      '$g',
    );
    expect(scope.kind).toBe('global');
  });

  test('string decoy "Local $s" does not misclassify a global as local', async () => {
    const doc = new MockTextDocument(STRING_DECOY_SRC, MAIN_PATH);
    const scope = await AutoItReferenceProvider.classifyScope(
      doc,
      new MockPosition(DECOY_USE_LINE, STRING_DECOY_USE_CHAR),
      '$s',
    );
    expect(scope.kind).toBe('global');
  });
});

describe('provideReferences - local variable', () => {
  test('returns only occurrences within the enclosing function', async () => {
    const doc = new MockTextDocument(SCOPE_SRC, MAIN_PATH);
    // cursor on $x at its Local declaration (line 2, char 11)
    const locs = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(SCOPE_X_DECL_LINE, SCOPE_X_DECL_CHAR),
      CONTEXT_WITH_DECL,
      { isCancellationRequested: false },
    );
    const lines = locs.map(l => l.range.start.line).sort((a, b) => a - b);
    expect(lines).toEqual([SCOPE_X_DECL_LINE, SCOPE_P_USE_LINE]); // $x on lines 2 and 3 only, NOT line 6 (Beta)
    locs.forEach(l => expect(l.uri.fsPath).toBe(doc.uri.fsPath));
  });

  test('excludes the declaration when includeDeclaration is false', async () => {
    const doc = new MockTextDocument(SCOPE_SRC, MAIN_PATH);
    const locs = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(SCOPE_X_DECL_LINE, SCOPE_X_DECL_CHAR),
      { includeDeclaration: false },
      { isCancellationRequested: false },
    );
    const lines = locs.map(l => l.range.start.line);
    expect(lines).toEqual([SCOPE_P_USE_LINE]); // declaration line 2 dropped
  });

  test('drops the in-scope Local declaration when it shadows an earlier global', async () => {
    const doc = new MockTextDocument(SHADOW_SRC, MAIN_PATH);
    const locs = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(SHADOW_LOCAL_DECL_LINE, SHADOW_LOCAL_DECL_CHAR),
      { includeDeclaration: false },
      { isCancellationRequested: false },
    );
    const lines = locs.map(l => l.range.start.line).sort((a, b) => a - b);
    // The in-scope Local declaration (line 2) is dropped; only the usage (line 3,
    // which contains two $x references) remains. The shadowed Global on line 0 is
    // out of F's range and never appears. Before the fix the definition provider
    // resolved $x to the Global line 0, so the Local on line 2 was wrongly kept.
    expect(lines).toEqual([SHADOW_LOCAL_USE_LINE, SHADOW_LOCAL_USE_LINE]);
  });

  test('drops the Func signature line for a parameter when includeDeclaration is false', async () => {
    const doc = new MockTextDocument(PARAM_DROP_SRC, MAIN_PATH);
    const locs = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(PARAM_USE_LINE, PARAM_USE_CHAR),
      { includeDeclaration: false },
      { isCancellationRequested: false },
    );
    const lines = locs.map(l => l.range.start.line).sort((a, b) => a - b);
    // The Func signature line 0 (where $p is declared as a parameter) is dropped;
    // only the usage line 1 (two $p references) remains.
    expect(lines).toEqual([PARAM_USE_LINE, PARAM_USE_LINE]);
    expect(lines).not.toContain(PARAM_SIG_LINE);
  });
});

describe('provideReferences - workspace (functions & globals)', () => {
  const FILE_A = path.join(process.cwd(), 'test', 'fixtures', 'a.au3');
  const FILE_B = path.join(process.cwd(), 'test', 'fixtures', 'b.au3');
  const A_SRC = ['Func DoWork()', '    Return 1', 'EndFunc', 'DoWork()'].join('\n');
  const B_SRC = ['#include "a.au3"', 'Local $r = DoWork()', '; DoWork() in comment'].join('\n');
  const DOWORK_CURSOR_CHAR = 6; // cursor on DoWork in "Func DoWork()"

  // Expected workspace hits: a.au3 decl line 0, call line 3; b.au3 call line 1.
  const EXPECTED_HITS = ['a.au3:0', 'a.au3:3', 'b.au3:1'];

  beforeEach(() => {
    vscode.workspace.findFiles.mockResolvedValue([
      { fsPath: FILE_A, toString: () => FILE_A },
      { fsPath: FILE_B, toString: () => FILE_B },
    ]);
    vscode.workspace.openTextDocument.mockImplementation(uri => {
      const p = uri.fsPath || uri;
      return Promise.resolve(new MockTextDocument(p === FILE_A ? A_SRC : B_SRC, p));
    });
    vscode.workspace.getConfiguration.mockReturnValue({ get: (k, d) => d });
  });

  test('finds function references across files, excluding comments', async () => {
    const doc = new MockTextDocument(A_SRC, FILE_A);
    const locs = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(0, DOWORK_CURSOR_CHAR),
      CONTEXT_WITH_DECL,
      { isCancellationRequested: false },
    );
    const byFile = locs.map(l => `${path.basename(l.uri.fsPath)}:${l.range.start.line}`).sort();
    expect(byFile).toEqual(EXPECTED_HITS);
  });

  test('drops the cross-file declaration when includeDeclaration is false', async () => {
    // B_SRC's line 1 is the only call in b.au3; add a same-LINE-as-decl call so we
    // can prove the uri component of the filter matters (a hit on b.au3:0 must NOT
    // be dropped even though it shares the declaration's line number 0).
    const B_SRC_WITH_LINE0 = ['DoWork()', 'Local $r = DoWork()', '; DoWork() in comment'].join(
      '\n',
    );
    vscode.workspace.openTextDocument.mockImplementation(uri => {
      const p = uri.fsPath || uri;
      return Promise.resolve(new MockTextDocument(p === FILE_A ? A_SRC : B_SRC_WITH_LINE0, p));
    });

    // Declaration resolves to a.au3 line 0 (the Func DoWork() line).
    AutoItDefinitionProvider.provideDefinition.mockReturnValue({
      uri: { fsPath: FILE_A },
      range: { start: { line: 0, character: 0 } },
    });

    const doc = new MockTextDocument(A_SRC, FILE_A);
    const locs = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(0, DOWORK_CURSOR_CHAR),
      { includeDeclaration: false },
      { isCancellationRequested: false },
    );
    const byFile = locs.map(l => `${path.basename(l.uri.fsPath)}:${l.range.start.line}`).sort();
    // a.au3:0 (the declaration) is dropped. a.au3:3 (different line, same file) and
    // b.au3:1 remain. CRITICAL: b.au3:0 also remains -- it shares the decl's line
    // number but lives in a different file, so a line-only filter would wrongly
    // drop it and a uri-only filter would wrongly drop a.au3:3. Only the uri+line
    // conjunction produces exactly this set.
    expect(byFile).toEqual(['a.au3:3', 'b.au3:0', 'b.au3:1']);
  });

  test('includes the active document even when findFiles omits it', async () => {
    const SRC = ['Func DoWork()', '    Return 1', 'EndFunc', 'DoWork()'].join('\n');
    const OTHER = path.join(process.cwd(), 'test', 'fixtures', 'other.au3');
    vscode.workspace.findFiles.mockResolvedValue([{ fsPath: OTHER, toString: () => OTHER }]);
    vscode.workspace.openTextDocument.mockImplementation(uri => {
      const p = uri.fsPath || uri;
      return Promise.resolve(
        new MockTextDocument(p === OTHER ? 'Func Other()\nEndFunc\n' : SRC, p),
      );
    });
    vscode.workspace.getConfiguration.mockReturnValue({ get: (k, d) => d });
    const doc = new MockTextDocument(SRC, FILE_A);
    const locs = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(0, DOWORK_CURSOR_CHAR),
      CONTEXT_WITH_DECL,
      { isCancellationRequested: false },
    );
    const byFile = locs.map(l => `${path.basename(l.uri.fsPath)}:${l.range.start.line}`).sort();
    expect(byFile).toEqual(['a.au3:0', 'a.au3:3']);
  });

  test('returns [] when cancelled', async () => {
    const doc = new MockTextDocument(A_SRC, FILE_A);
    const locs = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(0, DOWORK_CURSOR_CHAR),
      CONTEXT_WITH_DECL,
      { isCancellationRequested: true },
    );
    expect(locs).toEqual([]);
  });
});

describe('provideReferences - edge cases', () => {
  // Cursor on the function name in "Func MyFunc()" (char 6 = start of MyFunc).
  const MYFUNC_CURSOR_CHAR = 6;
  // Case-insensitive fixture: declaration line 0, lower/upper-case calls on lines
  // 2 and 3 (line 1 is EndFunc, no match).
  const CI_DECL_LINE = 0;
  const CI_LOWER_CALL_LINE = 2;
  const CI_UPPER_CALL_LINE = 3;
  const CI_HIT_LINES = [CI_DECL_LINE, CI_LOWER_CALL_LINE, CI_UPPER_CALL_LINE];
  // Cursor on DoWork in "Func DoWork()" for the skip-files fixture.
  const DOWORK_DECL_CURSOR_CHAR = 6;
  // Skip-files fixture: decl line 0, call line 2 from the readable file only.
  const SKIP_DECL_LINE = 0;
  const SKIP_CALL_LINE = 2;
  const SKIP_HIT_LINES = [SKIP_DECL_LINE, SKIP_CALL_LINE];

  test('matches function references case-insensitively', async () => {
    const F = path.join(process.cwd(), 'test', 'fixtures', 'ci.au3');
    const SRC = ['Func MyFunc()', 'EndFunc', 'myfunc()', 'MYFUNC()'].join('\n');
    vscode.workspace.findFiles.mockResolvedValue([{ fsPath: F, toString: () => F }]);
    vscode.workspace.openTextDocument.mockResolvedValue(new MockTextDocument(SRC, F));
    vscode.workspace.getConfiguration.mockReturnValue({ get: (k, d) => d });
    const doc = new MockTextDocument(SRC, F);
    const locs = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(0, MYFUNC_CURSOR_CHAR),
      CONTEXT_WITH_DECL,
      { isCancellationRequested: false },
    );
    expect(locs.map(l => l.range.start.line).sort((a, b) => a - b)).toEqual(CI_HIT_LINES);
  });

  test('cursor on an AutoIt keyword returns []', async () => {
    const doc = new MockTextDocument('If $x Then\nEndIf\n', MAIN_PATH);
    const locs = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(0, 0),
      CONTEXT_WITH_DECL,
      { isCancellationRequested: false },
    );
    expect(locs).toEqual([]);
    // For the RIGHT reason: a recognized keyword is rejected before any scan, so
    // the workspace search is never triggered.
    expect(vscode.workspace.findFiles).not.toHaveBeenCalled();
  });

  // Cursor on the In token in "For $x In $array" (chars 0-3 "For ", 4-6 "$x ",
  // so "In" begins at char 7).
  const FOR_IN_CURSOR_CHAR = 7;

  test('cursor on In keyword returns [] without a workspace scan', async () => {
    const doc = new MockTextDocument('For $x In $array\nNext\n', MAIN_PATH);
    const locs = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(0, FOR_IN_CURSOR_CHAR),
      CONTEXT_WITH_DECL,
      { isCancellationRequested: false },
    );
    expect(locs).toEqual([]);
    // For the RIGHT reason: In is a recognized keyword, rejected before any scan,
    // so the For-In loop never triggers a workspace search.
    expect(vscode.workspace.findFiles).not.toHaveBeenCalled();
  });

  test('skips files that fail to open', async () => {
    const OK = path.join(process.cwd(), 'test', 'fixtures', 'ok.au3');
    const BAD = path.join(process.cwd(), 'test', 'fixtures', 'bad.au3');
    vscode.workspace.findFiles.mockResolvedValue([
      { fsPath: OK, toString: () => OK },
      { fsPath: BAD, toString: () => BAD },
    ]);
    vscode.workspace.openTextDocument.mockImplementation(uri => {
      if ((uri.fsPath || uri) === BAD) throw new Error('cannot open');
      return Promise.resolve(new MockTextDocument('Func DoWork()\nEndFunc\nDoWork()', OK));
    });
    vscode.workspace.getConfiguration.mockReturnValue({ get: (k, d) => d });
    const doc = new MockTextDocument('Func DoWork()\nEndFunc\nDoWork()', OK);
    const locs = await AutoItReferenceProvider.provideReferences(
      doc,
      new MockPosition(0, DOWORK_DECL_CURSOR_CHAR),
      CONTEXT_WITH_DECL,
      { isCancellationRequested: false },
    );
    expect(locs.map(l => l.range.start.line).sort((a, b) => a - b)).toEqual(SKIP_HIT_LINES);
  });
});
