// test/services/symbolIndex.test.js
jest.mock('vscode', () => ({
  Location: class Location {
    constructor(uri, range) {
      this.uri = uri;
      this.range = range;
    }
  },
  Uri: { file: p => ({ fsPath: p, toString: () => `file://${p}` }) },
  SymbolKind: { Function: 11, Variable: 12, Constant: 13, Enum: 9, Key: 19 },
  SymbolInformation: class SymbolInformation {
    constructor(name, kind, containerName, location) {
      this.name = name;
      this.kind = kind;
      this.containerName = containerName;
      this.location = location;
    }
  },
  workspace: {
    openTextDocument: jest.fn(),
  },
}));

// symbolIndex imports provideDocumentSymbols from ai_symbols and getIncludePath
// from util; mock both so their real (vscode-heavy) module side-effects never load.
jest.mock('../../src/providers/ai_symbols', () => ({
  __esModule: true,
  provideDocumentSymbols: jest.fn(() => Promise.resolve([])),
}));
// Stub getIncludePath so util's vscode-heavy side effects never load, but
// provide a faithful isVariableDeclarationLine (the behavior under test) that
// mirrors the real implementation in src/util.js. A plain function so the
// global resetMocks does not wipe it.
jest.mock('../../src/util', () => ({
  getIncludePath: jest.fn(() => ''),
  isVariableDeclarationLine: (lineText, variableName) => {
    if (typeof lineText !== 'string' || !variableName || typeof variableName !== 'string') {
      return false;
    }
    const escaped = variableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const keywords = ['Local', 'Global', 'Const'].join('|');
    const pattern = '^[ \\t]*(?:(?:{keywords})[ \\t]+(?:.*,[ \\t]*)?)?({escaped})\\b'
      .replace('{keywords}', keywords)
      .replace('{escaped}', escaped);
    return new RegExp(pattern, 'mi').test(lineText);
  },
}));

const { SymbolKind } = require('vscode');
const index = require('../../src/services/symbolIndex');
const includeGraph = require('../../src/services/includeGraph');

const loc = uri => ({ uri: { toString: () => uri }, range: {} });

describe('symbolIndex.lookupDefinition', () => {
  beforeEach(() => index.__resetForTests());

  it('returns function locations matching a name, case-insensitively', () => {
    index.__setSymbolsForTests('file://a', [
      { name: 'MyFunc', kind: SymbolKind.Function, location: loc('file://a') },
      { name: 'Other', kind: SymbolKind.Function, location: loc('file://a') },
    ]);
    const results = index.lookupDefinition('myfunc', false);
    expect(results).toHaveLength(1);
    expect(results[0].location.uri.toString()).toBe('file://a');
  });

  it('matches variables/constants/enums when token is a variable', () => {
    // Variable-kind symbols are only treated as definitions when tagged as a
    // declaration at index time (isVariableDeclaration: true).
    index.__setSymbolsForTests('file://a', [
      {
        name: '$G',
        kind: SymbolKind.Variable,
        location: loc('file://a'),
        isVariableDeclaration: true,
      },
      { name: 'NotAVar', kind: SymbolKind.Function, location: loc('file://a') },
    ]);
    expect(index.lookupDefinition('$g', true)).toHaveLength(1);
  });

  it('returns all matches across files on a name collision', () => {
    index.__setSymbolsForTests('file://a', [
      { name: 'Dup', kind: SymbolKind.Function, location: loc('file://a') },
    ]);
    index.__setSymbolsForTests('file://b', [
      { name: 'Dup', kind: SymbolKind.Function, location: loc('file://b') },
    ]);
    expect(index.lookupDefinition('dup', false)).toHaveLength(2);
  });

  it('returns an empty array when nothing matches', () => {
    expect(index.lookupDefinition('nope', false)).toEqual([]);
  });
});

