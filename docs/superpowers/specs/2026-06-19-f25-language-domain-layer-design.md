# F25: Language Domain Layer — Design

**Date:** 2026-06-19
**Context:** Tech debt finding F25 from `docs/tech-debt-assessment.md`
**Priority:** 6 (P2 x S3), Scheduled

## Goal

Introduce a `src/language/` directory that owns pure AutoIt language semantics — variable declarations, function signatures, include resolution, and map/variable parsing — with **zero VSCode dependencies**. Features (`providers/`) and services depend on this layer rather than reaching into `utils/` for domain logic.

## Architecture

```
src/language/              ← NEW: AutoIt language model (pure, no VSCode deps)
├── variable.js            ← merged from utils/variableRegex.js + utils/VariablePatterns.js
├── functionSignatureParsing.js ← moved from utils/functionSignatureParsing.js
├── include.js             ← moved from utils/IncludeResolver.js
├── map.js                 ← moved from parsers/MapParser.js
└── variableParser.js      ← moved from parsers/VariableParser.js

src/utils/                 ← STAYS: VSCode-aware adapters + infra helpers
├── functionSignature.js   ← unchanged (VSCode adapter, imports from language/)
├── includeResolution.js   ← unchanged (VSCode adapter, imports from language/)
├── includeAutoInsert.js   ← unchanged (VSCode Position/TextEdit)
├── regexPatterns.js       ← unchanged (AutoIt-specific regex extensions)
├── coreConstants.js       ← unchanged (frozen constants)
├── fsCache.js             ← unchanged
├── debounce.js, au3check.js, ... ← unchanged

src/parsers/               ← DELETED (contents moved to language/)
```

**Dependency rule:** `language/` modules import only from `language/`, `utils/` (regex/validation helpers), and Node.js standard library. Never from `providers/`, `services/`, `commands/`, or `vscode`.

## Module Details

### 1. `language/variable.js` — AutoIt variable declarations

Merged from two files:

| Source | Exports |
|--------|---------|
| `utils/variableRegex.js` | `VARIABLE_KEYWORDS`, `VARIABLE_PATTERN_TEMPLATE`, `VARIABLE_REGEX_FLAGS`, `buildVariableRegex()`, `isVariableDeclarationLine()` |
| `utils/VariablePatterns.js` | class `VariablePatterns` (`isComment`, `cleanLine`, `removeStrings`, `extractVariables`) |

Same public API — consumers get everything from one import:
- `providers/ai_definition.js` — `isVariableDeclarationLine`, `buildVariableRegex`
- `services/symbolIndex.js` — `isVariableDeclarationLine`
- `parsers/VariableParser.js` → `language/variableParser.js` — `VariablePatterns` class

### 2. `language/functionSignatureParsing.js` — AutoIt function signature parser

Moved as-is from `utils/functionSignatureParsing.js`. Exports:
- `splitTopLevel()` — splits by delimiter respecting nested brackets/quotes
- `scanForClosingParen()` — finds matching closing paren
- `parseFunctionBoundaries()` — extracts function names/params/lines
- `FUNCTION_START_PATTERN`

Used by:
- `utils/functionSignature.js` — `getParams`, `buildFunctionSignature`
- `language/map.js` — `splitTopLevel`
- `language/variableParser.js` — `parseFunctionBoundaries`, `splitTopLevel`

### 3. `language/include.js` — AutoIt include resolution

Moved from `utils/IncludeResolver.js`. Exports class `IncludeResolver`:
- `parseIncludes()` — extract include directives from source
- `resolveIncludePath()` — resolve a single include to filesystem path
- `resolveAllIncludes()` — recursively resolve include chain

Uses `fs` (Node.js stdlib) and `constants.js` (`DEFAULT_MAX_INCLUDE_DEPTH`). No VSCode types.

Used by `services/TrackingServiceBase.js`.

### 4. `language/map.js` — AutoIt Map parser

Moved from `parsers/MapParser.js`. Exports class `MapParser`:
- `parseMapDeclarations()`, `parseKeyAssignments()`
- `getKeysForMapAtLine()`, `getFunctionParameterKeys()`
- `parseFunctionBoundaries()`, `getFunctionAtLine()`

Used by `services/MapTrackingService.js`.

### 5. `language/variableParser.js` — AutoIt variable declaration parser

Moved from `parsers/VariableParser.js`. Exports class `VariableParser`:
- `parseVariableDeclarations()`, `parseExplicitDeclarations()`
- `parseDimDeclarations()`, `parseAssignments()`
- `parseFunctionBoundaries()`, `getFunctionAtLine()`

Used by `services/VariableTrackingService.js`.

## Import Changes

### Source files

| File | Old import | New import |
|------|-----------|------------|
| `providers/ai_definition.js` | `../utils/variableRegex` | `../language/variable` |
| `services/symbolIndex.js` | `../utils/variableRegex` | `../language/variable` |
| `utils/functionSignature.js` | `./functionSignatureParsing` | `../language/functionSignatureParsing` |
| `services/TrackingServiceBase.js` | `../utils/IncludeResolver` | `../language/include` |
| `services/MapTrackingService.js` | `../parsers/MapParser` | `../language/map` |
| `services/VariableTrackingService.js` | `../parsers/VariableParser` | `../language/variableParser` |
| `language/map.js` (internal) | `../utils/functionSignatureParsing` | `./functionSignatureParsing` |
| `language/variableParser.js` (internal) | `../utils/functionSignatureParsing` | `./functionSignatureParsing` |
| `language/variableParser.js` (internal) | `../utils/VariablePatterns` | `./variable` |

### Test files

| File | Old import | New import |
|------|-----------|------------|
| `test/parsers/MapParser.test.js` | `../../src/parsers/MapParser` | `../../src/language/map` |
| `test/parsers/VariableParser.test.js` | `../../src/parsers/VariableParser` | `../../src/language/variableParser` |
| `test/utils/VariablePatterns.test.js` | `../../src/utils/VariablePatterns` | `../../src/language/variable` |
| `test/utils/IncludeResolver.test.js` | `../../src/utils/IncludeResolver` | `../../src/language/include` |
| `test/utils/functionSignatureParsing.test.js` | `../../src/utils/functionSignatureParsing` | `../../src/language/functionSignatureParsing` |
| `test/services/MapTrackingService.test.js` | `../../src/parsers/MapParser` | `../../src/language/map` |
| `test/services/VariableTrackingService.test.js` | `../../src/parsers/VariableParser` | `../../src/language/variableParser` |
| `test/services/symbolIndex.test.js` | (any variableRegex refs) | `../../src/language/variable` |
| Other test files | As needed | Updated |

## Files Deleted

- `src/utils/variableRegex.js`
- `src/utils/VariablePatterns.js`
- `src/utils/functionSignatureParsing.js`
- `src/utils/IncludeResolver.js`
- `src/parsers/MapParser.js`
- `src/parsers/VariableParser.js`
- `src/parsers/` directory (empty after moves)

## Verification

1. `npm test` — all ~620 tests pass
2. `npm run lint` — zero new violations; `import/no-restricted-paths` is already active
3. `npm run build` — webpack succeeds
4. Manual spot-check: completion, hover, go-to-definition work in a test `.au3` file

## What's NOT in scope

- **F26** (anemic data files with transform logic) — `completionTransforms.js` stays as-is; addressed separately
- **F27** (module naming) — discussed separately
- Splitting `functionSignature.js` or `includeResolution.js` into pure + VSCode layers — deferred until those modules grow enough to warrant the split boundary cost
- `regexPatterns.js` / `coreConstants.js` — stay in `utils/` as they serve both language and provider layers
