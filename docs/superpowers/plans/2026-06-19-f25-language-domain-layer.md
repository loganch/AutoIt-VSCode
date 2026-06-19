# F25: Language Domain Layer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `src/language/` directory owning pure AutoIt semantics (variable declarations, function signatures, include resolution, map/variable parsing) with zero VSCode dependencies.

**Architecture:** Move 6 modules from `utils/` and `parsers/` into a new `src/language/` directory. Merge `variableRegex.js` + `VariablePatterns.js` into one `variable.js`. Update ~15 source + ~10 test imports. No logic changes — pure reorganization.

**Tech Stack:** JavaScript ES modules, Jest, webpack, eslint (`import/no-restricted-paths` already active).

## Global Constraints

- Zero VSCode dependencies in `language/` modules
- Zero logic changes — only import path updates + merge of two related files
- All ~620 existing tests must remain green
- `npm run lint` must produce zero new violations
- `npm run build` must succeed

---

## File Structure

### Created

| Path | Source | Notes |
|------|--------|-------|
| `src/language/variable.js` | merge `utils/variableRegex.js` + `utils/VariablePatterns.js` | Combined exports |
| `src/language/functionSignatureParsing.js` | `utils/functionSignatureParsing.js` | Move as-is, no internal import changes |
| `src/language/include.js` | `utils/IncludeResolver.js` | Internal import paths adjusted |
| `src/language/map.js` | `parsers/MapParser.js` | Internal import paths adjusted |
| `src/language/variableParser.js` | `parsers/VariableParser.js` | Internal import paths adjusted |

### Modified (source — import path changes only)

| File | Change |
|------|--------|
| `src/providers/ai_definition.js:3` | `../utils/variableRegex` → `../language/variable` |
| `src/services/symbolIndex.js:3` | `../utils/variableRegex` → `../language/variable` |
| `src/utils/functionSignature.js:2` | `./functionSignatureParsing` → `../language/functionSignatureParsing` |
| `src/services/TrackingServiceBase.js:1` | `../utils/IncludeResolver.js` → `../language/include.js` |
| `src/services/MapTrackingService.js:1` | `../parsers/MapParser.js` → `../language/map.js` |
| `src/services/VariableTrackingService.js:1` | `../parsers/VariableParser.js` → `../language/variableParser.js` |

### Modified (test — import path changes only)

| File | Change |
|------|--------|
| `test/parsers/MapParser.test.js:1` | `../../src/parsers/MapParser.js` → `../../src/language/map.js` |
| `test/parsers/VariableParser.test.js:1` | `../../src/parsers/VariableParser.js` → `../../src/language/variableParser.js` |
| `test/utils/VariablePatterns.test.js:1` | `../../src/utils/VariablePatterns.js` → `../../src/language/variable.js` |
| `test/utils/IncludeResolver.test.js:3` | `../../src/utils/IncludeResolver.js` → `../../src/language/include.js` |
| `test/ai_workspaceSymbols.debounce.test.js:59` | `../src/utils/variableRegex` → `../src/language/variable` |
| `test/ai_definition.test.js:390` | `../src/utils/variableRegex` → `../src/language/variable` |
| `test/ai_workspaceSymbols.test.js:133` | `../src/utils/variableRegex` → `../src/language/variable` |
| `test/services/symbolIndex.test.js:37` | `../../src/utils/variableRegex` → `../../src/language/variable` |
| `test/services/symbolWarmup.test.js:39` | `../../src/utils/variableRegex` → `../../src/language/variable` |

### Deleted

- `src/utils/variableRegex.js`
- `src/utils/VariablePatterns.js`
- `src/utils/functionSignatureParsing.js`
- `src/utils/IncludeResolver.js`
- `src/parsers/MapParser.js`
- `src/parsers/VariableParser.js`
- `src/parsers/` directory (empty after moves)

---

### Task 1: Create all `language/` files

**Files:**
- Create: `src/language/variable.js`
- Create: `src/language/functionSignatureParsing.js`
- Create: `src/language/include.js`
- Create: `src/language/map.js`
- Create: `src/language/variableParser.js`

