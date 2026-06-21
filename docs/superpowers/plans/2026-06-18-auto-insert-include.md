# Auto-Insert `#include` on Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When a user accepts a UDF function or UDF constant completion whose required `#include <...>` is not yet in the document, automatically insert that `#include` line via `CompletionItem.additionalTextEdits`.

**Architecture:** Stamp an explicit `requiredInclude` field (e.g. `"Array.au3"`) on each UDF/constant completion at static build time in `util.js`. A new pure helper `attachIncludeEdits(items, document, enabled)` in `src/utils/includeAutoInsert.js` runs per-request inside `provideCompletionItems`, clones items whose include is missing, and attaches a `TextEdit` inserting `#include <...>` after the last existing `#include` line (or at line 0).

**Tech Stack:** VS Code Extension API (`CompletionItem`, `TextEdit`, `Position`), JavaScript (Babel), Jest with manual `vscode` mock.

## Global Constraints

- Language: JavaScript (ES modules with Babel transpilation).
- Test framework: Jest. Config in `package.json` sets `resetMocks: true`, `restoreMocks: true`, `clearMocks: true` — `jest.fn()` implementations must be re-applied in `beforeEach`.
- `vscode` module is mapped to `<rootDir>/test/__mocks__/vscode.js` via jest `moduleNameMapper`. Per-test-file `jest.mock('vscode', ...)` overrides this.
- Never mutate the cached static `completions` array (shared across documents). Only clone items that receive `additionalTextEdits`.
- Follow existing code style: no semicolons (Prettier config), single quotes, 2-space indent, no comments unless requested.
- Run lint after each task: `npm run lint:check`.
- Run tests after each task: `npx jest <test-file> --watchAll=false`.

---

## File Structure

| File | Responsibility | Action |
|------|---------------|--------|
| `src/util.js` | `fillCompletions` and `signatureToCompletion` stamp `requiredInclude` | Modify |
| `src/utils/includeAutoInsert.js` | Pure helper: scans document, attaches `additionalTextEdits` to cloned items | Create |
| `src/ai_completion.js` | Calls `attachIncludeEdits` on the merged result list | Modify |
| `package.json` | New `autoit.autoInsertInclude` config (default `true`) | Modify |
| `test/util.test.js` | Unit tests for `requiredInclude` stamping in `fillCompletions` / `signatureToCompletion` | Create |
| `test/utils/includeAutoInsert.test.js` | Unit tests for `attachIncludeEdits` | Create |
| `test/ai_completion.test.js` | Integration test: `provideCompletionItems` attaches edits for missing includes | Modify |

---

### Task 1: Stamp `requiredInclude` on UDF function completions

**Files:**
- Modify: `src/util.js:687-699` (`signatureToCompletion`)
- Test: `test/util.test.js` (create)

**Interfaces:**
- Produces: each completion object returned by `signatureToCompletion` gains a `requiredInclude: string` property when `detail` contains a `#include <...>` substring; otherwise `requiredInclude` is absent.

- [ ] **Step 1: Create `test/util.test.js` with a failing test for `signatureToCompletion`**

```javascript
jest.mock('vscode', () => ({
  CompletionItemKind: {
    Function: 3,
    Variable: 6,
    Constant: 13,
  },
  MarkdownString: class {
    constructor(value = '') {
      this.value = value;
    }
    appendCodeblock(text) {
      this.value += `\n\`\`\`\n${text}\n\`\`\``;
      return this;
    }
  },
}));

import { signatureToCompletion } from '../src/util';

