# Fast Go-to-Definition Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Go-to-Definition (F12) resolve in milliseconds on large AutoIt workspaces by looking up a warm, incrementally-maintained symbol index instead of rebuilding the include graph and regex-scanning every file on each press (issue #241).

**Architecture:** Extract the workspace symbol cache out of `ai_workspaceSymbols.js` into a shared `src/services/symbolIndex.js` service that owns (a) the symbol cache (name → `Location`), (b) an include-edge map (file → resolved `#include` targets), and (c) `ensureWarm()` for an eager background build at activation. `provideDefinition` gains a fast path: same-file scan → index lookup → filter to the current document's transitively-included files → fall back to today's include-graph scan. Cold lookups are hardened by prioritizing the active document's include graph and by opportunistically indexing files the fallback scan reads.

**Tech Stack:** JavaScript (ES modules via Babel), VS Code extension API, Jest with an inline-mocked `vscode` module. Design doc: `docs/plans/2026-06-14-fast-goto-definition-design.md`.

**Conventions to follow:**
- AutoIt names are case-insensitive — always compare lowercased.
- URI key space: everything stored/compared as `Uri.file(normalizedPath).toString()` so symbol-cache keys and include-edge entries are directly comparable.
- Tests use a self-contained `jest.mock('vscode', () => ({...}))` per file (see `test/ai_workspaceSymbols.test.js` for the pattern), not the shared `test/__mocks__/vscode.js`.
- Every behavior change degrades gracefully: any thrown error in the new fast path falls through to the existing scan, never breaks F12.
- Run the focused suites with: `npx jest <path> -v`. Full suite: `npm test`. Note 7 pre-existing failures on macOS (`pathValidation`, `ProcessRunner`, `extension.diagnostics`) are unrelated — do not "fix" them.

---

## Task 1: Create the shared symbol-index service with `lookupDefinition`

**Files:**
- Create: `src/services/symbolIndex.js`
- Test: `test/services/symbolIndex.test.js`

**Step 1: Write the failing test**

```js
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
```

**Step 2: Run test to verify it fails**

Run: `npx jest test/services/symbolIndex.test.js -v`
Expected: FAIL — `Cannot find module '../../src/services/symbolIndex'`.

**Step 3: Write minimal implementation**

```js
// src/services/symbolIndex.js
import { SymbolKind } from 'vscode';

// uriString -> SymbolInformation[]
const symbolsCache = new Map();

const VARIABLE_KINDS = new Set([SymbolKind.Variable, SymbolKind.Constant, SymbolKind.Enum]);

/**
 * Find definition locations for a symbol name in the warm index.
 * @param {string} name - Symbol name (e.g. "MyFunc" or "$Global").
 * @param {boolean} isVariable - True when the token starts with "$".
 * @returns {Array<import('vscode').Location>} Matching locations (possibly empty).
 */
function lookupDefinition(name, isVariable) {
  if (!name) return [];
  const target = name.toLowerCase();
  const matches = [];
  for (const symbols of symbolsCache.values()) {
    for (const sym of symbols) {
      if (!sym || sym.name.toLowerCase() !== target) continue;
      const kindOk = isVariable
        ? VARIABLE_KINDS.has(sym.kind)
        : sym.kind === SymbolKind.Function;
      if (kindOk && sym.location) matches.push(sym.location);
    }
  }
  return matches;
}

// --- test seams (no-ops in production paths) ---
function __resetForTests() {
  symbolsCache.clear();
}
function __setSymbolsForTests(uriString, symbols) {
  symbolsCache.set(uriString, symbols);
}

export { symbolsCache, lookupDefinition, __resetForTests, __setSymbolsForTests };
```

**Step 4: Run test to verify it passes**

Run: `npx jest test/services/symbolIndex.test.js -v`
Expected: PASS (4 tests).

**Step 5: Commit**

```bash
git add src/services/symbolIndex.js test/services/symbolIndex.test.js
git commit -m "feat(symbol-index): add shared symbol cache with lookupDefinition"
```

---

## Task 2: Add the include-edge map and `getIncludeSet`