**Interfaces:**
- Consumes: existing files in `src/utils/` and `src/parsers/` (read-only)
- Produces: 5 new files in `src/language/` with adjusted internal imports

- [ ] **Step 1: Create directory**

```powershell
New-Item -ItemType Directory -Force -Path "src\language"
```

- [ ] **Step 2: Create `language/functionSignatureParsing.js`** (moved as-is, zero imports — no changes needed)

The file has no import statements (verified: only defines `FUNCTION_START_PATTERN`, `scanForClosingParen`, `splitTopLevel`, `parseFunctionBoundaries`). Copy verbatim.

```powershell
Copy-Item -LiteralPath "src\utils\functionSignatureParsing.js" -Destination "src\language\functionSignatureParsing.js"
```

- [ ] **Step 3: Create `language/include.js`** (from `utils/IncludeResolver.js`, adjust imports)

Read `src/utils/IncludeResolver.js`. The imports are:

```javascript
import path from 'path';
import fs from 'fs';
import { REGEX_PATTERNS } from './regexPatterns';
import { DEFAULT_MAX_INCLUDE_DEPTH } from '../constants';
```

When moved to `src/language/include.js`:
- `path`, `fs` — stdlib, unchanged
- `./regexPatterns` → `../utils/regexPatterns`
- `../constants` → stays `../constants` (both at `src/` level)

Create `src/language/include.js` with the full file content, only changing the import paths:

```javascript
import path from 'path';
import fs from 'fs';
import { REGEX_PATTERNS } from '../utils/regexPatterns';
import { DEFAULT_MAX_INCLUDE_DEPTH } from '../constants';

// ... rest of file verbatim (lines 5-122 of original)
```

- [ ] **Step 4: Create `language/map.js`** (from `parsers/MapParser.js`, adjust imports)

Read `src/parsers/MapParser.js`. The import is:

```javascript
import { parseFunctionBoundaries, splitTopLevel } from '../utils/functionSignatureParsing.js';
```

When moved to `src/language/map.js`:
- `../utils/functionSignatureParsing.js` → `./functionSignatureParsing.js`

Create `src/language/map.js` with the full file content, only changing the import path:

```javascript
/**
 * Parses AutoIt source code to extract Map variable information
 */
import { parseFunctionBoundaries, splitTopLevel } from './functionSignatureParsing.js';

// ... rest of file verbatim (lines 5-305 of original)
```

- [ ] **Step 5: Create `language/variableParser.js`** (from `parsers/VariableParser.js`, adjust imports)

Read `src/parsers/VariableParser.js`. The imports are:

```javascript
import VariablePatterns from '../utils/VariablePatterns.js';
import {
  parseFunctionBoundaries,
  parseFunctionDeclarationLine,
  parseParameterNames,
  splitTopLevel,
} from '../utils/functionSignatureParsing.js';
```

When moved to `src/language/variableParser.js`:
- `../utils/VariablePatterns.js` → `./variable.js` (merged into `language/variable.js`)
- `../utils/functionSignatureParsing.js` → `./functionSignatureParsing.js`

Create `src/language/variableParser.js` with the full file content, only changing the import paths:

```javascript
/**
 * Parses AutoIt source code to extract variable declarations with scope information
 * Based on MapParser.js structure and patterns
 */

import VariablePatterns from './variable.js';
import {
  parseFunctionBoundaries,
  parseFunctionDeclarationLine,
  parseParameterNames,
  splitTopLevel,
} from './functionSignatureParsing.js';

// ... rest of file verbatim (lines 14-279 of original)
```

- [ ] **Step 6: Create `language/variable.js`** (merge `variableRegex.js` + `VariablePatterns.js`)

Read both files fully:

`src/utils/variableRegex.js` (57 lines) — exports: `VARIABLE_KEYWORDS`, `VARIABLE_PATTERN_TEMPLATE`, `VARIABLE_REGEX_FLAGS`, `buildVariableRegex()`, `isVariableDeclarationLine()`

