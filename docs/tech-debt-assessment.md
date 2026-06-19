# Brooks-Lint — Tech Debt Assessment

**Mode:** Tech Debt Assessment
**Scope:** AutoIt-VSCode (whole project) — `src/` (~120 JS files, VS Code extension, pure JS + webpack/babel).

> Note: the `_shared/` framework files (`common.md`, `decay-risks.md`, `source-coverage.md`) referenced by the brooks-debt skill were absent from the install, so this report uses the Iron Law (Symptom → Source → Consequence → Remedy), Pain × Spread scoring, and the Debt Summary Table as defined in the available `debt-guide.md`. The numeric Health Score formula from `common.md` is omitted.

**Summary:** The codebase is mid-migration — a flat `ai_*.js` feature layout is being pulled into organized subdirectories (`commands/`, `services/`, `parsers/`, `utils/`, `completions/`, `hovers/`, `signatures/`), and CommonJS is being moved to ESM — but both migrations are ~half done. The dominant structural problem is `src/util.js`: an 825-line God module imported by **105 files** that simultaneously owns constants, regex, error handling, FS/cache plumbing, path/include resolution, completion transforms, and signature parsing, plus backward-compat re-exports. Around it sit two pairs of duplicated singletons (the tracking services, the parsers) and two parallel include-resolution implementations. Import-time side effects, module-level unbounded caches, a Windows-registry write buried in a config module, and worked-around circular dependencies round out the picture. Almost all of this is **accidental** debt from organic growth, not deliberate shortcuts.

---

## How to use this document

Each finding has a checkbox. Work top-down within a risk group, or jump to the Debt Summary at the bottom to see which risks have the highest average priority. Priorities: 7–9 Critical (next sprint), 4–6 Scheduled (within quarter), 1–3 Monitored (log and watch). `Priority = Pain × Spread` (max 9).

---

## Findings

### R1 — Cognitive Overload

- [x] **F1. `util.js` is a God module with 11 responsibilities and 105 importers** — Priority 6 (P2 × S3), Scheduled, accidental — *Resolved: split into `utils/regexPatterns.js` (cached regex + escaping), `utils/variableRegex.js` (variable-declaration matching), `utils/fsCache.js` (validation + FS/include-content caching), `utils/includeResolution.js` (path/include resolution + line skipping), `utils/functionSignature.js` (signature/param parsing). `util.js` is now a 66-line barrel re-exporting these plus `completionTransforms` for the ~10 remaining consumers. 603 tests pass.*
  - **Symptom:** One 825-line file carries section-bannered concerns: markdown constants, variable-regex matching, cached regex, error handling, input validation, FS utils + include cache, path/include resolution, doc analysis, completion transforms, signature analysis, and backward-compat re-exports (`src/util.js:1-959`).
  - **Source:** Organic accretion plus an incomplete refactor — `util.js` re-exports `AI_CONSTANTS`/`AUTOIT_MODE` from `coreConstants` and `findFilepath` from `ai_config` "for backward compatibility" (`src/util.js:916-936`).
  - **Consequence:** Developers must scan 11 sections to find anything; changes to one concern risk colliding with another; the file is the default dump location for new helpers.
  - **Remedy:** Split into focused modules (`includeResolution.js`, `functionSignature.js`, `completionTransforms.js`, `fsCache.js`, `errorUtils.js`); keep `util.js` as a thin barrel only during transition.

- [x] **F2. `ai_config.js` mixes 9 responsibilities behind a "config" name** — Priority 4 (P2 × S2), Scheduled, accidental — *Resolved: extracted `autoItInstallDetector.js` (registry/Program-Files detection), `pathResolver.js` (`resolveVariables`/`splitPath`/`fixPath`), and `smartHelpMigrator.js` (`upgradeSmartHelpConfig`). `ai_config.js` keeps the token-color migration, the stateful path-verification/getPaths pipeline, the Proxy, the listener registry, and the registry write (tracked separately under F19) — those stay because they share mutable module state (`aiPath`, `conf`, `showErrors`) that isn't a good split boundary. 603 tests pass.*
  - **Symptom:** 538 lines doing token-color migration, path splitting, VS Code variable resolution, registry-based install auto-detection, smartHelp config upgrade, path verification, a Proxy config object, a listener registry, and a Windows registry write (`src/ai_config.js:1-612`).
  - **Source:** Configuration, path resolution, and OS integration grew together in one module.
  - **Consequence:** "Config" no longer describes the module; the Proxy makes data flow hard to trace; side effects hide among helpers.
  - **Remedy:** Extract `pathResolver.js`, `autoItInstallDetector.js`, `smartHelpMigrator.js`; leave `ai_config.js` as a thin config facade.

