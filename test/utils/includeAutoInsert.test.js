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

const makeDoc = text => ({
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
    const items = [{ label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' }];
    const doc = makeDoc('#include <Array.au3>\nLocal $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits).toBeUndefined();
  });

  test('does not attach edit when include is already present (quoted form)', () => {
    const items = [{ label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' }];
    const doc = makeDoc('#include "Array.au3"\nLocal $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits).toBeUndefined();
  });

  test('matches include case-insensitively', () => {
    const items = [{ label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' }];
    const doc = makeDoc('#include <array.au3>\nLocal $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits).toBeUndefined();
  });

  test('matches include with stripped .au3 extension', () => {
    const items = [{ label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' }];
    const doc = makeDoc('#include <Array>\nLocal $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits).toBeUndefined();
  });

  test('detects indented include as present', () => {
    const items = [{ label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' }];
    const doc = makeDoc('    #include <Array.au3>\nLocal $x = 1');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits).toBeUndefined();
  });

  test('inserts after last existing #include line', () => {
    const items = [{ label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' }];
    const doc = makeDoc(
      '#include <MsgBoxConstants.au3>\n; comment\n#include <String.au3>\nLocal $x = 1',
    );

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits[0].position.line).toBe(3);
  });

  test('inserts at line 0 when no existing includes', () => {
    const items = [{ label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' }];
    const doc = makeDoc('Local $x = 1\nFunc Foo()\nEndFunc');

    const result = attachIncludeEdits(items, doc, true);

    expect(result[0].additionalTextEdits[0].position.line).toBe(0);
  });

  test('returns items unchanged when enabled is false', () => {
    const items = [{ label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' }];
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
    const items = [{ label: '_ArrayDisplay', kind: 3, requiredInclude: 'Array.au3' }];
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