`src/utils/VariablePatterns.js` (105 lines) — exports: `export default class VariablePatterns`

Merge into `src/language/variable.js`. The merged file contains:
- The import line from `variableRegex.js`: `import { escapeRegexLiteral } from './regexPatterns'` — wait, variableRegex imports from `./regexPatterns` which is `utils/regexPatterns`. In the new location, this should be `../utils/regexPatterns`.

Actually, check: `src/utils/variableRegex.js:1` — `import { escapeRegexLiteral } from './regexPatterns';` — this resolves to `src/utils/regexPatterns.js`. When moved to `src/language/variable.js`, it needs `../utils/regexPatterns`.

```javascript
import { escapeRegexLiteral } from '../utils/regexPatterns';

// ============================================================================
// VARIABLE DECLARATION MATCHING (single source of truth)
// ============================================================================
//
// Canonical "is this line a variable definition site" matcher, shared by the
// same-document scan in ai_definition.js and the warm symbol index in
// services/symbolIndex.js. Keeping the template + keywords here (rather than
// in ai_definition.js) lets symbolIndex reuse them without an import cycle
// (ai_definition imports symbolIndex, so symbolIndex must not import
// ai_definition).
//
// VARIABLE_PATTERN_TEMPLATE - simple, O(n) per line:
//   ^[ \t]*                                    leading whitespace
//   (?:(?:{keywords})[ \t]+(?:.*,[ \t]*)?)?   optional declaration keyword;
//                                              when present, greedily skips
//                                              any leading comma-separated
//                                              siblings with one backtrack pass
//   ({escaped})\b                              the actual target variable
export const VARIABLE_KEYWORDS = ['Local', 'Global', 'Const'];
export const VARIABLE_PATTERN_TEMPLATE =
  '^[ \\t]*(?:(?:{keywords})[ \\t]+(?:.*,[ \\t]*)?)?({escaped})\\b';
export const VARIABLE_REGEX_FLAGS = 'mi';

/**
 * Build the canonical variable-definition regex for a given variable name.
 * Used by both ai_definition.js (createVariableRegex) and symbolIndex.js so the
 * "is this a declaration site" semantics live in exactly one place.
 * @param {string} variableName - Variable name (including the leading `$`).
 * @returns {RegExp} Compiled regex (case-insensitive, multiline).
 */
export const buildVariableRegex = variableName => {
  const escaped = escapeRegexLiteral(variableName);
  const keywords = VARIABLE_KEYWORDS.join('|');
  const pattern = VARIABLE_PATTERN_TEMPLATE.replace('{keywords}', keywords).replace(
    '{escaped}',
    escaped,
  );
  return new RegExp(pattern, VARIABLE_REGEX_FLAGS);
};

/**
 * Returns true iff `lineText` is a definition site for `variableName`, using the
 * same pattern semantics as ai_definition's createVariableRegex. A bare usage
 * (e.g. `ConsoleWrite($g_Config & @CRLF)`) is NOT a declaration.
 * @param {string} lineText - The source line to test.
 * @param {string} variableName - Variable name (including the leading `$`).
 * @returns {boolean}
 */
export const isVariableDeclarationLine = (lineText, variableName) => {
  if (typeof lineText !== 'string' || !variableName || typeof variableName !== 'string') {
    return false;
  }
  return buildVariableRegex(variableName).test(lineText);
};

// ============================================================================
// VARIABLE PATTERNS CLASS
// ============================================================================

/**
 * Regex patterns for variable analysis in AutoIt code
 * Based on existing patterns in src/util.js and src/parsers/MapParser.js
 */
export class VariablePatterns {
  constructor() {
    // Function patterns (reuse from MapParser for consistency)
    this.function = /^\s*(?:Volatile\s+)?Func\s+(\w+)\s*\(([^)]*)\)/im;
    this.endFunc = /^\s*EndFunc\b/im;

    // Explicit variable declarations
    // Global declarations at script level (Volatile keyword supported)
    // Captures comma-separated variable lists: Global $a, $b, $c
    this.global = /^\s*(?:Global|Volatile)\s+((?:\$\w+(?:\s*,\s*\$\w+)*))/gim;

    // Local declarations inside functions (Volatile keyword supported)
    // Captures comma-separated variable lists: Local $x, $y, $z
    this.local = /^\s*(?:Local|Volatile)\s+((?:\$\w+(?:\s*,\s*\$\w+)*))/gim;

    // Static declarations (function-scoped, persists between calls) (Volatile keyword supported)
    // Captures comma-separated variable lists: Static $s1, $s2
    this.static = /^\s*(?:Static|Volatile)\s+((?:\$\w+(?:\s*,\s*\$\w+)*))/gim;

    // Dim declarations (context-dependent: global at script level, local in functions)
    // Captures comma-separated variable lists: Dim $data, $info
    this.dim = /^\s*Dim\s+((?:\$\w+(?:\s*,\s*\$\w+)*))/gim;

    // Parameter extraction from function signature
    this.parameter = /\$\w+/g;

    // Assignment pattern for implicit variables (lower priority, for fallback)
    this.assignment = /^\s*(\$\w+)\s*=/gim;

    // Utility patterns
    this.comment = /^\s*;/;
    // AutoIt string pattern: handles double-character escaping ("" or '')
    // Matches: "He said ""hello""" and 'Don''t'
    this.string = /"(?:[^"]|"")*"|'(?:[^']|'')*'/g;
    this.includePattern = /#include\s+[<"]([^>"]+)[>"]/gim;
  }

  /**
   * Extract individual variable names from a comma-separated list
   * @param {string} variablesStr - The matched variable list (e.g., "$a, $b, $c")
   * @returns {string[]} Array of variable names (e.g., ["$a", "$b", "$c"])
   * @example
   * // For "Global $a, $b, $c = 1"
   * const match = line.match(patterns.global);
   * if (match) {
   *   const variables = patterns.extractVariables(match[1]);
   *   // variables = ["$a", "$b", "$c"]
   * }
   */
  extractVariables(variablesStr) {
    if (!variablesStr) {
      return [];
    }
    return variablesStr
      .split(',')
      .map(v => v.trim())
      .filter(v => v && v.startsWith('$'));
  }

  /**
   * Check if a line is a comment
   * @param {string} line - The line to check
   * @returns {boolean} True if the line is a comment
   */
  isComment(line) {
    return this.comment.test(line);
  }

  /**
   * Remove strings from a line to prevent false pattern matches
   * Handles AutoIt's double-character escaping ("" and '')
   * @param {string} line - The line to clean
   * @returns {string} Line with string contents removed
   * @example
   * removeStrings('Local $msg = "He said ""hello"""') // => 'Local $msg = ""'
   * removeStrings("Local $text = 'Don''t'") // => "Local $text = \"\""
   */
  removeStrings(line) {
    return line.replace(this.string, '""');
  }

  /**
   * Remove comments from a line
   * @param {string} line - The line to clean
   * @returns {string} Line with comments removed
   */
  removeComments(line) {
    const commentIdx = line.indexOf(';');
    return commentIdx !== -1 ? line.substring(0, commentIdx) : line;
  }

  /**
   * Clean a line for pattern matching (remove comments and strings)
   * @param {string} line - The line to clean
   * @returns {string} Cleaned line
   */
  cleanLine(line) {
    return this.removeComments(this.removeStrings(line));
  }
}

export default VariablePatterns;
```