describe('signatureToCompletion requiredInclude', () => {
  test('stamps requiredInclude when detail contains #include <...>', () => {
    const signatures = {
      _ArrayDisplay: {
        documentation: 'Displays an array',
        label: '_ArrayDisplay ( $aArray )',
        params: [],
      },
    };
    const detail = '(Requires: `#include <Array.au3>`)';
    const result = signatureToCompletion(signatures, 3, detail);

    expect(result).toHaveLength(1);
    expect(result[0].requiredInclude).toBe('Array.au3');
  });

  test('does not stamp requiredInclude when detail has no #include', () => {
    const signatures = {
      MsgBox: {
        documentation: 'Displays a message box',
        label: 'MsgBox ( $iFlag, $sText )',
        params: [],
      },
    };
    const result = signatureToCompletion(signatures, 3, 'Built-in Function');

    expect(result).toHaveLength(1);
    expect(result[0].requiredInclude).toBeUndefined();
  });

  test('handles detail without angle-bracket include (e.g. Debug.au3 format)', () => {
    const signatures = {
      _DebugOut: {
        documentation: 'Debug output',
        label: '_DebugOut ( $sText )',
        params: [],
      },
    };
    const detail = '`#include <Debug.au3>`';
    const result = signatureToCompletion(signatures, 3, detail);

    expect(result[0].requiredInclude).toBe('Debug.au3');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/util.test.js --watchAll=false`
Expected: FAIL — `result[0].requiredInclude` is `undefined`, assertion `toBe('Array.au3')` fails.

- [ ] **Step 3: Add `requiredInclude` stamping to `signatureToCompletion` in `src/util.js`**

In `src/util.js`, find the `signatureToCompletion` function (around line 687). Replace the function body's return statement so it parses the include filename out of `detail` and stamps it.

Replace this code (lines 687-699):

```javascript
const signatureToCompletion = (signatures, kind, detail) => {
  if (!signatures || typeof signatures !== 'object') {
    handleError('signatureToCompletion', 'Invalid signatures object', false, { signatures });
    return [];
  }

  return Object.entries(signatures).map(([key, signature]) => ({
    label: key,
    documentation: signature?.documentation || '',
    kind: kind || CompletionItemKind.Function,
    detail: detail || '',
  }));
};
```

With:

```javascript
const signatureToCompletion = (signatures, kind, detail) => {
  if (!signatures || typeof signatures !== 'object') {
    handleError('signatureToCompletion', 'Invalid signatures object', false, { signatures });
    return [];
  }

  const includeMatch =
    typeof detail === 'string' ? detail.match(/#include\s+<([^>]+)>/) : null;
  const requiredInclude = includeMatch ? includeMatch[1] : undefined;

  return Object.entries(signatures).map(([key, signature]) => ({
    label: key,
    documentation: signature?.documentation || '',
    kind: kind || CompletionItemKind.Function,
    detail: detail || '',
    ...(requiredInclude ? { requiredInclude } : {}),
  }));
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/util.test.js --watchAll=false`
Expected: PASS (3 tests).

- [ ] **Step 5: Run lint on changed file**

Run: `npx eslint src/util.js`
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/util.js test/util.test.js
git commit -m "feat: stamp requiredInclude on UDF function completions"
```

---

### Task 2: Stamp `requiredInclude` on constant completions

**Files:**
- Modify: `src/util.js:571-598` (`fillCompletions`)
- Test: `test/util.test.js` (extend)

**Interfaces:**
- Produces: each completion object returned by `fillCompletions` gains `requiredInclude: requiredScript` when `requiredScript` is a non-empty string; otherwise `requiredInclude` is absent.

- [ ] **Step 1: Add failing tests for `fillCompletions` to `test/util.test.js`**

Append to `test/util.test.js` (after the existing imports at the top, add `fillCompletions` to the import, then add a new describe block):

Update the import line at the top of `test/util.test.js`:

```javascript
import { signatureToCompletion, fillCompletions } from '../src/util';
```

Append this describe block at the end of the file:

```javascript
describe('fillCompletions requiredInclude', () => {
  test('stamps requiredInclude when requiredScript is provided', () => {
    const entries = [
      { label: '$MB_OK', documentation: 'OK button' },
      { label: '$MB_CANCEL', documentation: 'Cancel button' },
    ];
    const result = fillCompletions(entries, 13, '', 'MsgBoxConstants.au3');

    expect(result).toHaveLength(2);
    expect(result[0].requiredInclude).toBe('MsgBoxConstants.au3');
    expect(result[1].requiredInclude).toBe('MsgBoxConstants.au3');
  });

  test('does not stamp requiredInclude when requiredScript is empty', () => {
    const entries = [{ label: 'SomeKeyword', documentation: 'A keyword' }];
    const result = fillCompletions(entries, 3, 'Keyword', '');

    expect(result).toHaveLength(1);
    expect(result[0].requiredInclude).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/util.test.js --watchAll=false`
Expected: FAIL — `result[0].requiredInclude` is `undefined` in the first new test.

- [ ] **Step 3: Add `requiredInclude` to `fillCompletions` return in `src/util.js`**

In `src/util.js`, find the `fillCompletions` function (around line 571). The return object inside `entries.map` (lines 589-597) currently is:

```javascript
    return {
      ...entry,
      kind,
      detail: newDetail,
      get commitCharacters() {
        return kind === CompletionItemKind.Function && parenTriggerOn ? ['('] : [];
      },
      documentation: newDoc,
    };
```

Replace it with:

```javascript
    return {
      ...entry,
      kind,
      detail: newDetail,
      get commitCharacters() {
        return kind === CompletionItemKind.Function && parenTriggerOn ? ['('] : [];
      },
      documentation: newDoc,
      ...(requiredScript ? { requiredInclude: requiredScript } : {}),
    };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/util.test.js --watchAll=false`
Expected: PASS (5 tests total).

- [ ] **Step 5: Run lint**

Run: `npx eslint src/util.js`
Expected: No errors.

- [ ] **Step 6: Run full completion test suite to confirm no regressions**

Run: `npx jest test/completions --watchAll=false`
Expected: All existing completion tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/util.js test/util.test.js
git commit -m "feat: stamp requiredInclude on constant completions"
```

---

### Task 3: Create `attachIncludeEdits` helper and unit tests

**Files:**
- Create: `src/utils/includeAutoInsert.js`
- Test: `test/utils/includeAutoInsert.test.js` (create)

**Interfaces:**
- Produces: `attachIncludeEdits(items, document, enabled = true)` — returns a new array where items with a `requiredInclude` string whose include is missing from `document.getText()` are shallow-cloned with `additionalTextEdits: [TextEdit]` set. Items without `requiredInclude` or whose include is already present are returned as-is (same reference, no clone, no mutation). `document` must provide `getText()` returning a string. `enabled = false` returns `items` unchanged.

- [ ] **Step 1: Create `test/utils/includeAutoInsert.test.js` with failing tests**

```javascript
jest.mock('vscode', () => ({
  Position: class Position {
    constructor(line, character) {
      this.line = line;
      this.character = character;
    }
  },
  TextEdit: class TextEdit {
    static insert(position, newText) {
      return { position, newText, _isInsert: true };
    }
  },
}));

import { attachIncludeEdits } from '../../src/utils/includeAutoInsert';

const makeDoc = (text) => ({
  getText: () => text,
});

describe('attachIncludeEdits', () => {
  test('attaches additionalTextEdits when include is missing', () => {
    const items = [
      { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' },
      { label: 'MsgBox', kind: 3 },
    ];
    const doc = makeDoc('Local $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits).toHaveLength(1);
    expect(result[0].additionalTextEdits[0].newText).toBe('#include <Array.au3>\n');
    expect(result[0].additionalTextEdits[0].position.line).toBe(0);
    expect(result[1].additionalTextEdits).toBeUndefined();
  });

  test('does not attach edit when include is already present (angle form)', () => {
    const items = [
      { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' },
    ];
    const doc = makeDoc('#include <Array.au3>\nLocal $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits).toBeUndefined();
  });

  test('does not attach edit when include is already present (quoted form)', () => {
    const items = [
      { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' },
    ];
    const doc = makeDoc('#include "Array.au3"\nLocal $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits).toBeUndefined();
  });

  test('matches include case-insensitively', () => {
    const items = [
      { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' },
    ];
    const doc = makeDoc('#include <array.au3>\nLocal $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits).toBeUndefined();
  });

  test('matches include with stripped .au3 extension', () => {
    const items = [
      { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' },
    ];
    const doc = makeDoc('#include <Array>\nLocal $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits).toBeUndefined();
  });

  test('inserts after last existing #include line', () => {
    const items = [
      { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' },
    ];
    const doc = makeDoc('#include <MsgBoxConstants.au3>\n; comment\n#include <String.au3>\nLocal $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits[0].position.line).toBe(3);
  });

  test('inserts at line 0 when no existing includes', () => {
    const items = [
      { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' },
    ];
    const doc = makeDoc('Local $x = 1\nFunc Foo()\nEndFunc');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits[0].position.line).toBe(0);
  });

  test('returns items unchanged when enabled is false', () => {
    const items = [
      { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' },
    ];
    const doc = makeDoc('Local $x = 1');

    const result = attachIncludeEdits(items, doc, false);

    expect(result).toBe(items);
    expect(result[0].additionalTextEdits).toBeUndefined();
  });

  test('returns items unchanged when no item has requiredInclude', () => {
    const items = [
      { label: 'MsgBox', kind: 3 },
      { label: '$var', kind: 6 },
    ];
    const doc = makeDoc('Local $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result).toBe(items);
  });

  test('returns items unchanged when all required includes are present', () => {
    const items = [
      { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' },
      { label: '$MB_OK', kind: 13, requiredInclude: 'MsgBoxConstants.au3' },
    ];
    const doc = makeDoc('#include <Array.au3>\n#include <MsgBoxConstants.au3>\nLocal $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result).toBe(items);
  });

  test('does not mutate input item objects', () => {
    const item = { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' };
    const items = [item];
    const doc = makeDoc('Local $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0]).not.toBe(item);
    expect(item.additionalTextEdits).toBeUndefined();
  });

  test('handles empty items array', () => {
    const doc = makeDoc('Local $x = 1');
    const result = attachIncludeEdits([], doc, true);
    expect(result).toEqual([]);
  });

  test('handles empty document text', () => {
    const items = [
      { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' },
    ];
    const doc = makeDoc('');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits[0].position.line).toBe(0);
  });

  test('multiple missing includes each get their own edit', () => {
    const items = [
      { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' },
      { label: '$MB_OK', kind: 13, requiredInclude: 'MsgBoxConstants.au3' },
    ];
    const doc = makeDoc('Local $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits[0].newText).toBe('#include <Array.au3>\n');
    expect(result[1].additionalTextEdits[0].newText).toBe('#include <MsgBoxConstants.au3>\n');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/utils/includeAutoInsert.test.js --watchAll=false`
Expected: FAIL — module `../../src/utils/includeAutoInsert` not found.

- [ ] **Step 3: Create `src/utils/includeAutoInsert.js`**

```javascript
import { Position, TextEdit } from 'vscode';

const INCLUDE_LINE_REGEX = /^\s*#include\b/i;

const normalizeInclude = name => name.replace(/\.au3$/i, '').toLowerCase();

const collectExistingIncludes = docText => {
  const existing = new Set();
  const angled = /^#include\s+<([^>]+)>/gm;
  const quoted = /^#include\s+"([^"]+)"/gm;

  let match;
  while ((match = angled.exec(docText)) !== null) {
    if (match[1]) existing.add(normalizeInclude(match[1]));
  }
  while ((match = quoted.exec(docText)) !== null) {
    if (match[1]) existing.add(normalizeInclude(match[1]));
  }

  return existing;
};

const findInsertionLine = docText => {
  const lines = docText.split(/\r?\n/);
  let lastIncludeLine = -1;

  for (let i = 0; i < lines.length; i++) {
    if (INCLUDE_LINE_REGEX.test(lines[i])) {
      lastIncludeLine = i;
    }
  }

  return lastIncludeLine + 1;
};

const attachIncludeEdits = (items, document, enabled = true) => {
  if (!enabled || !Array.isArray(items) || items.length === 0) {
    return items;
  }

  try {
    const docText = document.getText();
    const requiredSet = new Set();

    for (const item of items) {
      if (item && typeof item.requiredInclude === 'string' && item.requiredInclude) {
        requiredSet.add(item.requiredInclude);
      }
    }

    if (requiredSet.size === 0) {
      return items;
    }

    const existing = collectExistingIncludes(docText);
    const missing = [...requiredSet].filter(
      name => !existing.has(normalizeInclude(name)),
    );

    if (missing.length === 0) {
      return items;
    }

    const missingSet = new Set(missing);
    const insertLine = findInsertionLine(docText);
    const editFor = includeName =>
      TextEdit.insert(new Position(insertLine, 0), `#include <${includeName}>\n`);

    return items.map(item => {
      if (
        item &&
        typeof item.requiredInclude === 'string' &&
        item.requiredInclude &&
        missingSet.has(item.requiredInclude)
      ) {
        return {
          ...item,
          additionalTextEdits: [editFor(item.requiredInclude)],
        };
      }

      return item;
    });
  } catch (error) {
    console.error(`[AutoIt Extension] attachIncludeEdits: ${error.message}`);
    return items;
  }
};

export default attachIncludeEdits;
export { attachIncludeEdits };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/utils/includeAutoInsert.test.js --watchAll=false`
Expected: PASS (14 tests).

- [ ] **Step 5: Run lint**

Run: `npx eslint src/utils/includeAutoInsert.js`
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/utils/includeAutoInsert.js test/utils/includeAutoInsert.test.js
git commit -m "feat: add attachIncludeEdits helper for auto-inserting #include"
```

---

### Task 4: Wire `attachIncludeEdits` into the completion provider and add config

**Files:**
- Modify: `src/ai_completion.js:365-457` (`provideCompletionItems`)
- Modify: `package.json` (add `autoit.autoInsertInclude` config property)
- Modify: `test/ai_completion.test.js` (add `TextEdit` to vscode mock, add integration test)

**Interfaces:**
- Consumes: `attachIncludeEdits` from `src/utils/includeAutoInsert.js` (Task 3), `requiredInclude` field on completion items (Tasks 1 & 2).

- [ ] **Step 1: Add `TextEdit` to the vscode mock in `test/ai_completion.test.js`**

In `test/ai_completion.test.js`, find the `jest.mock('vscode', ...)` block (around line 102). Add `TextEdit` to the returned object. Find this part:

```javascript
    Position: class {
      constructor(line, character) {
        this.line = line;
        this.character = character;
      }
    },
```

Immediately after the `Position` class (before `Uri: MockVSCodeUri,`), add:

```javascript
    TextEdit: class {
      static insert(position, newText) {
        return { position, newText, _isInsert: true };
      }
    },
```

- [ ] **Step 2: Add a failing integration test to `test/ai_completion.test.js`**

Add a new describe block at the end of the file (after the existing `describe('arraysMatch utility', ...)` block, around line 461):

```javascript
describe('attachIncludeEdits integration', () => {
  let provideCompletionItems;
  let languages;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    applyMockImplementations();

    ({ languages } = require('vscode'));

    jest.doMock('../src/completions', () => [
      { label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' },
      { label: 'MsgBox', kind: 3 },
    ]);

    require('../src/ai_completion');

    const [, provider] = languages.registerCompletionItemProvider.mock.calls[0] || [];
    if (provider) {
      ({ provideCompletionItems } = provider);
    }
  });

  test('attaches additionalTextEdits for missing include', async () => {
    const doc = new MockTextDocument('Local $x = 1\nFunc Foo()\nEndFunc', DOC1_PATH);
    const position = new MockPosition(0, 0);

    const completions = await provideCompletionItems(doc, position);

    const arrayItem = completions.find(c => c.label === '_ArrayDisplay');
    expect(arrayItem).toBeDefined();
    expect(arrayItem.additionalTextEdits).toHaveLength(1);
    expect(arrayItem.additionalTextEdits[0].newText).toBe('#include <Array.au3>\n');
    expect(arrayItem.additionalTextEdits[0].position.line).toBe(0);
  });

  test('does not attach edit when include already present', async () => {
    const doc = new MockTextDocument(
      '#include <Array.au3>\nLocal $x = 1\nFunc Foo()\nEndFunc',
      DOC1_PATH,
    );
    const position = new MockPosition(1, 0);

    const completions = await provideCompletionItems(doc, position);

    const arrayItem = completions.find(c => c.label === '_ArrayDisplay');
    expect(arrayItem).toBeDefined();
    expect(arrayItem.additionalTextEdits).toBeUndefined();
  });

  test('inserts after last existing #include line', async () => {
    const doc = new MockTextDocument(
      '#include <MsgBoxConstants.au3>\n; comment\n#include <String.au3>\nLocal $x = 1',
      DOC1_PATH,
    );
    const position = new MockPosition(3, 0);

    const completions = await provideCompletionItems(doc, position);

    const arrayItem = completions.find(c => c.label === '_ArrayDisplay');
    expect(arrayItem.additionalTextEdits[0].position.line).toBe(3);
  });

  test('respects autoInsertInclude = false config', async () => {
    const { workspace } = require('vscode');
    workspace.getConfiguration.mockReturnValue({
      get: jest.fn(key => (key === 'autoInsertInclude' ? false : false)),
    });

    const doc = new MockTextDocument('Local $x = 1\nFunc Foo()\nEndFunc', DOC1_PATH);
    const position = new MockPosition(0, 0);

    const completions = await provideCompletionItems(doc, position);

    const arrayItem = completions.find(c => c.label === '_ArrayDisplay');
    expect(arrayItem).toBeDefined();
    expect(arrayItem.additionalTextEdits).toBeUndefined();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx jest test/ai_completion.test.js --watchAll=false`
Expected: FAIL — `_ArrayDisplay` item has no `additionalTextEdits` because `attachIncludeEdits` is not yet wired in.

- [ ] **Step 4: Wire `attachIncludeEdits` into `provideCompletionItems` in `src/ai_completion.js`**

In `src/ai_completion.js`, add the import near the top of the file. Find the existing imports (lines 1-25). After line 25 (`import VariableTrackingService from './services/VariableTrackingService.js';`), add:

```javascript
import { attachIncludeEdits } from './utils/includeAutoInsert';
```

Then find the return statement at the end of `provideCompletionItems` (around lines 450-456):

```javascript
  return [
    ...completions,
    ...variableCompletions,
    ...localCompletions,
    ...includeCompletions,
    ...libraryCompletions,
  ];
```

Replace it with:

```javascript
  const merged = [
    ...completions,
    ...variableCompletions,
    ...localCompletions,
    ...includeCompletions,
    ...libraryCompletions,
  ];

  const autoInsertEnabled = workspace
    .getConfiguration('autoit')
    .get('autoInsertInclude', true);

  return attachIncludeEdits(merged, document, autoInsertEnabled);
```

- [ ] **Step 5: Add `autoit.autoInsertInclude` config to `package.json`**

In `package.json`, find the `autoit.enableParenTriggerForFunctions` property (around line 525-529):

```json
        "autoit.enableParenTriggerForFunctions": {
          "type": "boolean",
          "default": true,
          "description": "Adds the ability to use '(' to select a function completion suggestion, which will add the function with open and closed parens, place the cursor between them and trigger signature help. Requires window reload to take full effect."
        },
```

Immediately after that property's closing `},`, add:

```json
        "autoit.autoInsertInclude": {
          "type": "boolean",
          "default": true,
          "description": "Automatically insert the required #include <...> line when accepting a UDF function or constant completion that isn't yet included in the document."
        },
```

- [ ] **Step 6: Run the integration tests to verify they pass**

Run: `npx jest test/ai_completion.test.js --watchAll=false`
Expected: PASS — all existing tests plus the 4 new integration tests.

- [ ] **Step 7: Run the full test suite**

Run: `npm test`
Expected: All tests PASS, coverage thresholds met.

- [ ] **Step 8: Run lint**

Run: `npm run lint:check`
Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add src/ai_completion.js package.json test/ai_completion.test.js
git commit -m "feat: auto-insert #include on UDF/constant completion acceptance"
```

---

## Verification Checklist

After all tasks complete, verify:

- [ ] Accepting `_ArrayDisplay` in a document without `#include <Array.au3>` inserts the include line.
- [ ] Accepting `_ArrayDisplay` in a document that already has `#include <Array.au3>` does NOT insert a duplicate.
- [ ] Accepting a constant like `$MB_OK` without `#include <MsgBoxConstants.au3>` inserts it.
- [ ] The new `#include` line appears after the last existing `#include` (or at line 0 if none).
- [ ] Setting `autoit.autoInsertInclude` to `false` disables auto-insert.
- [ ] `npm test` passes with coverage thresholds met.
- [ ] `npm run lint:check` passes.
