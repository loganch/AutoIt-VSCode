// test/services/includeGraph.test.js
jest.mock('vscode', () => ({
  Uri: { file: p => ({ fsPath: p, toString: () => `file://${p}` }) },
}));

jest.mock('../../src/util', () => ({
  getIncludePath: jest.fn(() => ''),
}));

const index = require('../../src/services/includeGraph');

describe('includeGraph.getIncludeSet', () => {
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

describe('includeGraph.extractIncludeEdges', () => {
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