- [x] **F3. `activate()` is a 277-line orchestrator handling 8+ concerns** — Priority 4 (P2 × S2), Scheduled, accidental — *Resolved: extracted `setupDocumentTracking(ctx)` (tracking services + open/change/save/close listeners), `setupConfigSync(ctx, mapTrackingService, variableTrackingService)` (config-change handling), and `setupDiagnostics(ctx)` (Au3Check diagnostic collection + listeners) in `src/extension.js`. `activate` now only composes feature registration, command registration, and these three helpers. 603 tests pass.*
  - **Symptom:** `activate` registers features + commands, warms the symbol index, wires 4 document-event handlers, handles config changes, and sets up diagnostics with 4 listeners (`src/extension.js:211-488`).
  - **Source:** Lifecycle wiring accreted in the entry point without extraction.
  - **Consequence:** Any lifecycle change requires editing a giant function; event-handler interactions are hard to reason about.
  - **Remedy:** Extract `setupDocumentTracking(ctx)`, `setupDiagnostics(ctx)`, `setupConfigSync(ctx)` helpers; have `activate` only compose them.

- [x] **F4. Inconsistent naming and import placement in the parser layer** — Priority 1 (P1 × S1), Monitored, accidental — *Resolved: moved imports to top of VariableParser.js (were after function definition at lines 15-30); standardized udfRegistry.js WinAPI* imports to snake_case udf_winapi_* pattern for consistency with other UDF imports. 603 tests pass.*
  - **Symptom:** `VariableParser.js` places an `import` block after a function definition (`src/parsers/VariableParser.js:15-34`); `udfRegistry.js` mixes snake_case `udf_*` imports with PascalCase `WinAPI*` imports (lines 12-77).
  - **Source:** Ad-hoc naming during the flat→organized migration; imports added incrementally.
  - **Consequence:** Mild confusion locating/renaming imports; inconsistent code style.
  - **Remedy:** ✓ Moved imports to file top in VariableParser.js; standardized naming in udfRegistry.js to use `udf_winapi_*` pattern throughout.

### R2 — Change Propagation

- [x] **F5. Adding a UDF requires editing two near-identical 80-line index files** — Priority 6 (P2 × S3), Scheduled, accidental — *Resolved: both registries now derive from a single module list in `src/udfRegistry.js`; the two `index.js` files are thin derivations.*
  - **Symptom:** `completions/index.js` and `hovers/index.js` maintain parallel import lists of the same ~80 signature/completion modules, one importing `completions as X`, the other `hovers as X` (`src/completions/index.js:1-204`, `src/hovers/index.js:1-208`).
  - **Source:** Each signature module exports both `completions` and `hovers`, and the two registries were built by duplication rather than a shared source of truth.
  - **Consequence:** Every new UDF = edits to both index files plus the signature file; easy to register completions but forget hovers (silent gap).
  - **Remedy:** Generate both registries from one module list (e.g. a single `udfModules.js` array, or auto-discover via a manifest); or have each signature module self-register.

- [x] **F6. Adding a command requires coordinated edits across 4 locations** — Priority 4 (P2 × S2), Scheduled, accidental — *Resolved: added `commandRegistry.js` (single id→handler map) which `registerCommands` iterates directly; removed the redundant per-command re-exports from `ai_commands.js`. A guard test (`commandRegistry.test.js`) asserts registry ids === `commandsList` === package.json contributions, so drift now fails loudly instead of silently. package.json stays a separate edit (VS Code reads it statically), so a new command = registry entry + `commandsList` id + package.json, all guarded.*
  - **Symptom:** A new command must be added to the command module, `commandsList.js` (string), `ai_commands.js` (re-export), and `package.json` (command + menu + keybinding) (`src/commandsList.js:1-23`, `src/ai_commands.js:197-217`, `src/registerCommands.js:5-13`).
  - **Source:** String-name indirection — `registerCommands` looks up functions by name via `Object.entries(aiCommands)` keyed on `commandsList`.
  - **Consequence:** Easy to miss the re-export or the string list; the command silently fails to register.
  - **Remedy:** Have each command module export its own command id + handler; let `registerCommands` iterate modules directly; derive `commandsList` from the manifest.

- [x] **F7. `util.js` blast radius: 105 importers ripple on any change** — Priority 6 (P2 × S3), Scheduled, accidental *(shares source with F1; distinct risk)* — *Resolved: extracted the completion/signature transforms + header constants into `completionTransforms.js` (and `handleError`/`safeExecute` into a leaf `errorUtils.js`); repointed the ~97 data files to import directly from `completionTransforms`. `util.js` importers dropped from ~107 to 8; it re-exports the transforms for the remaining feature modules. Also largely retires F26.*
  - **Symptom:** 105 files import from `./util` — all 80+ signature/completion data files plus every feature module (`util.js` dependents grep).
  - **Source:** `util.js` is the shared dependency hub for both the data layer and the feature layer.
  - **Consequence:** Renaming/moving any export forces a 105-file change; the "Maintaining API Compatibility" re-exports exist *because* this is already painful.
  - **Remedy:** Same split as F1; consumers import from the focused module that owns the symbol they need.

