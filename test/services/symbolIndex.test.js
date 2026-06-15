// test/services/symbolIndex.test.js
jest.mock('vscode', () => ({
  Location: class Location {
    constructor(uri, range) { this.uri = uri; this.range = range; }
  },
  Uri: { file: p => ({ fsPath: p, toString: () => `file://${p}` }) },
  SymbolKind: { Function: 11, Variable: 12, Constant: 13, Enum: 9, Key: 19 },
  workspace: {
    findFiles: jest.fn(() => Promise.resolve([])),
    openTextDocument: jest.fn(),
    getConfiguration: jest.fn(() => ({ get: (_k, d) => d })),
    createFileSystemWatcher: jest.fn(() => ({
      onDidChange: jest.fn(), onDidCreate: jest.fn(), onDidDelete: jest.fn(),
    })),
    onDidOpenTextDocument: jest.fn(),
  },
}));

const { SymbolKind } = require('vscode');
const index = require('../../src/services/symbolIndex');

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
    index.__setSymbolsForTests('file://a', [
      { name: '$G', kind: SymbolKind.Variable, location: loc('file://a') },
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

describe('symbolIndex.getIncludeSet', () => {
  beforeEach(() => index.__resetForTests());

  it('returns the document itself plus transitively-included files', () => {
    index.__setEdgesForTests('file://a', ['file://b']);
    index.__setEdgesForTests('file://b', ['file://c']);
    const set = index.getIncludeSet('file://a');
    expect([...set].sort()).toEqual(['file://a', 'file://b', 'file://c']);
  });

  it('tolerates circular includes without infinite looping', () => {
    index.__setEdgesForTests('file://a', ['file://b']);
    index.__setEdgesForTests('file://b', ['file://a']);
    const set = index.getIncludeSet('file://a');
    expect([...set].sort()).toEqual(['file://a', 'file://b']);
  });

  it('honors live edges for the active document over cached edges', () => {
    index.__setEdgesForTests('file://a', ['file://stale']);
    const set = index.getIncludeSet('file://a', ['file://fresh']);
    expect(set.has('file://fresh')).toBe(true);
    expect(set.has('file://stale')).toBe(false);
  });

  it('treats an empty liveEdges array as overriding cached edges (active doc with no includes)', () => {
    index.__setEdgesForTests('file://a', ['file://stale']);
    const set = index.getIncludeSet('file://a', []);
    expect([...set]).toEqual(['file://a']);
  });
});