Note: `VariablePatterns.js` used `export default class VariablePatterns`. The merged file keeps `export class VariablePatterns` (named) and adds `export default VariablePatterns` at the bottom so both `import VariablePatterns from './variable.js'` and `import { VariablePatterns } from './variable.js'` work.

- [ ] **Step 7: Commit**

```powershell
git add src/language/
git commit -m "feat: create language/ domain layer with 5 modules"
```

---

### Task 2: Update source file imports

**Files:**
- Modify: `src/providers/ai_definition.js:3`
- Modify: `src/services/symbolIndex.js:3`
- Modify: `src/utils/functionSignature.js:2`
- Modify: `src/services/TrackingServiceBase.js:1`
- Modify: `src/services/MapTrackingService.js:1`
- Modify: `src/services/VariableTrackingService.js:1`

**Interfaces:**
- Consumes: new files in `src/language/`
- Produces: all source importers point to `language/` paths

- [ ] **Step 1: Update `src/providers/ai_definition.js:3`**

Change:
```javascript
import { buildVariableRegex } from '../utils/variableRegex';
```
To:
```javascript
import { buildVariableRegex } from '../language/variable';
```

- [ ] **Step 2: Update `src/services/symbolIndex.js:3`**

Change:
```javascript
import { isVariableDeclarationLine } from '../utils/variableRegex';
```
To:
```javascript
import { isVariableDeclarationLine } from '../language/variable';
```