- [x] **F8. Wiring and boilerplate duplicated across `extension.js`/`diagnosticUtils.js`** — Priority 2 (P1 × S2), Monitored, accidental — *Resolved: extracted a `debugLog(msg)` helper (`src/debugLog.js`, TDD'd) replacing the ~5 copy-pasted debug-log blocks; extracted a `syncDocumentImmediate(filePath, text)` closure replacing the 3 duplicated map/variable update try/catch blocks; merged the two `onDidOpenTextDocument` registrations into one (warm + sync). Also retires F15.*
  - **Symptom:** `workspace.onDidOpenTextDocument` is registered twice (`src/extension.js:238` and `:285`); the `variableTrackingService.updateFileImmediate` try/catch is repeated 4× (`:289-295`, `:320-326`, `:354-360`); the `cfg?.get?.('debugLogging')` + `createOutputChannel` debug-log pattern repeats ~6× (`src/diagnosticUtils.js:248-333`, `src/extension.js:436-468`).
  - **Source:** Copy-paste wiring rather than helpers.
  - **Consequence:** Bug fixes (e.g. to debug logging) must be applied in N places; some handlers diverge.
  - **Remedy:** Extract a `debugLog(msg, err)` helper and a single `trackDocumentLifecycle(ctx, services)` wiring function.

### R3 — Knowledge Duplication

- [x] **F9. `MapTrackingService` and `VariableTrackingService` are duplicate singletons** — Priority 4 (P2 × S2), Scheduled, accidental — *Resolved: extracted `src/services/TrackingServiceBase.js` owning the singleton lifecycle (WeakMap-keyed-per-subclass, so no per-class `static instance`/`getInstance`/`resetInstance` boilerplate), debounced/immediate parse, concurrent-parse re-queueing, cancel-aware `removeFile`/`clear`/`updateConfiguration`, and the `#include` fan-out (`_ensureIncludedFilesParsed`). `MapTrackingService`/`VariableTrackingService` are now ~60-line subclasses providing only `createParser` (parser factory) plus their type-specific query and merge strategy. Unifying onto the base also propagated `VariableTrackingService`'s better `_parseFile` re-queueing and `removeFile`/`clear` cancel logic to `MapTrackingService`, retiring the divergence called out in the consequence. Both services now read includes via `fs.promises.readFile` (Map already did; Variable's callback-based `_readFile` was dropped and its test mock switched to `fs.promises`). 603 tests pass.*
  - **Symptom:** Two classes (~239 and ~315 lines) share identical `getInstance`/`updateConfiguration`/`resetInstance`/`updateFile`/`updateFileDebounced`/`updateFileImmediate`/`_parseFile`/`removeFile`/`clear` structure; `VariableTrackingService.js:3` states "Based on MapTrackingService.js structure" (`src/services/MapTrackingService.js`, `src/services/VariableTrackingService.js`).
  - **Source:** Copy-paste of the singleton + debounce + include-merge scaffold.
  - **Consequence:** They have already diverged — `VariableTrackingService` has `latestQueuedSource` re-queueing and proper `removeFile`/`clear` cancel logic that `MapTrackingService` lacks; fixes must be made twice.
  - **Remedy:** Introduce a generic `TrackingService` base (parser factory + merge strategy); subclass for Map vs Variable.

