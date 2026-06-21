# Fast Go-to-Definition Design (Issue #241)

## Problem

On large AutoIt workspaces (~50k lines, ~25 transitively-mapped includes), Go to
Definition (F12) takes ~5 seconds. The slowness persists across versions 1.4.0
and 1.5.0.

The root cause is that every F12 press redoes work from scratch in
`findDefinitionInIncludeFiles` ([src/ai_definition.js](../../src/ai_definition.js)):

1. **Rebuilds the entire recursive include graph** via `getIncludeScripts` —
   regex-scanning every reachable file for `#include` directives, recursively.
2. **Re-resolves every include path** (`getIncludePath` → `findFilepath` plus
   `safeFileExists` filesystem hits) for every script in the graph.
3. **Re-runs the definition regex** against each file's full text.

Existing caches do not cover the felt cost:

- `includeCache` (5s grace) caches only *file content reads*, not the graph
  traversal, path resolution, or definition scan.
- `definitionCache` only helps when F12 is pressed on the **same symbol** twice
  with no intervening edit — it does nothing for first-time navigation, which is
  what users experience as slow.

Meanwhile, `ai_workspaceSymbols.js` already maintains a `symbolsCache`
(file URI → parsed `SymbolInformation[]`, incrementally updated by a
FileSystemWatcher) — exactly the index F12 ignores. It is, however, built lazily
(only on first Ctrl+T workspace-symbol search), so it is not guaranteed warm at
F12 time. (The Outline panel is filled by a separate per-document provider,
`provideDocumentSymbols` in `ai_symbols.js`, not by this workspace cache.)

## Scope

Targeted F12 performance fix only. The `parameterDoc` regex SyntaxError reported
in the same issue was already addressed separately.

## Goal

F12 resolves in milliseconds on large workspaces by looking up a pre-built,
incrementally-maintained symbol index instead of rebuilding the include graph and
regex-scanning every file on each press. The cold path must never be slower than
today, and must improve over time as the user navigates.

## Architecture

Extract the cache into a shared service, `src/services/symbolIndex.js`, so the
workspace-symbol provider and the definition provider share one source of truth.

The service owns:

- `symbolsCache: Map<uriString, SymbolInformation[]>` — moved from
  `ai_workspaceSymbols.js`.
- `includeEdges: Map<uriString, string[]>` — for each file, its resolved
  `#include` target URIs (see Include-scope filtering).
- `lookupDefinition(name, kind)` — returns matching `Location[]` from the index.
- `getIncludeSet(documentUri)` — in-memory transitive reachable-file set.
- `ensureWarm()` — idempotent; kicks off the batched background build once.
- The FileSystemWatcher wiring (`onDidChange` / `onDidCreate` / `onDidDelete`)
  that keeps both maps fresh.

`ai_workspaceSymbols.js` keeps its `provideWorkspaceSymbols` provider but now
reads/writes the shared cache. Ctrl+T behavior is unchanged.

`extension.js activate()` calls `ensureWarm()` — a non-blocking background build
using the existing `processBatch` batching, so the UI never freezes and the index
is warm before the user's first F12.

## F12 data flow (`provideDefinition`)

1. **Same-document scan** (unchanged) — precise for local variables and same-file
   definitions.
2. Miss → **index lookup** by symbol name → candidate `Location[]`.
3. **Filter candidates to the current document's include set** (in-memory). Drop
   any whose file is not reachable via `#include`. Return the survivors (VS Code
   renders a peek list when more than one).
4. Cold index or zero in-scope matches → **fall back** to today's include-graph
   scan, then `null`.
5. Cache the resolved `Location` in `definitionCache` (unchanged, edit-invalidated).

The index is a fast path layered *between* the existing local scan and the
existing include scan — additive, not a rewrite.

## Index lookup semantics

- **Case-insensitivity:** AutoIt names are case-insensitive; `lookupDefinition`
  lowercases both query and indexed names (matching the Find All References
  convention).
- **Function lookup** (token without leading `$`): match
  `kind === SymbolKind.Function`.
- **Variable lookup** (token with leading `$`): match
  `Variable` / `Constant` / `Enum`. Locals are already resolved by step 1, so the
  index step effectively serves **globals** — which is what it contains.
- **Collisions:** return all in-scope matches; VS Code shows the peek list.

## Include-scope filtering (in-memory)

A definition only counts if its file is reachable via `#include` from the current
document. To enforce this without rebuilding the graph per F12:

- **Include-edge map** is populated during the same batched index build (each
  file is already read; extract and resolve its `#include` targets once, at index
  time) and kept fresh by the same FileSystemWatcher.
- `getIncludeSet(documentUri)` is a pure in-memory BFS/DFS over the edge map →
  `Set<uriString>` of all transitively-included files plus the document itself.
  No disk I/O, no regex scanning. Memoized per document, invalidated when the edge
  map changes.
- **Active-document caveat:** the watcher fires on save, not keystroke, so for the
  active document we parse its live text for `#include` lines directly (one cheap
  file) and use cached edges downstream — correct while editing.

## Improving the cold lookup

Two complementary tactics, both applied:

**(A) Prioritized warming of the active document's include graph.** On activation
and on each `onDidOpenTextDocument` for an `.au3` file, index that document's
reachable include set *first*, ahead of the rest of the workspace batch. The files
most likely to be F12 targets are warm within ~1s, even while the full-workspace
pass is still running.

**(B) Cold scans populate the cache as a side effect.** When a cold/fallback
lookup must read a file, index that file's symbols and include edges as it goes.
The cache fills in along the paths the user actually navigates, so nearby repeat
lookups are warm. This also progressively indexes **library files**
(`_Array.au3`, etc.) the moment they are first resolved via the fallback,
addressing the reporter's `_Array...` jump complaint over time.

**Deliberately avoided:** awaiting the in-progress warm-up build on a cold F12 —
it blocks the keypress with unpredictable latency. Falling through to the scan and
opportunistically filling the cache gives responsiveness now plus a compounding
speedup.

## Edge cases & error handling

- **Cold index:** falls through to today's scan — same speed as now, never worse.
- **Standard UDF / library files** (outside the workspace, not covered by
  `workspace.findFiles`): handled by the include-graph fallback initially, then
  indexed opportunistically via tactic (B).
- **Unsaved include edits:** handled by live-parsing the active document.
- **`workspaceSymbolMaxFiles` cap (500):** unchanged; files beyond the cap rely on
  the fallback.
- **Robustness:** `lookupDefinition`, `getIncludeSet`, and `ensureWarm` are wrapped
  so any failure degrades to the existing scan rather than breaking F12. The
  existing `DefinitionProviderError` hierarchy is retained.

## Testing

- **Unit:** `lookupDefinition` (function / variable / case-insensitive /
  collision); `getIncludeSet` (transitive, circular, active-doc live includes);
  include-scope filtering rejects un-included matches.
- **Integration:** F12 resolves a function in an included file via the index; F12
  on an un-included same-named function is rejected; cold index falls back; a
  library `_Array` jump still works.
- **Regression:** existing `ai_definition` tests stay green.
- **Performance:** assert that a warm-index lookup performs **zero**
  `getIncludeText` / file-content reads on the hot path — the concrete proof the
  bug is fixed.