- [ ] **Step 3: Update `src/utils/functionSignature.js:2`**

Change:
```javascript
import { splitTopLevel } from './functionSignatureParsing';
```
To:
```javascript
import { splitTopLevel } from '../language/functionSignatureParsing';
```

- [ ] **Step 4: Update `src/services/TrackingServiceBase.js:1`**

Change:
```javascript
import IncludeResolver from '../utils/IncludeResolver.js';
```
To:
```javascript
import IncludeResolver from '../language/include.js';
```

- [ ] **Step 5: Update `src/services/MapTrackingService.js:1`**

Change:
```javascript
import MapParser from '../parsers/MapParser.js';
```
To:
```javascript
import MapParser from '../language/map.js';
```

- [ ] **Step 6: Update `src/services/VariableTrackingService.js:1`**

Change:
```javascript
import VariableParser from '../parsers/VariableParser.js';
```
To:
```javascript
import VariableParser from '../language/variableParser.js';
```

- [ ] **Step 7: Commit**

```powershell
git add src/providers/ai_definition.js src/services/symbolIndex.js src/utils/functionSignature.js src/services/TrackingServiceBase.js src/services/MapTrackingService.js src/services/VariableTrackingService.js
git commit -m "feat: update source imports to language/ domain layer"
```

---

### Task 3: Update test file imports

**Files:**
- Modify: `test/parsers/MapParser.test.js:1`
- Modify: `test/parsers/VariableParser.test.js:1`
- Modify: `test/utils/VariablePatterns.test.js:1`
- Modify: `test/utils/IncludeResolver.test.js:3`
- Modify: `test/ai_workspaceSymbols.debounce.test.js:59`
- Modify: `test/ai_definition.test.js:390`
- Modify: `test/ai_workspaceSymbols.test.js:133`
- Modify: `test/services/symbolIndex.test.js:37`
- Modify: `test/services/symbolWarmup.test.js:39`

**Interfaces:**
- Consumes: new files in `src/language/`
- Produces: all test imports and jest.mock paths point to `language/`

- [ ] **Step 1: Update `test/parsers/MapParser.test.js:1`**

Change:
```javascript
import MapParser from '../../src/parsers/MapParser.js';
```
To:
```javascript
import MapParser from '../../src/language/map.js';
```

- [ ] **Step 2: Update `test/parsers/VariableParser.test.js:1`**

Change:
```javascript
import VariableParser from '../../src/parsers/VariableParser.js';
```
To:
```javascript
import VariableParser from '../../src/language/variableParser.js';
```

- [ ] **Step 3: Update `test/utils/VariablePatterns.test.js:1`**

Change:
```javascript
import VariablePatterns from '../../src/utils/VariablePatterns.js';
```
To:
```javascript
import { VariablePatterns } from '../../src/language/variable.js';
```

Note: uses named import `{ VariablePatterns }` since the merged file exports both named and default.

- [ ] **Step 4: Update `test/utils/IncludeResolver.test.js:3`**

Change:
```javascript
import IncludeResolver from '../../src/utils/IncludeResolver.js';
```
To:
```javascript
import IncludeResolver from '../../src/language/include.js';
```

