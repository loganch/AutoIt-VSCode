# Auto-Insert `#include` on Completion Acceptance

**Date:** 2026-06-18
**Status:** Approved (Approach C)
**Scope:** Single implementation plan

## Goal

When a user accepts a UDF function completion (e.g. `_ArrayDisplay`) or a UDF
constant completion (e.g. `$MB_OK`) whose required `#include <...>` is not yet
present in the document, VS Code should automatically insert that `#include`
line. This replaces the current behavior where the required include is only
shown in the completion's hover/documentation and must be typed by hand.

## Background

The extension ships two families of static completions, each with a known
required include:

- **UDF function completions** — built in `src/signatures/udf_*.js` and
  `src/signatures/WinAPIEx/*.js` via `signatureToCompletion()` in
  `src/util.js:687`. Each module declares a `const include` string such as
  `'(Requires: \`#include <Array.au3>\`)'` and passes it as the `detail`
  argument. The include therefore appears in the completion's `detail` field,
  but the exact format varies between modules (some wrap in
  `(Requires: ...)`, some don't).
- **UDF constant completions** — built in `src/completions/constants_*.js` via
  `fillCompletions()` in `src/util.js:571`. The required include filename is
  passed as the `requiredScript` argument and appended to the `documentation`
  MarkdownString as an AutoIt codeblock.

Both builders produce flat arrays of `CompletionItem`-shaped objects. The
arrays are built once at module load and cached in `src/completions/index.js`,
then merged into the per-request result list by
`provideCompletionItems` in `src/ai_completion.js:365`. Because the same
array instances are reused across every document and every request, any
per-document mutation (such as attaching `additionalTextEdits`) must be done
on clones, never on the shared cached objects.

Include detection in the document uses two regexes from `src/util.js`:
`includePattern` (quoted form `#include "x.au3"`) and
`libraryIncludePattern` (angle form `#include <x.au3>`).

## Approach

**Approach C — stamp an explicit `requiredInclude` field at build time; the
completion provider attaches `additionalTextEdits` per request.**

Rejected alternatives:

- **A. Attach `additionalTextEdits` at static build time** — rejected because
  the static arrays are shared across all documents. Whether an include is
  "missing" depends on the current document, which is unknown at build time.
- **B. Parse the include filename out of `detail`/`documentation` in the
  provider** — rejected as fragile. The `include` string format varies across
  modules, and constants put the include in `documentation` while UDFs put it
  in `detail`, so two different parsers would be needed.

Approach C keeps the include filename as explicit first-class metadata on the
completion item, parses it once at build time with a single regex, and
centralizes all per-document logic in one new helper in the provider.

## Design

### Touch-points

Three edits, each with one responsibility:

1. **`src/util.js` — `fillCompletions`** (line 571): when `requiredScript` is
   non-empty, add `requiredInclude: requiredScript` to each produced item.
2. **`src/util.js` — `signatureToCompletion`** (line 687): parse the include
   filename out of the `detail` string with `/#include\s+<([^>]+)>/` and, on a
   match, add `requiredInclude` to each produced item. No-op when `detail` has
   no `#include <...>` substring (e.g. built-in functions, keywords, macros).
3. **`src/ai_completion.js` — `provideCompletionItems`** (line 365): after
   building the merged result list, call a new `attachIncludeEdits(items,
   document)` helper that clones items needing an edit and attaches
   `additionalTextEdits`.

### New helper: `attachIncludeEdits`

Lives in `src/ai_completion.js` (or, if preferred for isolation, a new
`src/utils/includeAutoInsert.js` — decision deferred to implementation plan).
Behavior:

```
attachIncludeEdits(items, document) -> items
  1. Read config: workspace.getConfiguration('autoit').get('autoInsertInclude', true).
     If false, return items unchanged.
  2. docText = document.getText().
  3. Collect the set of unique requiredInclude values present on items.
     If empty, return items unchanged.
  4. Determine which of those are missing from docText:
     - An include is present if docText contains a #include line (either
       <...> or "..." form) whose filename matches the requiredInclude.
     - Match rule: compare case-insensitively after normalizing both sides
       by stripping a trailing ".au3" extension. So requiredInclude
       "Array.au3" matches any of: `#include <Array.au3>`,
       `#include <array.au3>`, `#include "Array.au3"`,
       `#include "Array"` (extension-stripped form).
     Reuse the existing includePattern / libraryIncludePattern regexes from
     util.js to scan docText; collect matched filenames into a Set, then
     filter the required set against it using the normalization rule above.
  5. Compute the insertion line:
     - Scan document lines once for /^#include\b/ (case-insensitive).
     - If matches exist, insertionLine = (last match line) + 1.
     - If no matches, insertionLine = 0.
  6. Build a map: requiredInclude -> TextEdit
     (TextEdit.insert(new Position(insertionLine, 0),
                      `#include <${requiredInclude}>\n`))
     One edit per missing include; shared across all items needing it.
  7. Map over items:
     - If item has requiredInclude AND that include is in the missing set:
       return Object.assign({}, item, {
         additionalTextEdits: [editFor(requiredInclude)]
       })
     - Otherwise return item unchanged (no clone, no mutation).
```

Critical invariants:

- **Never mutate the cached static `completions`** (shared across documents).
  Only `Object.assign` clones of items that actually receive
  `additionalTextEdits`.
- Items already present in the document are returned as-is — no edit, no
  clone.
- VS Code applies `additionalTextEdits` only for the *accepted* item, so even
  though many items may reference the same edit, only one `#include` line is
  inserted per acceptance.

### Configuration

Add to `package.json` `contributes.configuration.properties`:

```json
"autoit.autoInsertInclude": {
  "type": "boolean",
  "default": true,
  "description": "Automatically insert the required #include <...> line when accepting a UDF function or constant completion that isn't yet included in the document."
}
```

Read once per `provideCompletionItems` call (mirrors how the existing
`enableParenTriggerForFunctions` is read, though no caching is required here
since the read is cheap and only happens on completion requests).

### Data flow

```
provideCompletionItems(document, position)
  -> build merged list (existing logic, unchanged)
  -> attachIncludeEdits(list, document)   // NEW
  -> return list
```

### Error handling

Consistent with the `safeExecute` / `handleError` patterns in `util.js`:

- Missing or empty `requiredInclude` on an item -> skip that item (no edit).
- Include already present (either `<...>` or `"..."` form, case-insensitive
  filename match after stripping `.au3`) -> skip that item.
- Empty document / no lines -> insert at line 0.
- Any thrown error inside `attachIncludeEdits` is caught; on failure the
  original items are returned unchanged so completion still works, just
  without auto-insert. Error is logged via `console.error` with an
  `[AutoIt Extension]` prefix matching `handleError`'s convention.

### Testing

Extend `test/ai_completion.test.js` with cases:

- UDF function completion (`_ArrayDisplay`) gets `additionalTextEdits`
  targeting `Array.au3` when the document has no `#include <Array.au3>`.
- UDF function completion gets no edit when `#include <Array.au3>` is already
  present.
- Constants completion (`$MB_OK` from MsgBoxConstants) gets an edit for
  `MsgBoxConstants.au3` when missing.
- Insert position: new `#include` line appears immediately after the last
  existing `#include` line.
- Insert position fallback: when the document has no `#include` lines, the
  edit targets line 0.
- `autoit.autoInsertInclude = false` -> no item in the result has
  `additionalTextEdits`.
- Case-insensitive match: `#include <array.au3>` counts as present (no edit).
- Both forms count as present: `#include "Array.au3"` also suppresses the
  edit.
- Cached static completions are not mutated: requesting completions for two
  documents (one with `Array.au3` included, one without) and asserting the
  shared `_ArrayDisplay` item instance is unchanged after each request.

Add unit tests for `fillCompletions` and `signatureToCompletion` confirming
the `requiredInclude` field is stamped correctly (and absent when no include
applies, e.g. for built-in functions / keywords / macros).

### Out of scope

- Dynamic include/library completions from `getIncludeCompletions` and
  `getLibraryFunctions` — these originate from files the user has already
  included, so the include is present by definition and no auto-insert is
  needed.
- Reordering or deduplicating existing `#include` lines.
- Handling `#include-once`.
- AutoIt header comment block detection for insertion placement (the chosen
  rule is simply "after the last `#include`, else line 0").