describe('symbolIndex.indexDocument variable declaration tagging', () => {
  const ai_symbols = require('../../src/providers/ai_symbols');

  beforeEach(() => index.__resetForTests());

  it('excludes a variable USAGE from definition lookups (only declarations are definitions)', async () => {
    ai_symbols.provideDocumentSymbols.mockResolvedValue([
      {
        name: '$g_Config',
        kind: SymbolKind.Variable,
        range: { start: { line: 9, character: 13 }, end: { line: 9, character: 22 } },
        children: [],
      },
    ]);
    const doc = {
      uri: { fsPath: '/proj/main.au3', toString: () => 'file:///proj/main.au3' },
      getText: () => '',
      lineAt: n => ({ text: n === 9 ? 'ConsoleWrite($g_Config & @CRLF)' : '' }),
    };
    await index.indexDocument(doc);
    expect(index.lookupDefinition('$g_Config', true)).toHaveLength(0);
  });

  it('includes a variable DECLARATION in definition lookups', async () => {
    ai_symbols.provideDocumentSymbols.mockResolvedValue([
      {
        name: '$g_Config',
        kind: SymbolKind.Variable,
        range: { start: { line: 2, character: 7 }, end: { line: 2, character: 16 } },
        children: [],
      },
    ]);
    const doc = {
      uri: { fsPath: '/proj/helper.au3', toString: () => 'file:///proj/helper.au3' },
      getText: () => '',
      lineAt: n => ({ text: n === 2 ? 'Global $g_Config = "x"' : '' }),
    };
    await index.indexDocument(doc);
    const res = index.lookupDefinition('$g_config', true); // case-insensitive
    expect(res).toHaveLength(1);
  });

  it('includes a Const declaration (SymbolKind.Constant) as a definition', async () => {
    ai_symbols.provideDocumentSymbols.mockResolvedValue([
      {
        name: '$MAX',
        kind: SymbolKind.Constant,
        range: { start: { line: 0, character: 13 }, end: { line: 0, character: 17 } },
        children: [],
      },
    ]);
    const doc = {
      uri: { fsPath: '/proj/c.au3', toString: () => 'file:///proj/c.au3' },
      getText: () => '',
      lineAt: n => ({ text: n === 0 ? 'Global Const $MAX = 1' : '' }),
    };
    await index.indexDocument(doc);
    expect(index.lookupDefinition('$MAX', true)).toHaveLength(1);
  });

  it('includes an Enum declaration (SymbolKind.Enum) as a definition', async () => {
    ai_symbols.provideDocumentSymbols.mockResolvedValue([
      {
        name: '$A',
        kind: SymbolKind.Enum,
        range: { start: { line: 0, character: 5 }, end: { line: 0, character: 7 } },
        children: [],
      },
    ]);
    const doc = {
      uri: { fsPath: '/proj/e.au3', toString: () => 'file:///proj/e.au3' },
      getText: () => '',
      lineAt: n => ({ text: n === 0 ? 'Enum $A, $B' : '' }),
    };
    await index.indexDocument(doc);
    expect(index.lookupDefinition('$A', true)).toHaveLength(1);
  });
});

describe('symbolIndex.removeDocument', () => {
  beforeEach(() => {
    index.__resetForTests();
    includeGraph.__resetForTests();
  });

  it('deletes the uri from both symbolsCache and includeEdges', () => {
    index.__setSymbolsForTests('file://a', [
      { name: 'Foo', kind: SymbolKind.Function, location: loc('file://a') },
    ]);
    includeGraph.__setEdgesForTests('file://a', ['file://b']);

    expect(index.symbolsCache.has('file://a')).toBe(true);
    expect(includeGraph.includeEdges.has('file://a')).toBe(true);

    index.removeDocument('file://a');

    expect(index.symbolsCache.has('file://a')).toBe(false);
    expect(includeGraph.includeEdges.has('file://a')).toBe(false);
  });
});

const { workspace } = require('vscode');

// Build a document whose uri matches the Uri.file mock key space so cache
// assertions can be made by fsPath.
const docFor = fsPath => ({
  uri: { fsPath, toString: () => `file://${fsPath}` },
  getText: () => '',
});

describe('symbolIndex.warmDocument', () => {
  beforeEach(() => index.__resetForTests());

  it('indexes a just-opened .au3 document', async () => {
    const doc = docFor('/proj/opened.au3');
    await index.warmDocument(doc);
    expect(index.symbolsCache.has(doc.uri.toString())).toBe(true);
  });

  it('skips a non-.au3 document', async () => {
    const doc = docFor('/proj/notes.txt');
    await index.warmDocument(doc);
    expect(index.symbolsCache.has(doc.uri.toString())).toBe(false);
  });
});

describe('symbolIndex.noteFileContent', () => {
  beforeEach(() => index.__resetForTests());

  it('indexes a not-yet-cached file via openTextDocument', async () => {
    const fsPath = '/lib/Array.au3';
    const uriString = includeGraph.toUriString(fsPath);
    const doc = docFor(fsPath);
    workspace.openTextDocument.mockResolvedValueOnce(doc);

    index.noteFileContent(fsPath, 'Func _Foo()\nEndFunc\n');
    // Let the fire-and-forget promise chain (openTextDocument -> indexDocument
    // -> provideDocumentSymbols) settle before asserting.
    await new Promise(resolve => setImmediate(resolve));

    expect(workspace.openTextDocument).toHaveBeenCalled();
    expect(index.symbolsCache.has(uriString)).toBe(true);
  });

  it('does not re-index an already-cached path', async () => {
    const fsPath = '/lib/Array.au3';
    const uriString = includeGraph.toUriString(fsPath);
    index.__setSymbolsForTests(uriString, []);
    workspace.openTextDocument.mockClear();

    index.noteFileContent(fsPath, 'Func _Foo()\nEndFunc\n');
    await Promise.resolve();

    expect(workspace.openTextDocument).not.toHaveBeenCalled();
  });

  it('does nothing for empty content or missing path', async () => {
    workspace.openTextDocument.mockClear();
    index.noteFileContent('/lib/Array.au3', '');
    index.noteFileContent('', 'some content');
    await Promise.resolve();
    expect(workspace.openTextDocument).not.toHaveBeenCalled();
  });
});
