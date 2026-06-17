jest.mock('vscode', () => ({
  CompletionItemKind: {
    Function: 'function',
  },
  MarkdownString: class MarkdownString {
    constructor(value = '') {
      this.value = value;
    }
  },
}));

jest.mock('../../src/util', () => ({
  signatureToCompletion: jest.fn((signatures, kind) =>
    Object.keys(signatures).map(key => ({
      label: key,
      kind,
      detail: 'Debug UDF',
      includeFile: 'Debug.au3',
      documentation: { value: signatures[key].documentation },
    })),
  ),
  signatureToHover: jest.fn(signatures =>
    Object.keys(signatures).reduce((acc, key) => {
      acc[key.toLowerCase()] = signatures[key].documentation;
      return acc;
    }, {}),
  ),
}));

import { completions as functions } from '../../src/signatures/udf_debug';

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
