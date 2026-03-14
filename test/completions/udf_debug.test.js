jest.mock('vscode', () => ({
  CompletionItemKind: {
    Function: 'function',
  },
}));

jest.mock('../../src/util', () => ({
  fillCompletions: jest.fn((items, kind, detail, includeFile) =>
    items.map(item => ({
      ...item,
      kind,
      detail,
      includeFile,
    })),
  ),
}));

import functions from '../../src/completions/udf_debug';

describe('udf_debug completions', () => {
  it('exports a completion array', () => {
    expect(Array.isArray(functions)).toBe(true);
    expect(functions.length).toBeGreaterThan(0);
  });

  it('contains expected debug UDF entries', () => {
    const labels = functions.map(entry => entry.label);
    expect(labels).toContain('_DebugSetup');
    expect(labels).toContain('_DebugReport');
    expect(labels).toContain('_Assert');
  });

  it('decorates items with function kind and Debug metadata', () => {
    expect(functions[0]).toEqual(
      expect.objectContaining({
        kind: 'function',
        detail: 'Debug UDF',
        includeFile: 'Debug.au3',
      }),
    );
  });
});