- [x] **F10. `IncludeResolver` duplicates `util.js` include resolution** — Priority 4 (P2 × S2), Scheduled, accidental — *Resolved: `IncludeResolver.parseIncludes` now matches with the same `REGEX_PATTERNS.relativeInclude`/`libraryInclude` that `utils/includeResolution.js` uses (the patterns were tightened from `\s` to `\s+` to match `IncludeResolver`'s more permissive — and correct — behavior), so the `#include` matching rule lives in one place. The two resolution strategies (filesystem-only vs. VS Code document + `findFilepath`-aware) remain separate, since they serve genuinely different consumers (`TrackingServiceBase` vs. `ai_definition`/`functionSignature`), but can no longer drift on what counts as an include directive. Also retires F11 (`IncludeResolver` now imports `DEFAULT_MAX_INCLUDE_DEPTH` from `constants.js` instead of redefining it). 604 tests pass.*
  - **Symptom:** `util.js` has `getIncludePath`/`getIncludeScripts` + 4 include regexes; `IncludeResolver` has `parseIncludes`/`resolveIncludePath`/`resolveAllIncludes` with its own combined regex `/^\s*#include\s+([<"])([^>"]+)[>"]/i` (`src/util.js:100-132,361-527`, `src/utils/IncludeResolver.js:22-129`).
  - **Source:** Two independent implementations of the same AutoIt `#include` concept.
  - **Consequence:** Edge-case behavior (quoting, spacing, comments) can diverge; a bug fixed in one isn't fixed in the other.
  - **Remedy:** Make `IncludeResolver` the single implementation; have `util.js` delegate to it.

- [x] **F11. `DEFAULT_MAX_INCLUDE_DEPTH` defined twice** — Priority 1 (P1 × S1), Monitored, accidental — *Resolved alongside F10: `IncludeResolver` now imports `DEFAULT_MAX_INCLUDE_DEPTH` from `constants.js` instead of redefining it locally.*
  - **Symptom:** Value `3` defined in `src/constants.js:162` and re-defined locally in `src/utils/IncludeResolver.js:4` (which does not import it).
  - **Source:** `IncludeResolver` was written self-contained.
  - **Consequence:** Changing the canonical constant silently leaves `IncludeResolver` on the old depth.
  - **Remedy:** Import the constant from `constants.js` in `IncludeResolver`.

- [x] **F12. `parseFunctionBoundaries` and `splitByTopLevelCommas` duplicated between parsers** — Priority 2 (P1 × S2), Monitored, accidental — *Resolved: extracted a shared `parseFunctionBoundaries(lines, ensureDollarPrefix = false)` helper into `utils/functionSignatureParsing.js`; both `MapParser` and `VariableParser` now delegate to it (VariableParser passes `ensureDollarPrefix = true` to preserve its `$`-prefixed parameter behavior, MapParser uses the default). The near-identical method bodies collapsed to one-line delegations. Removed `VariableParser.splitByTopLevelCommas` and switched its sole caller (`_pushDeclarationSegments`) to the existing `splitTopLevel` from the same utils module — `splitTopLevel` is a strict superset (handles quotes and `{}` braces in addition to `()`/`[]`) and produces identical variable names + columns for the declaration-split use case (the column lookup uses `cleanedLine.indexOf(varName, searchFrom)`, which is split-agnostic). Also dropped the now-unused `parseFunctionDeclarationLine`/`parseParameterNames` imports from `MapParser`. 604 tests pass.*
  - **Symptom:** `MapParser.parseFunctionBoundaries` and `VariableParser.parseFunctionBoundaries` are near-identical (`src/parsers/MapParser.js:124-154`, `src/parsers/VariableParser.js:51-80`); `VariableParser.splitByTopLevelCommas` re-implements `splitTopLevel` from `utils/functionSignatureParsing.js` that `MapParser` already imports (`src/parsers/VariableParser.js:15-30`).
  - **Source:** Parser written by cloning the other.
  - **Consequence:** Function-boundary parsing fixes apply twice; the comma-splitter risks diverging.
  - **Remedy:** Extract a shared `parseFunctionBoundaries(lines)` helper and reuse `splitTopLevel`.

- [x] **F13. Constants and `REGEX_PATTERNS` scattered across 3 files** — Priority 6 (P2 × S3), Scheduled, accidental (backward-compat re-exports: intentional, no payback plan → treat as accidental) — *Resolved: migrated the 8 remaining consumers (`ai_completion`, `ai_definition`, `ai_hover`, `ai_references`, `ai_signature`, `ai_symbols`, `includeGraph`, `symbolIndex`) plus `commands/UtilityCommands.js` off `util.js`'s `AI_CONSTANTS`/`AUTOIT_MODE`/`REGEX_PATTERNS`-derived re-exports to import directly from `utils/coreConstants` and `utils/regexPatterns`; removed those re-exports (and the individual pattern re-exports) from `util.js`. `coreConstants`/`regexPatterns` remain a deliberate two-tier layering (frozen base + extended set), which is no longer obscured by a third re-exporting layer. 604 tests pass.*
  - **Symptom:** `REGEX_PATTERNS` is defined frozen in `coreConstants.js:12` and rebuilt in `util.js:100` via spread; constants live in `constants.js`, `utils/coreConstants.js`, and inline in `util.js`; `util.js` re-exports `AI_CONSTANTS`/`AUTOIT_MODE` "for backward compatibility" (`src/util.js:916-917`).
  - **Source:** An extract-constants refactor was started but consumers were not migrated off `util.js`.
  - **Consequence:** No single source of truth for regex or constants; `util.js`'s `REGEX_PATTERNS` can drift from `coreConstants`' frozen base.
  - **Remedy:** Migrate consumers to import constants/regex from `coreConstants` directly; remove the re-exports.

- [x] **F14. `parenTriggerOn` config-tracking state duplicated** — Priority 1 (P1 × S1), Monitored, accidental — *Resolved: `ai_completion.js` dropped its own `parenTriggerOn` state + listener and now calls `isParenTriggerOn()`, exported from `completionTransforms.js` (the sole owner of the setting + listener). 604 tests pass.*
  - **Symptom:** `let parenTriggerOn` + a `workspace.onDidChangeConfiguration` listener exists in both `util.js:534-540` and `ai_completion.js:35-40`.
  - **Source:** The completion module re-implemented config tracking instead of importing it.
  - **Consequence:** Two independent state copies and two listeners for one setting; they could disagree.
  - **Remedy:** Centralize in one module (or read config live at call time) and drop the duplicate.

- [x] **F15. Debug-logging boilerplate duplicated ~6×** — Priority 2 (P1 × S2), Monitored, accidental — *Resolved alongside F8: all sites now call the single `debugLog(msg)` helper in `src/debugLog.js`.*
  - **Symptom:** The `try { cfg?.get?.('debugLogging') … createOutputChannel … console.debug }` block appears ~4× in `diagnosticUtils.js` and ~2× in `extension.js` (`src/diagnosticUtils.js:248-333`, `src/extension.js:436-468`).
  - **Source:** Defensive logging copied each time it was needed.
  - **Consequence:** ~120 lines of near-identical scaffolding; changes require N edits.
  - **Remedy:** One `debugLog(scope, msg, err)` helper.

### R4 — Accidental Complexity

- [x] **F16. Mixed module systems (CommonJS + ESM) across the codebase** — Priority 6 (P2 × S3), Scheduled, accidental — *Resolved: converted all 8 `module.exports` sites to ESM (5 service classes → `export default Class`; `command_constants`/`parameterValidation`/`pathValidation` → named `export {}`), and all top-level `require()` to static `import` (Node builtins, `vscode`, `jsonc-parser`, `iconv-lite`, `perf_hooks`, `events`, plus the 6 `require('../../package.json')` sites across `ai_commands`/`ai_config`/`ScriptCommands`/`UtilityCommands` — also retiring the triple-`require(package.json)` portion of F21). Lazy `require('../completions')`/`require('../hovers')` → `await import()` (`provideCompletionItems` was already async; `provideHover` made async — VS Code accepts Promise returns). Lazy `require('./ai_definition')` in `ai_references` → top-level static import: the "circular import at module load" comment was stale (only `extension.js` imports `ai_references`, so `ai_definition`'s transitive deps cannot cycle back; confirmed by eslint `import/no-cycle` staying green). Lazy `require('vscode')` in `ProcessManager` and `require('../commandsList')` in `OutputChannelManager` → top-level static imports (no cycles). The 5 service-class test files now access `.default` on the `require()` (minimal change; a hoisted `import` would break `KeybindingService.test.js`, whose `jest.mock` factories reference outer `mock*` vars that a hoisted import would predate), and 3 `ai_hover` tests are `async`+`await`. The only remaining `require(` text in `src/` is a single-quoted string literal in `ToolCommands.js` (`'extension-output-${require(...)}...'`) — a pre-existing latent bug (should be backticks, not a real call), left unchanged as out of scope. 604 tests pass; webpack build succeeds; lint error count unchanged (38 pre-existing, 0 new).*
  - **Symptom:** 8 files use `module.exports`, 15+ use `require()` (including `require('../package.json')`, `require('./completions')`, `require('vscode')` in some command files), while the rest use ESM `import`/`export`; several files mix both (e.g. `ai_commands.js`, `ai_completion.js`, `ai_config.js`, `ai_hover.js`, `ai_references.js`) (`src/command_constants.js:69`, `src/ai_completion.js:447`, `src/commands/DebugCommands.js:1`, `src/services/*.js`).
  - **Source:** A CJS→ESM migration was started but not completed; webpack/babel makes both work, hiding the inconsistency.
  - **Consequence:** Interop semantics (sync `require` vs hoisted `import`, default-interop differences) become an implicit coupling to the bundler; readers can't predict how a module will be consumed.
  - **Remedy:** Finish the migration — convert `module.exports`/`require` to ESM; use dynamic `import()` for the lazy `completions`/`hovers` loads.

- [x] **F17. Import-time side effects mutate workspace state** — Priority 4 (P2 × S2), Scheduled, accidental — *Partially resolved: the token-color-customization migration — the one side effect that actually **writes** global workspace config — was extracted into `migrateTokenColorDefaults()` and is no longer run at module load; it now only runs via the exported, idempotent `ai_config.init()`, called once from `extension.js`'s `activate()`. Merely importing `ai_config.js` (e.g. in a test) no longer writes workspace settings. `getPaths()` and the `autoit.*` `onDidChangeConfiguration` listener registration were left running at import time: both are read-only (no workspace mutation) and ~25 existing test files import `ai_config` directly and rely on them having already run by require-time, under a Jest config with `resetMocks: true` (mocks are wiped before each test, so a lazily-triggered init would fire against already-reset mocks — confirmed by trial). Re-architecting those call sites is out of scope here; `util.js`'s listener was already retired by F14. 606 tests pass.*
  - **Symptom:** Importing `ai_config.js` runs a token-color-customization migration that *writes global workspace config*, calls `getPaths()`, and registers a config listener (`src/ai_config.js:14-68,571-591`); importing `util.js` registers a config listener (`src/util.js:536-540`).
  - **Source:** Module load used as an initialization hook.
  - **Consequence:** Merely importing these modules (e.g. in tests) mutates global VS Code state; import order matters; test isolation breaks.
  - **Remedy:** Move side effects into explicit `init()` functions called from `activate`. ✓ Done for the workspace-config write (the actual mutation); `getPaths()`/listener registration remain at import time as a deliberate scope trade-off (read-only, high test-suite blast radius to defer).

- [x] **F18. Module-level unbounded mutable global state** — Priority 2 (P1 × S2), Monitored, accidental — *Resolved: capped `utils/fsCache.js`'s `includeCache` at 200 entries and `diagnosticUtils.js`'s `trackedDiagnosticFileUris` at 500, both with FIFO eviction (`ponytail:` comment marks the upgrade path to true LRU if needed); `trackedDiagnosticFileUris` also drops entries as soon as a URI's diagnostics are fully cleared. Added `clearIncludeCache()`/`resetDiagnosticTracking()`, called from `extension.js`'s `deactivate()`. `ai_config.js`'s `listeners` Map already has matching add/delete (`addConfigListener`/`removeConfigListener`), so it isn't unbounded growth — left as-is. 606 tests pass.*
  - **Symptom:** `util.js` `includeCache` Map (no cap, `src/util.js:222`), `diagnosticUtils.js` `trackedDiagnosticFileUris` Set (never cleared, `:212`), `ai_config.js` `listeners` Map / `aiPath` / `bNoEvents` / `showErrors` (`:84-90`), `ai_completion.js` `includeCache`/`libraryIncludeCache` (LRU-bounded, the exception).
  - **Source:** Singletons-by-module-state without eviction.
  - **Consequence:** Memory grows over a long session; leaked listeners/state survive extension reload; tests share state.
  - **Remedy:** Give caches max-size + eviction; expose `dispose()`/`reset()` and call from `deactivate`/tests.

- [x] **F19. `ai_config.updateIncludePaths` writes to the Windows registry** — Priority 2 (P1 × S1), Monitored, accidental — *Resolved: extracted `syncIncludePathsToRegistry(resolvedIncludePaths)` into `src/providers/registrySync.js`; `updateIncludePaths` now just computes the resolved paths and calls it. 609 tests pass.*
  - **Symptom:** `execFile('reg', ['add','HKCU\\Software\\AutoIt v3\\AutoIt', …])` is invoked from a config-update function (`src/ai_config.js:544-567`).
  - **Source:** Config module reaching into OS persistence to keep AutoIt's Include registry key in sync.
  - **Consequence:** A hidden, surprising side effect in a module callers treat as config; failures surface as user error dialogs; cross-cutting concern buried in the wrong layer.
  - **Remedy:** Move registry sync to an explicit `syncIncludePathsToRegistry()` service called from a clearly marked lifecycle point. ✓ Done.

- [x] **F20. Monkey-patching VS Code `Diagnostic` objects with `_ownerUri`** — Priority 1 (P1 × S1), Monitored, accidental — *Resolved: replaced the `Object.defineProperty`/direct-assignment monkey-patch with an external `WeakMap<Diagnostic, ownerUri>` (`diagnosticOwners`) plus `setDiagnosticOwner`/`getDiagnosticOwner` helpers; `filterDiagnosticsOnUriByOwner` now reads ownership via `getDiagnosticOwner(d)` instead of a `_ownerUri` property. Framework `Diagnostic` objects are no longer mutated. 609 tests pass.*
  - **Symptom:** `Object.defineProperty(diagnosticToAdd, '_ownerUri', …)` attaches a custom property to framework `Diagnostic` instances (`src/diagnosticUtils.js:147-157`).
  - **Source:** `DiagnosticCollection` has no public iteration, so ownership is stashed on the diagnostic itself.
  - **Consequence:** Relies on VS Code preserving custom props across API boundaries; fragile across VS Code versions.
  - **Remedy:** Maintain an external `Map<Diagnostic, ownerUri>` (or `Map<uri, ownerUri>`) instead of mutating framework objects. ✓ Done.

- [x] **F21. `CommandsFacade` redundant dynamic imports + triple `require(package.json)`** — Priority 1 (P1 × S1), Monitored, accidental — *Resolved: the triple `require(package.json)` was already gone (F16's ESM migration left a single top-level `import packageJson from '../../package.json'`). Fixed the remaining redundant dynamic import: `initialize()` now passes its already-imported `OutputChannelManager` into `_setupEventListeners(OutputChannelManager)` instead of re-importing it; `_setupEventListeners` is no longer `async` since it has no more awaits. 609 tests pass.*
  - **Symptom:** `initialize()` dynamically imports 5 services, then `_setupEventListeners` dynamically imports `OutputChannelManager` again; `require('../package.json')` is called 3× in one method (`src/ai_commands.js:50-62,68,86,128`).
  - **Source:** Facade assembled incrementally without consolidating imports.
  - **Consequence:** Minor wasted work and noise; cosmetic.
  - **Remedy:** Import once at top; capture `package.json` metadata in a constant. ✓ Done.

### R5 — Dependency Disorder

- [x] **F22. Circular dependencies worked around by code placement** — Priority 4 (P2 × S2), Scheduled, accidental — *Resolved: both cycles are broken and verified by `eslint import/no-cycle: error` being clean across the codebase (zero violations). Part 1 (shared bits in a leaf module): done as part of F1 — `utils/variableRegex.js` owns `buildVariableRegex`/`isVariableDeclarationLine`/`VARIABLE_KEYWORDS`/`VARIABLE_PATTERN_TEMPLATE` and imports only `./regexPatterns`, so it is a leaf with no inbound feature deps. `symbolIndex` now imports `isVariableDeclarationLine` from that leaf instead of from `ai_definition`, breaking the `ai_definition ↔ symbolIndex` cycle (the edge is one-way: `ai_definition → symbolIndex`). `util.js` no longer hosts the variable-regex logic — it's a 45-line barrel that re-exports from the leaf. Part 2 (ai_symbols↔symbolIndex): the edge is now one-way (`symbolIndex → ai_symbols` for `provideDocumentSymbols`), with no transitive path back (`ai_symbols → MapTrackingService` does not loop to `symbolIndex`). No interface/callback inversion was added: the bidirectional cycle is gone, so inverting the remaining one-way edge would be an unrequested single-implementation abstraction (and would in fact re-introduce a cycle if flipped to `ai_symbols → symbolIndex`). The `import/no-cycle: error` lint rule is the persistent regression guard. 609 tests pass.*

- [x] **F23. `util.js` has no clear layering position** — Priority 6 (P2 × S3), Scheduled, accidental *(shares source with F1; distinct risk)* — *Resolved: deleted `util.js` entirely (only 1 source importer remained post-F1 — `ToolCommands.js`, repointed to `utils/fsCache`; 3 test imports repointed to `utils/functionSignature` and `completionTransforms`; 3 stale `jest.mock('../src/util')` blocks removed from `ai_references`/`UtilityCommands`/`ToolCommands` test files). The module with "no clear layering position" no longer exists. Established an enforced layering rule via `import/no-restricted-paths` in `eslint.config.mjs`: the data layer (`completions/`, `hovers/`, `signatures/`) and `parsers/` are forbidden from importing `providers/` (features), `services/` (infrastructure), or `commands/` (orchestration) — both layers were already clean, so this is a zero-violation regression guard (verified to fire on a deliberate violation). The aspirational rules from the remedy — `utils/` must not import `providers/ai_config` (2 violations via `findFilepath`, needs DI through widely-used functions) and features must import `services/` only via `ai_config`'s narrow surface (~8 violations, needs DI from `extension.js`) — are documented in the eslint config but deferred to F24/F25, where the domain-layer extraction provides the natural home for the inversion. 609 tests pass; webpack build succeeds; lint error count unchanged (0 new).*
  - **Symptom:** `util.js` is simultaneously utilities, constants, IO/cache, parsing, and a compatibility layer that re-exports from `ai_config` and `coreConstants`; it has 105 inbound edges from both data and feature layers.
  - **Source:** No enforced layering rule; "util" became the sink for everything cross-cutting.
  - **Consequence:** There is no consistent answer to "what depends on what?"; the data layer and feature layer both depend on a module that itself depends on `ai_config` (infrastructure), flattening the architecture.
  - **Remedy:** After splitting (F1), establish a layering rule: data → domain helpers → features → VS Code; forbid features from importing infrastructure directly except via `ai_config`'s narrow public surface. ✓ `util.js` deleted; data + parser layer isolation enforced via `import/no-restricted-paths`; feature→infrastructure and utils→infrastructure rules documented as aspirational (deferred to F24/F25 domain-layer work).

- [x] **F24. Domain logic misplaced in infrastructure modules** — Priority 2 (P1 × S2), Monitored, accidental — *Resolved: extracted Au3Check domain logic into `src/utils/au3check.js` — `runCheckProcess` (process spawning + directive parameter parsing), `validateCheckPath` (path existence check), `handleCheckProcessError` (error formatting), `parseAu3CheckParameters` (pure function building CLI args from document text + include paths), and `shouldIgnoreDiagnostics` (backup-file filtering). `extension.js` retains only the VS Code lifecycle orchestration (`checkAutoItCode`, version cache, `setupDiagnostics`). The signature/parameter domain logic (`buildFunctionSignature`, `getParams`) was already in `utils/functionSignature.js` from F1. 623 tests pass; webpack build succeeds.*
   - **Symptom:** Au3Check parameter parsing (`runCheckProcess`) lives in `extension.js` (`:39-111`); signature/parameter domain logic (`buildFunctionSignature`, `getParams`) lives in `util.js` alongside FS/cache plumbing (`src/util.js:748-901`).
   - **Source:** Domain logic dropped into whichever module was handy.
   - **Consequence:** Domain rules are hard to locate and test in isolation; they're coupled to VS Code/FS concerns.
   - **Remedy:** ✓ Moved `runCheckProcess`/directive parsing/`validateCheckPath`/`shouldIgnoreDiagnostics` into `src/utils/au3check.js`; `buildFunctionSignature`/`getParams` already in `utils/functionSignature.js` (F1). `extension.js` keeps only lifecycle orchestration.

### R6 — Domain Model Distortion

- [ ] **F25. No domain layer; AutoIt language concepts are scattered** — Priority 6 (P2 × S3), Scheduled, accidental
  - **Symptom:** The implicit domain ("the AutoIt language") — function signatures, variable declarations/scope, include resolution, maps — is spread across `util.js`, `parsers/`, `services/`, and the `ai_*` feature modules with no owning layer.
  - **Source:** The codebase was built feature-first (hover, completion, definition) without extracting a shared language model.
  - **Consequence:** Each feature re-derives language concepts (e.g. two include resolvers, two variable matchers); domain rules drift between features.
  - **Remedy:** Introduce a `language/` (or `domain/`) layer — `includeResolver`, `functionSignature`, `variableScope`, `mapModel` — that features depend on and that owns the AutoIt semantics.

- [ ] **F26. Anemic data files with transform logic in `util.js`** — Priority 2 (P1 × S2), Monitored, accidental
  - **Symptom:** The 80+ signature/completion files are pure data, but the transforms that turn them into VS Code items (`signatureToCompletion`, `signatureToHover`, `completionToHover`, `fillCompletions`) live in `util.js`, disconnected from the data (`src/util.js:571-704`).
  - **Source:** Data and behavior split across modules by accident.
  - **Consequence:** Adding a new completion "kind" means editing `util.js`, not the data module that defines the kind; the data files can't be understood in isolation.
  - **Remedy:** Co-locate per-kind transforms with the data, or move all transforms into a dedicated `completionTransforms.js` next to the registries.

- [ ] **F27. Module names don't match concepts** — Priority 2 (P1 × S2), Monitored, accidental
  - **Symptom:** `ai_config.js` does config + path resolution + registry writes + token-color migration + install detection; `command_constants.js` holds timing constants, `commandsList.js` is a string list, `commands/commandUtils.js` is editor helpers — three "command" modules with unclear boundaries; the `ai_` prefix carries no domain meaning.
  - **Source:** Naming didn't track responsibility drift.
  - **Consequence:** A new developer can't predict where to look or where to add things from the names alone.
  - **Remedy:** Rename to match responsibility (`autoItPaths.js`, `commandTimings.js`, `commandRegistry.js`, `editorActions.js`); drop or define the `ai_` prefix.

- [x] **F28. Incomplete flat→organized migration** — Priority 6 (P2 × S3), Scheduled, accidental — *Resolved: all 10 flat `ai_*.js` feature files moved into `src/providers/`; the only two outside consumers still reaching `findFilepath` through `util.js`'s compat re-export (`commands/UtilityCommands.js`, `commands/ToolCommands.js`) now import it directly from `providers/ai_config`, and the re-export was deleted from `util.js`. `AI_CONSTANTS`/`AUTOIT_MODE` re-exports remain (tracked separately under F13). 603 tests still pass.*
  - **Symptom:** Flat `ai_*.js` feature files (`ai_completion`, `ai_definition`, `ai_hover`, `ai_references`, `ai_signature`, `ai_symbols`, `ai_workspaceSymbols`, `ai_formatter`, `ai_commands`, `ai_config`) coexist with organized subdirectories (`commands/`, `services/`, `parsers/`, `utils/`, `completions/`, `hovers/`, `signatures/`) that partly replace them; `util.js` re-exports exist "for backward compatibility."
  - **Source:** A reorganization was started (new code goes in subdirs) but the flat files were never fully absorbed.
  - **Consequence:** New developers don't know whether to add to `ai_completion.js` or `completions/`; two mental models coexist; the split is the root cause behind F1, F5, F13, F23.
  - **Remedy:** Finish the migration — move each `ai_*` feature into its subdirectory, delete the flat file once consumers are updated, remove the backward-compat re-exports.

---

## Debt Summary

| Risk | Findings | Avg Priority | Classification | Intent |
|------|----------|-------------|----------------|--------|
| Cognitive Overload      | 4 | 3.75 | Scheduled | accidental |
| Change Propagation      | 4 | 4.50 | Scheduled | accidental |
| Knowledge Duplication   | 7 | 2.86 | Monitored  | accidental (F13 re-exports intentional-but-no-payback) |
| Accidental Complexity   | 6 | 2.67 | Monitored  | accidental |
| Dependency Disorder     | 3 | 4.00 | Scheduled | accidental |
| Domain Model Distortion | 4 | 4.00 | Scheduled | accidental |

**Recommended focus:** Change Propagation (4.5), Dependency Disorder (4.0), and Domain Model Distortion (4.0) — all three trace back to the same root: the incomplete flat→organized migration (F28) and the `util.js` God-hub (F1/F7/F23). The highest-leverage single action is **finishing the `util.js` split as part of completing the flat→organized migration (F28)**: it directly retires F1, F7, F13, F23, F26 and unblocks F25. The two highest-ROI quick wins independent of that are **collapsing the duplicate tracking services (F9)** and **consolidating include resolution (F10/F11)**, since those are self-contained and already diverging. The mixed module systems (F16) should be resolved alongside the migration to avoid paying interop friction twice.

A note on intent: nearly all findings are **accidental** — structural erosion from organic growth and half-finished refactors. The only intentional-without-payback items are the `util.js` backward-compat re-exports (F13); per the guide these are treated as accidental for prioritization since they have no linked ticket or documented payback plan.
