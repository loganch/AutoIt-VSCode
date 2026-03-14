jest.mock('vscode', () => ({
  CompletionItemKind: {
    Constant: 'constant',
  },
  SnippetString: class SnippetString {
    constructor(value = '') {
      this.value = value;
    }

    appendText(text) {
      this.value += text;
      return this;
    }

    appendPlaceholder(text) {
      this.value += text;
      return this;
    }

    appendChoice(choices) {
      this.value += choices.join('|');
      return this;
    }
  },
}));

jest.mock('../../src/util', () => ({
  fillCompletions: jest.fn((items, kind, detail) =>
    items.map(item => ({
      ...item,
      detail,
      kind,
    })),
  ),
}));

import entries from '../../src/completions/send_keys';

describe('send_keys completions', () => {
  it('exports an array', () => {
    expect(Array.isArray(entries)).toBe(true);
  });

  it('contains many completion entries', () => {
    expect(entries.length).toBeGreaterThan(20);
  });

  it('marks entries as constants with Send() Command detail', () => {
    expect(entries[0]).toEqual(
      expect.objectContaining({
        detail: 'Send() Command',
        kind: 'constant',
        label: expect.any(String),
      }),
    );
  });

  it('includes common send key tokens', () => {
    const labels = entries.map(entry => entry.label);
    expect(labels).toContain('{ALT}');
    expect(labels).toContain('{ENTER}');
    expect(labels).toContain('{TAB}');
  });

  it('preserves snippet insertText objects for templated entries', () => {
    const ascEntry = entries.find(entry => entry.label === '{ASC}');
    expect(ascEntry).toBeDefined();
    expect(typeof ascEntry.insertText).toBe('object');
  });
});