**Files:**
- Modify: `src/services/symbolIndex.js`
- Test: `test/services/symbolIndex.test.js`

**Context:** `getIncludeSet` answers "which files are reachable from this document via `#include`?" as a pure in-memory traversal over an edge map, so F12 can reject definitions in non-included files without any disk I/O. Edges are stored in the same URI key space as `symbolsCache`.

**Step 1: Write the failing test** (append to the existing test file)

```js
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
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest test/services/symbolIndex.test.js -t getIncludeSet -v`
Expected: FAIL — `index.getIncludeSet is not a function`.

**Step 3: Write minimal implementation** (add to `src/services/symbolIndex.js`)

```js
// uriString -> string[] of resolved include-target uriStrings
const includeEdges = new Map();

/**
 * Compute the set of files reachable from a document via #include (transitive),
 * including the document itself. Pure in-memory traversal — no disk I/O.
 * @param {string} documentUriString - Starting document URI string.
 * @param {string[]} [liveEdges] - When provided, the active document's freshly
 *   parsed include targets, used instead of its cached edges (handles unsaved edits).
 * @returns {Set<string>} Reachable URI strings.
 */
function getIncludeSet(documentUriString, liveEdges) {
  const visited = new Set();
  const stack = [documentUriString];
  let isRoot = true;
  while (stack.length) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    const edges = isRoot && liveEdges ? liveEdges : includeEdges.get(current) || [];
    isRoot = false;
    for (const next of edges) {
      if (!visited.has(next)) stack.push(next);
    }
  }
  return visited;
}

function __setEdgesForTests(uriString, edges) {
  includeEdges.set(uriString, edges);
}
```

Update the existing `__resetForTests` to also clear edges, and extend the export list:

```js
function __resetForTests() {
  symbolsCache.clear();
  includeEdges.clear();
}
```
```js
export {
  symbolsCache,
  includeEdges,
  lookupDefinition,
  getIncludeSet,
  __resetForTests,
  __setSymbolsForTests,
  __setEdgesForTests,
};
```

**Step 4: Run test to verify it passes**

Run: `npx jest test/services/symbolIndex.test.js -v`
Expected: PASS (7 tests).

**Step 5: Commit**

```bash
git add src/services/symbolIndex.js test/services/symbolIndex.test.js
git commit -m "feat(symbol-index): add include-edge map and getIncludeSet traversal"
```

---

## Task 3: Add edge extraction and the indexing primitives

**Files:**
- Modify: `src/services/symbolIndex.js`
- Modify: `src/util.js` (export a small URI-normalization helper if not already exported)
- Test: `test/services/symbolIndex.test.js`

**Context:** Two primitives the rest of the system needs:
- `extractIncludeEdges(uriString, text, docLike)` — parse `#include` lines, resolve each to a `Uri.file(path).toString()` via `getIncludePath`, and store in `includeEdges`. Returns the resolved edge array (so callers can use it as `liveEdges`).
- `indexDocument(document)` — run `provideDocumentSymbols`, flatten to `SymbolInformation[]`, store in `symbolsCache`, and extract edges. This is the single unit of work reused by the workspace build, the watcher, the active-doc warmer, and the cold-path filler.

`flattenSymbols` currently lives in `ai_workspaceSymbols.js`. Move it into `symbolIndex.js` (with `extractKeyChildren`/`extractMapKeySymbols`) and re-export from `ai_workspaceSymbols.js` so nothing else breaks (Task 4 rewires the provider).

**Step 1: Write the failing test** (append)

```js
const { Uri } = require('vscode');

describe('symbolIndex.extractIncludeEdges', () => {
  beforeEach(() => index.__resetForTests());

  it('resolves relative and library includes into edges in URI key space', () => {
    const resolve = jest.fn(raw =>
      raw.includes('helper') ? '/proj/helper.au3' : '/lib/Array.au3',
    );
    const text = '#include "helper.au3"\n#include <Array.au3>\n';
    const edges = index.extractIncludeEdges('file:///proj/main.au3', text, {
      uri: { fsPath: '/proj/main.au3' },
    }, resolve);
    expect(edges).toEqual([
      Uri.file('/proj/helper.au3').toString(),
      Uri.file('/lib/Array.au3').toString(),
    ]);
    expect(index.getIncludeSet('file:///proj/main.au3').size).toBe(3);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest test/services/symbolIndex.test.js -t extractIncludeEdges -v`
