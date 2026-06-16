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
    findFiles: jest.fn(() => Promise.resolve([])),
    openTextDocument: jest.fn(),
    getConfiguration: jest.fn(() => ({ get: (_k, d) => d })),
    createFileSystemWatcher: jest.fn(() => ({
      onDidChange: jest.fn(),
      onDidCreate: jest.fn(),
      onDidDelete: jest.fn(),
    })),
    onDidOpenTextDocument: jest.fn(),
  },
}));

// symbolIndex imports provideDocumentSymbols from ai_symbols and getIncludePath
// from util; mock both so their real (vscode-heavy) module side-effects never load.
jest.mock('../../src/ai_symbols', () => ({
  __esModule: true,
  provideDocumentSymbols: jest.fn(() => Promise.resolve([])),
}));
jest.mock('../../src/util', () => ({
  getIncludePath: jest.fn(() => ''),
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

describe('symbolIndex.removeDocument', () => {
  beforeEach(() => index.__resetForTests());

  it('deletes the uri from both symbolsCache and includeEdges', () => {
    index.__setSymbolsForTests('file://a', [
      { name: 'Foo', kind: SymbolKind.Function, location: loc('file://a') },
    ]);
    index.__setEdgesForTests('file://a', ['file://b']);

    expect(index.symbolsCache.has('file://a')).toBe(true);
    expect(index.includeEdges.has('file://a')).toBe(true);

    index.removeDocument('file://a');

    expect(index.symbolsCache.has('file://a')).toBe(false);
    expect(index.includeEdges.has('file://a')).toBe(false);
  });
});

describe('symbolIndex.ensureWarm', () => {
  beforeEach(() => index.__resetForTests());

  it('runs the build at most once across repeated calls', async () => {
    const build = jest.fn(() => Promise.resolve());
    index.__setBuilderForTests(build);
    index.ensureWarm();
    index.ensureWarm();
    await Promise.resolve();
    expect(build).toHaveBeenCalledTimes(1);
  });

  it('retries the build after a failure resets state to cold', async () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const failing = jest.fn(() => Promise.reject(new Error('boom')));
      index.__setBuilderForTests(failing);
      await index.ensureWarm(); // first attempt fails, resets to cold
      expect(index.isWarm()).toBe(false);

      const succeeding = jest.fn(() => Promise.resolve());
      index.__setBuilderForTests(succeeding);
      await index.ensureWarm(); // should retry since state went back to cold
      expect(succeeding).toHaveBeenCalledTimes(1);
      expect(index.isWarm()).toBe(true);
    } finally {
      errSpy.mockRestore();
    }
  });

  it('does not rebuild once warm', async () => {
    const build = jest.fn(() => Promise.resolve());
    index.__setBuilderForTests(build);
    await index.ensureWarm();
    expect(index.isWarm()).toBe(true);
    await index.ensureWarm(); // already warm — no rebuild
    expect(build).toHaveBeenCalledTimes(1);
  });

  it('coalesces concurrent callers onto the same promise', async () => {
    let resolveBuild;
    const build = jest.fn(
      () =>
        new Promise(r => {
          resolveBuild = r;
        }),
    );
    index.__setBuilderForTests(build);
    const p1 = index.ensureWarm();
    const p2 = index.ensureWarm();
    expect(p1).toBe(p2); // same in-flight promise
    await Promise.resolve(); // let the queued builder() microtask run
    expect(build).toHaveBeenCalledTimes(1);
    resolveBuild();
  });
});

describe('symbolIndex.extractIncludeEdges', () => {
  beforeEach(() => index.__resetForTests());

  it('resolves relative and library includes into edges in URI key space', () => {
    const resolve = jest.fn(raw =>
      raw.includes('helper') ? '/proj/helper.au3' : '/lib/Array.au3',
    );
    const text = '#include "helper.au3"\n#include <Array.au3>\n';
    const edges = index.extractIncludeEdges(
      'file:///proj/main.au3',
      text,
      {
        uri: { fsPath: '/proj/main.au3' },
      },
      resolve,
    );
    // Edges are stored in the canonical key space (toUriString), which folds
    // case on case-insensitive filesystems.
    expect(edges).toEqual([
      index.toUriString('/proj/helper.au3'),
      index.toUriString('/lib/Array.au3'),
    ]);
    expect(resolve).toHaveBeenCalledWith('"helper.au3"', { uri: { fsPath: '/proj/main.au3' } });
    expect(resolve).toHaveBeenCalledWith('<Array.au3>', { uri: { fsPath: '/proj/main.au3' } });
    expect(index.getIncludeSet('file:///proj/main.au3').size).toBe(3);
  });

  // Regression: the bug was a URI key-space casing mismatch. The cache key is
  // derived from the ON-DISK path casing while the include edge is derived from
  // the user's #include spelling. On case-insensitive filesystems they must
  // collapse to the same key via toUriString so the in-scope filter matches.
  it('collapses casing-divergent include edges and cache keys to one key on case-insensitive FS', () => {
    const CASE_INSENSITIVE_FS = process.platform === 'win32' || process.platform === 'darwin';

    // User wrote `#include "Helper.au3"` but the file on disk is `helper.au3`.
    const resolve = jest.fn(() => '/proj/helper.au3'); // resolver yields on-disk casing
    const mainKey = index.toUriString('/proj/main.au3');
    const helperKey = index.toUriString('/proj/helper.au3'); // canonical cache key

    index.extractIncludeEdges(
      mainKey,
      '#include "Helper.au3"\n',
      { uri: { fsPath: '/proj/main.au3' } },
      resolve,
    );

    const includeSet = index.getIncludeSet(mainKey);

    // A candidate location carrying the differently-cased path the user spelled.
    const candidateKey = index.toUriString('/proj/Helper.au3');

    if (CASE_INSENSITIVE_FS) {
      // The differently-cased candidate path lands in the SAME key space as the
      // edge (both lowercased), so the in-scope filter matches — fix verified.
      expect(helperKey).toBe(candidateKey);
      expect(includeSet.has(candidateKey)).toBe(true);
    } else {
      // On case-sensitive FS (Linux), Helper.au3 and helper.au3 are distinct and
      // must NOT be conflated — preserve case sensitivity.
      expect(helperKey).not.toBe(candidateKey);
      expect(includeSet.has(candidateKey)).toBe(false);
      expect(includeSet.has(helperKey)).toBe(true);
    }
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
    const uriString = index.toUriString(fsPath);
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
    const uriString = index.toUriString(fsPath);
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
