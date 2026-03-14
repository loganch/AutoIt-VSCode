const mockRegisterHoverProvider = jest.fn(() => ({ dispose: jest.fn() }));

jest.mock('../src/hovers', () => ({
  __esModule: true,
  default: {
    myfunc: 'My hover docs',
  },
}));

jest.mock('../src/util', () => ({
  AUTOIT_MODE: { language: 'autoit' },
}));

jest.mock('vscode', () => ({
  Hover: class Hover {
    constructor(contents) {
      this.contents = contents;
    }
  },
  languages: {
    registerHoverProvider: (...args) => mockRegisterHoverProvider(...args),
  },
}));

describe('ai_hover module', () => {
  let hoverModule;
  let provider;
  let registeredMode;

  beforeAll(() => {
    hoverModule = require('../src/ai_hover');
    registeredMode = mockRegisterHoverProvider.mock.calls[0]?.[0] ?? null;
    provider = mockRegisterHoverProvider.mock.calls[0]?.[1] ?? null;
  });

  test('registers hover provider for AutoIt mode', () => {
    expect(registeredMode).toEqual({ language: 'autoit' });
    expect(provider).toEqual(expect.objectContaining({ provideHover: expect.any(Function) }));
    expect(hoverModule.default).toBeDefined();
  });

  test('returns hover for known symbol', () => {
    const document = {
      getWordRangeAtPosition: jest.fn(() => ({ start: 0, end: 6 })),
      getText: jest.fn(() => 'MyFunc'),
    };

    const result = provider.provideHover(document, { line: 0, character: 0 });

    expect(result).toBeDefined();
    expect(result.contents).toBe('My hover docs');
  });

  test('returns null for unknown symbol', () => {
    const document = {
      getWordRangeAtPosition: jest.fn(() => ({ start: 0, end: 7 })),
      getText: jest.fn(() => 'Unknown'),
    };

    const result = provider.provideHover(document, { line: 0, character: 0 });

    expect(result).toBeNull();
  });

  test('returns null when there is no word range', () => {
    const document = {
      getWordRangeAtPosition: jest.fn(() => null),
      getText: jest.fn(),
    };

    const result = provider.provideHover(document, { line: 0, character: 0 });

    expect(result).toBeNull();
  });
});