Expected: FAIL — `index.extractIncludeEdges is not a function`.

**Step 3: Write minimal implementation**

Add to `src/services/symbolIndex.js` (note the injectable `resolveInclude` param defaults to the real `getIncludePath`, keeping the unit test free of fs):

```js
import { Location, SymbolInformation, SymbolKind, Uri, workspace } from 'vscode';
import { getIncludePath, getIncludeText } from '../util';
import { provideDocumentSymbols } from '../ai_symbols';

const RELATIVE_INCLUDE = /^\s*#include\s+"([^"]+)"/gm;
const LIBRARY_INCLUDE = /^\s*#include\s+<([^>]+)>/gm;

/** Normalize an fs path to the canonical URI key used across the index. */
function toUriString(fsPath) {
  return Uri.file(fsPath).toString();
}

/**
 * Parse #include directives from text, resolve each to a URI string, and store
 * the edges for documentUriString.
 * @param {string} documentUriString
 * @param {string} text - Document text to scan.
 * @param {{uri:{fsPath:string}}} docLike - Minimal doc for path resolution.
 * @param {(raw:string, doc:object)=>string} [resolveInclude] - Path resolver (injectable for tests).
 * @returns {string[]} Resolved edge URI strings.
 */
function extractIncludeEdges(documentUriString, text, docLike, resolveInclude = getIncludePath) {
  const edges = [];
  const collect = (regex, wrap) => {
    regex.lastIndex = 0;
    for (const m of text.matchAll(regex)) {
      const resolved = resolveInclude(wrap(m[1]), docLike);
      if (resolved) edges.push(toUriString(resolved));
    }
  };
  collect(RELATIVE_INCLUDE, raw => raw);
  collect(LIBRARY_INCLUDE, raw => `<${raw}>`);
  includeEdges.set(documentUriString, edges);
  return edges;
}

/**
 * Index a single document: store its symbols and include edges.
 * @param {import('vscode').TextDocument} document
 * @returns {Promise<void>}
 */
async function indexDocument(document) {
  if (!document || !document.uri) return;
  const uriString = document.uri.toString();
  try {
    const symbols = await provideDocumentSymbols(document);
    symbolsCache.set(uriString, flattenSymbols(symbols, document.uri));
    extractIncludeEdges(uriString, document.getText(), document);
  } catch {
    symbolsCache.delete(uriString);
    includeEdges.delete(uriString);
  }
}
```

Move `flattenSymbols`, `extractKeyChildren`, and `extractMapKeySymbols` from `ai_workspaceSymbols.js` into this file (verbatim — they already use `SymbolInformation`, `Location`, `SymbolKind`). Export `flattenSymbols`, `toUriString`, `extractIncludeEdges`, and `indexDocument`.

**Step 4: Run test to verify it passes**

Run: `npx jest test/services/symbolIndex.test.js -v`
Expected: PASS (8 tests).

**Step 5: Commit**

```bash
git add src/services/symbolIndex.js src/ai_symbols.js src/util.js test/services/symbolIndex.test.js
git commit -m "feat(symbol-index): add edge extraction and per-document indexing"
```

---

## Task 4: Rewire `ai_workspaceSymbols.js` onto the shared service

**Files:**
- Modify: `src/ai_workspaceSymbols.js`
- Test: `test/ai_workspaceSymbols.test.js`, `test/ai_workspaceSymbols.debounce.test.js` (must stay green)

**Context:** The workspace-symbol provider keeps its public behavior (Ctrl+T) but stops owning the cache. It imports `symbolsCache`, `flattenSymbols`, and `indexDocument` from the service. `processBatch` now calls `indexDocument(document)` for each file (which fills both symbols and edges) instead of only filling a local map; `getWorkspaceSymbols` still returns the cache for the provider. `updateFileSymbols`/`removeFileSymbols` delegate to the service so the watcher keeps both maps fresh.