- [ ] **Step 5: Update `test/ai_workspaceSymbols.debounce.test.js:59`**

Change:
```javascript
jest.mock('../src/utils/variableRegex', () => ({
```
To:
```javascript
jest.mock('../src/language/variable', () => ({
```

- [ ] **Step 6: Update `test/ai_definition.test.js:390`**

Change:
```javascript
jest.mock('../src/utils/variableRegex', () => ({
```
To:
```javascript
jest.mock('../src/language/variable', () => ({
```

- [ ] **Step 7: Update `test/ai_workspaceSymbols.test.js:133`**

Change:
```javascript
jest.mock('../src/utils/variableRegex', () => ({
```
To:
```javascript
jest.mock('../src/language/variable', () => ({
```

- [ ] **Step 8: Update `test/services/symbolIndex.test.js:37`**

Change:
```javascript
jest.mock('../../src/utils/variableRegex', () => ({
```
To:
```javascript
jest.mock('../../src/language/variable', () => ({
```

- [ ] **Step 9: Update `test/services/symbolWarmup.test.js:39`**

Change:
```javascript
jest.mock('../../src/utils/variableRegex', () => ({
```
To:
```javascript
jest.mock('../../src/language/variable', () => ({
```

- [ ] **Step 10: Verify tests pass from new paths (old files still exist)**

```powershell
npm test
```

Expected: all tests pass. If any fail, check for missed import references.

- [ ] **Step 11: Commit**

```powershell
git add test/
git commit -m "feat: update test imports to language/ domain layer"
```

---

### Task 4: Delete old files and parsers/ directory

**Files:**
- Delete: `src/utils/variableRegex.js`
- Delete: `src/utils/VariablePatterns.js`
- Delete: `src/utils/functionSignatureParsing.js`
- Delete: `src/utils/IncludeResolver.js`
- Delete: `src/parsers/MapParser.js`
- Delete: `src/parsers/VariableParser.js`
- Delete: `src/parsers/` directory

**Interfaces:**
- Consumes: all importers already updated to new paths
- Produces: old files removed, only `language/` copies exist

- [ ] **Step 1: Delete old files**

```powershell
Remove-Item -LiteralPath "src\utils\variableRegex.js"
Remove-Item -LiteralPath "src\utils\VariablePatterns.js"
Remove-Item -LiteralPath "src\utils\functionSignatureParsing.js"
Remove-Item -LiteralPath "src\utils\IncludeResolver.js"
Remove-Item -LiteralPath "src\parsers\MapParser.js"
Remove-Item -LiteralPath "src\parsers\VariableParser.js"
Remove-Item -LiteralPath "src\parsers"
```

- [ ] **Step 2: Verify tests still pass after deletion**

```powershell
npm test
```

Expected: all tests pass. No module-not-found errors.

- [ ] **Step 3: Commit**

```powershell
git add -u src/
git commit -m "feat: delete old files, keep only language/ copies"
```

---

### Task 5: Final verification

- [ ] **Step 1: Run full test suite**

```powershell
npm test
```

Expected: all ~620 tests pass, zero failures.

- [ ] **Step 2: Run linter**

```powershell
npm run lint
```

Expected: zero new violations. The existing `import/no-restricted-paths` rule from F23 automatically enforces `language/` isolation.

- [ ] **Step 3: Run webpack build**

```powershell
npm run build
```

Expected: build succeeds with no import resolution errors.

- [ ] **Step 4: Final git status check**

```powershell
git status
```

Expected: clean working tree, all changes committed.

---

## Completion Checklist

- [ ] `src/language/` directory exists with 5 files
- [ ] `src/utils/` no longer contains `variableRegex.js`, `VariablePatterns.js`, `functionSignatureParsing.js`, `IncludeResolver.js`
- [ ] `src/parsers/` directory deleted
- [ ] 6 source files updated with new import paths
- [ ] 9 test files updated with new import paths
- [ ] `npm test` — all green
- [ ] `npm run lint` — zero new violations
- [ ] `npm run build` — succeeds