**Step 1: Write the failing test**

Add a test asserting the provider and service share state:

```js
// in test/ai_workspaceSymbols.test.js, within an appropriate describe block
it('writes indexed symbols into the shared service cache', async () => {
  const index = require('../src/services/symbolIndex');
  // ...arrange a mock findFiles + openTextDocument returning one document...
  await provideWorkspaceSymbols('', { isCancellationRequested: false });
  expect(index.symbolsCache.size).toBeGreaterThan(0);
});
```

(Adapt to the file's existing mock harness — it already mocks `findFiles`, `openTextDocument`, and `provideDocumentSymbols`. The point is: after a build, `symbolIndex.symbolsCache` is populated, not a private map.)

**Step 2: Run test to verify it fails**

Run: `npx jest test/ai_workspaceSymbols.test.js -v`
Expected: FAIL — provider still writes to a private cache; `symbolIndex.symbolsCache` is empty.

**Step 3: Write minimal implementation**

In `src/ai_workspaceSymbols.js`:
- Remove the local `const symbolsCache = new Map();` and the local `flattenSymbols`/`extractKeyChildren`/`extractMapKeySymbols`.
- Add: `import { symbolsCache, flattenSymbols, indexDocument } from './services/symbolIndex';`
- In `processBatch`, replace the per-file body with `await indexDocument(document);` and build the returned map from `symbolsCache` (or have `getWorkspaceSymbols` return `symbolsCache` directly after the batch completes).
- `updateFileSymbols(uri)` → `const doc = await workspace.openTextDocument(uri); await indexDocument(doc);`
- `removeFileSymbols(uri)` → delete from both `symbolsCache` and `includeEdges` (import `includeEdges` too, or add a `removeDocument(uriString)` helper to the service — preferred). Add `removeDocument` to the service and use it here.

**Step 4: Run tests to verify they pass**

Run: `npx jest test/ai_workspaceSymbols.test.js test/ai_workspaceSymbols.debounce.test.js test/services/symbolIndex.test.js -v`
Expected: PASS (all, including the existing workspace-symbol tests).

**Step 5: Commit**

```bash
git add src/ai_workspaceSymbols.js src/services/symbolIndex.js test/ai_workspaceSymbols.test.js
git commit -m "refactor(workspace-symbols): use shared symbol-index service"
```

---

## Task 5: Add `ensureWarm()` and eager background build at activation

**Files:**
- Modify: `src/services/symbolIndex.js`
- Modify: `src/extension.js` (inside `activate`, after `registerCommands(ctx)`)
- Test: `test/services/symbolIndex.test.js`

**Context:** `ensureWarm()` is idempotent — first call kicks off a non-blocking batched build of the whole workspace; later calls are no-ops while a build is in flight or after one completes. The existing batching (`processBatch` + `setImmediate` yields) prevents UI freeze. Activation calls it; the build runs in the background.

**Step 1: Write the failing test** (append)

```js
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
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest test/services/symbolIndex.test.js -t ensureWarm -v`
Expected: FAIL — `index.ensureWarm is not a function`.

**Step 3: Write minimal implementation**

Add to `src/services/symbolIndex.js`:

```js
const DEFAULT_MAX_FILES = 500;
const DEFAULT_BATCH_SIZE = 10;

let warmState = 'cold'; // 'cold' | 'warming' | 'warm'
let warmPromise = null;

// Injectable for tests; defaults to the real workspace build.
let buildWorkspaceIndex = defaultBuildWorkspaceIndex;

async function defaultBuildWorkspaceIndex() {
  const config = workspace.getConfiguration('autoit');
  const maxFiles = config.get('workspaceSymbolMaxFiles', DEFAULT_MAX_FILES);
  const batchSize = config.get('workspaceSymbolBatchSize', DEFAULT_BATCH_SIZE);
  const files = (await workspace.findFiles('**/*.{au3,a3x}')).slice(0, maxFiles);
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async file => {
        try {
          const doc = await workspace.openTextDocument(file);
          await indexDocument(doc);
        } catch {
          /* skip unreadable files */
        }
      }),
    );
    await new Promise(resolve => setImmediate(resolve)); // yield to UI
  }
}

/** Idempotently warm the index in the background. Safe to call repeatedly. */
function ensureWarm() {
  if (warmState !== 'cold') return warmPromise;
  warmState = 'warming';
  warmPromise = Promise.resolve()
    .then(() => buildWorkspaceIndex())
    .then(() => { warmState = 'warm'; })
    .catch(() => { warmState = 'cold'; warmPromise = null; });
  return warmPromise;
}

function isWarm() {
  return warmState === 'warm';
}

function __setBuilderForTests(fn) {
  buildWorkspaceIndex = fn;
}
```

Reset warm state in `__resetForTests` (`warmState = 'cold'; warmPromise = null; buildWorkspaceIndex = defaultBuildWorkspaceIndex;`). Export `ensureWarm`, `isWarm`, `__setBuilderForTests`.

In `src/extension.js`, after `registerCommands(ctx);` add:

```js
import { ensureWarm } from './services/symbolIndex';
// ...inside activate(), after registerCommands(ctx):
ensureWarm(); // warm the symbol index in the background for fast Go-to-Definition
```

**Step 4: Run test to verify it passes**

Run: `npx jest test/services/symbolIndex.test.js -v`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/services/symbolIndex.js src/extension.js test/services/symbolIndex.test.js
git commit -m "feat(symbol-index): eager background warm-up at activation"
```

---

## Task 6: Integrate the index fast path into `provideDefinition`

**Files:**
- Modify: `src/ai_definition.js`
- Test: `test/ai_definition.test.js`

**Context:** This is the user-visible fix. After the same-document scan and before the include-graph scan, look the symbol up in the index and filter the candidates to the current document's include set. Return a single `Location` for one match, an array for several (VS Code shows a peek list), and fall through to the existing scan on a miss or cold index.

**Step 1: Write the failing test** (append to `test/ai_definition.test.js`)

```js
describe('provideDefinition index fast path', () => {
  const index = require('../src/services/symbolIndex');
  beforeEach(() => index.__resetForTests());

  it('resolves a function via the warm index when its file is in the include set', () => {
    // document at file:///proj/main.au3 that includes helper.au3
    const helperUri = require('vscode').Uri.file('/proj/helper.au3').toString();
    index.__setSymbolsForTests(helperUri, [
      { name: 'DoWork', kind: require('vscode').SymbolKind.Function,
        location: { uri: { toString: () => helperUri }, range: {} } },
    ]);
    index.__setEdgesForTests('file:///proj/main.au3', [helperUri]);
    // ...build a mock document whose uri.toString() === 'file:///proj/main.au3'
    //    and getWordRangeAtPosition returns the range of "DoWork"...
    const result = AutoItDefinitionProvider.provideDefinition(document, position);
    expect(result).not.toBeNull();
    expect((Array.isArray(result) ? result[0] : result).uri.toString()).toBe(helperUri);
  });

  it('rejects an index match whose file is NOT in the include set', () => {
    const strangerUri = require('vscode').Uri.file('/other/stranger.au3').toString();
    index.__setSymbolsForTests(strangerUri, [
      { name: 'DoWork', kind: require('vscode').SymbolKind.Function,
        location: { uri: { toString: () => strangerUri }, range: {} } },
    ]);
    index.__setEdgesForTests('file:///proj/main.au3', []); // includes nothing
    // current document has no local DoWork and no includes resolving to stranger
    const result = AutoItDefinitionProvider.provideDefinition(document, position);
    // falls through to include-graph scan, which also finds nothing here
    expect(result).toBeNull();
  });
});
```

(Use the file's existing mock conventions for `document`/`position`; the two assertions that matter are *in-scope match returned* and *out-of-scope match rejected*.)

**Step 2: Run test to verify it fails**

Run: `npx jest test/ai_definition.test.js -t "index fast path" -v`
Expected: FAIL — index match ignored (current code goes straight to include scan).

**Step 3: Write minimal implementation**

In `src/ai_definition.js`, import the service and insert the fast path in `provideDefinition` after the same-document `match` block and before `findDefinitionInIncludeFiles`:

```js
import { lookupDefinition, getIncludeSet, extractIncludeEdges, isWarm } from './services/symbolIndex';
```
```js
// Index fast path: look up the symbol, then keep only definitions whose file is
// reachable via #include from this document. Pure in-memory; no file reads.
try {
  const isVariable = lookupText.startsWith('$');
  const candidates = lookupDefinition(lookupText, isVariable);
  if (candidates.length > 0) {
    const docUriString = document.uri.toString();
    // Parse the active document's includes live so unsaved edits are honored.
    const liveEdges = extractIncludeEdges(docUriString, documentText, document);
    const includeSet = getIncludeSet(docUriString, liveEdges);
    const inScope = candidates.filter(loc => includeSet.has(loc.uri.toString()));
    if (inScope.length === 1) {
      definitionCache.set(cacheKey, inScope[0]);
      return inScope[0];
    }
    if (inScope.length > 1) {
      definitionCache.set(cacheKey, inScope);
      return inScope; // VS Code renders a peek list
    }
  }
} catch {
  // fall through to the include-graph scan
}
```

Leave the existing `findDefinitionInIncludeFiles` fallback untouched after this block.

**Step 4: Run tests to verify they pass**

Run: `npx jest test/ai_definition.test.js -v`
Expected: PASS (new tests + all existing definition tests stay green).

**Step 5: Commit**

```bash
git add src/ai_definition.js test/ai_definition.test.js
git commit -m "feat(definition): resolve F12 via warm symbol index with include-scope filter"
```

---

## Task 7: Cold-path hardening — prioritized active-doc warming + opportunistic fill

**Files:**
- Modify: `src/services/symbolIndex.js` (add `warmDocument`, `noteFileContent`)
- Modify: `src/extension.js` (register `onDidOpenTextDocument`)
- Modify: `src/ai_definition.js` (opportunistic fill in the fallback path)
- Test: `test/services/symbolIndex.test.js`, `test/ai_definition.test.js`

**Context:** Two tactics from the design:
- **(A) Prioritized warming:** when an `.au3` document opens, index it and its directly-included files first so the active file is navigable within ~1s.
- **(B) Opportunistic fill:** when the fallback scan reads a file via `getIncludeText`, hand that content to the service so it gets indexed — second navigation nearby is warm, and library files get indexed on first use.

**Step 1: Write the failing tests** (append to `test/services/symbolIndex.test.js`)

```js
describe('symbolIndex.warmDocument', () => {
  beforeEach(() => index.__resetForTests());
  it('indexes the opened document immediately', async () => {
    // mock provideDocumentSymbols via the module's indexDocument path...
    await index.warmDocument(mockDocument); // uri file:///proj/main.au3
    expect(index.symbolsCache.has('file:///proj/main.au3')).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest test/services/symbolIndex.test.js -t warmDocument -v`
Expected: FAIL — `index.warmDocument is not a function`.

**Step 3: Write minimal implementation**

Add to `src/services/symbolIndex.js`:

```js
/** Index a just-opened document ahead of the full workspace pass. */
async function warmDocument(document) {
  if (!document || !document.uri) return;
  if (!document.uri.fsPath || !document.uri.fsPath.toLowerCase().endsWith('.au3')) return;
  await indexDocument(document);
}

/**
 * Opportunistically index a file the fallback scan already read, so repeated
 * navigation self-heals and library files get indexed on first use.
 * @param {string} fsPath - Absolute path of the file.
 * @param {string} content - File text (already loaded by the caller).
 */
function noteFileContent(fsPath, content) {
  const uriString = toUriString(fsPath);
  if (symbolsCache.has(uriString) || !content) return;
  // Cheap symbol/edge extraction without re-reading: build a minimal doc-like.
  const docLike = { uri: Uri.file(fsPath), getText: () => content };
  // provideDocumentSymbols needs a real-ish document; schedule async indexing.
  Promise.resolve()
    .then(() => indexDocument(docLike))
    .catch(() => {});
}
```

Export `warmDocument` and `noteFileContent`.

In `src/extension.js` `activate`, after `ensureWarm();`:

```js
import { ensureWarm, warmDocument } from './services/symbolIndex';
// ...
ctx.subscriptions.push(
  workspace.onDidOpenTextDocument(doc => {
    if (doc.languageId === 'autoit') warmDocument(doc);
  }),
);
```

In `src/ai_definition.js` `findDefinitionInIncludeFiles`, right after a successful `getIncludeText(scriptPath)` returns content, add:

```js
noteFileContent(scriptPath, scriptContent); // opportunistically index for next time
```

(Import `noteFileContent` from the service. Wrap in nothing special — it is fire-and-forget and swallows its own errors.)

**Step 4: Run tests to verify they pass**

Run: `npx jest test/services/symbolIndex.test.js test/ai_definition.test.js -v`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/services/symbolIndex.js src/extension.js src/ai_definition.js test/services/symbolIndex.test.js
git commit -m "feat(symbol-index): prioritized active-doc warming and opportunistic cache fill"
```

---

## Task 8: Performance guard — warm lookup performs zero file reads

**Files:**
- Test: `test/ai_definition.test.js`

**Context:** The concrete proof the bug is fixed: when the index is warm and the target is in scope, `provideDefinition` must not call `getIncludeText` (no file-content reads) on the hot path. This locks in the fix against regressions.

**Step 1: Write the failing test**

```js
it('performs ZERO getIncludeText reads when resolving via the warm index', () => {
  const util = require('../src/util');
  const getIncludeTextSpy = jest.spyOn(util, 'getIncludeText');
  // arrange: warm index with an in-scope DoWork (as in Task 6 first test)
  const result = AutoItDefinitionProvider.provideDefinition(document, position);
  expect(result).not.toBeNull();
  expect(getIncludeTextSpy).not.toHaveBeenCalled();
});
```

**Step 2: Run test to verify it fails or passes**

Run: `npx jest test/ai_definition.test.js -t "ZERO getIncludeText" -v`
Expected: PASS if Task 6 is correct. If it FAILS (spy called), the fast path is leaking into the scan — investigate before proceeding.

> If `getIncludeText` is bound via a namespace import that resists spying, assert on the absence of `getIncludeScripts`/`getIncludeText` effects another way (e.g. inject counting mocks through the existing util mock the file already sets up). The intent is: no include-file content is read on a warm in-scope hit.

**Step 3 (only if failing): fix the leak**

Ensure the Task 6 fast path `return`s before reaching `findDefinitionInIncludeFiles` on an in-scope hit, and that `extractIncludeEdges` uses the in-memory `getIncludePath` resolution (path-only) rather than reading file contents.

**Step 4: Run the full suite**

Run: `npm test`
Expected: same 7 pre-existing failures as baseline, 0 new failures. Confirm the definition and symbol-index suites are fully green.

**Step 5: Commit**

```bash
git add test/ai_definition.test.js
git commit -m "test(definition): guard warm-index lookup against file reads"
```

---

## Task 9: Changelog and design cross-reference

**Files:**
- Modify: `CHANGELOG.md` (match the existing entry style)
- Test: none (docs)

**Step 1: Add a changelog entry**

Under the appropriate unreleased/next-version heading, add:

```markdown
- Performance: Go to Definition (F12) now resolves through a warm, incrementally
  maintained symbol index instead of rescanning the include graph on every press,
  fixing multi-second delays on large workspaces (#241). Definitions are still
  scoped to files reachable via `#include`.
```

**Step 2: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs: changelog for fast Go-to-Definition (#241)"
```

---

## Final verification (before finishing the branch)

1. `npm test` — only the 7 known pre-existing macOS failures remain; symbol-index, workspace-symbol, and definition suites fully green.
2. `npm run lint:check` — no new lint errors in changed files.
3. Manual smoke (optional, in Extension Development Host): open a large multi-include project, press F12 on a UDF call — should jump near-instantly after the brief warm-up; jumping to a same-named function in a non-included file should not occur.

When complete, use **superpowers:finishing-a-development-branch** to integrate the work.
