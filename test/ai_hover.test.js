const mockRegisterHoverProvider = jest.fn(() => ({ dispose: jest.fn() }));

jest.mock('../src/hovers', () => ({
  __esModule: true,
  default: {
    myfunc: 'My hover docs',
  },
}));

jest.mock('../src/utils/coreConstants', () => ({
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
    hoverModule = require('../src/providers/ai_hover');
    hoverModule.default();
    registeredMode = mockRegisterHoverProvider.mock.calls[0]?.[0] ?? null;
    provider = mockRegisterHoverProvider.mock.calls[0]?.[1] ?? null;
  });

  test('registers hover provider for AutoIt mode', () => {
    expect(registeredMode).toEqual({ language: 'autoit' });
    expect(provider).toEqual(expect.objectContaining({ provideHover: expect.any(Function) }));
    expect(hoverModule.default).toBeDefined();
  });

  const makeLine = text => ({ text, firstNonWhitespaceCharacterIndex: text.search(/\S/) });

  test('returns hover for known symbol', async () => {
    const document = {
      getWordRangeAtPosition: jest.fn(() => ({ start: 0, end: 6 })),
      getText: jest.fn(() => 'MyFunc'),
      lineAt: jest.fn(() => makeLine('MyFunc')),
    };

    const result = await provider.provideHover(document, { line: 0, character: 0 });

    expect(result).toBeDefined();
    expect(result.contents).toBe('My hover docs');
  });

  test('returns null for unknown symbol', async () => {
    const document = {
      getWordRangeAtPosition: jest.fn(() => ({ start: 0, end: 7 })),
      getText: jest.fn(() => 'Unknown'),
      lineAt: jest.fn(() => makeLine('Unknown')),
    };

    const result = await provider.provideHover(document, { line: 0, character: 0 });

    expect(result).toBeNull();
  });

  test('returns null when there is no word range', async () => {
    const document = {
      getWordRangeAtPosition: jest.fn(() => null),
      getText: jest.fn(),
      lineAt: jest.fn(() => makeLine('')),
    };

    const result = await provider.provideHover(document, { line: 0, character: 0 });

    expect(result).toBeNull();
  });

  test('returns null when the word is on a semicolon comment line', async () => {
    const document = {
      getWordRangeAtPosition: jest.fn(() => ({ start: 0, end: 6 })),
      getText: jest.fn(() => 'MyFunc'),
      lineAt: jest.fn(() => makeLine('  ; MyFunc')),
    };

    const result = await provider.provideHover(document, { line: 0, character: 4 });

    expect(result).toBeNull();
  });

  test('returns null when the word is inside a #cs/#ce comment block', async () => {
    const lines = ['#cs', 'MyFunc', '#ce'];
    const document = {
      getWordRangeAtPosition: jest.fn(() => ({ start: 0, end: 6 })),
      getText: jest.fn(() => 'MyFunc'),
      lineAt: jest.fn(i => makeLine(lines[i])),
    };

    const result = await provider.provideHover(document, { line: 1, character: 0 });

    expect(result).toBeNull();
  });

  test('returns null when the word is inside a #comments-start/#comments-end block', async () => {
    const lines = ['#comments-start', 'MyFunc', '#comments-end'];
    const document = {
      getWordRangeAtPosition: jest.fn(() => ({ start: 0, end: 6 })),
      getText: jest.fn(() => 'MyFunc'),
      lineAt: jest.fn(i => makeLine(lines[i])),
    };

    const result = await provider.provideHover(document, { line: 1, character: 0 });

    expect(result).toBeNull();
  });

  test('returns hover for known symbol after a closed comment block', async () => {
    const lines = ['#cs', 'old stuff', '#ce', 'MyFunc'];
    const document = {
      getWordRangeAtPosition: jest.fn(() => ({ start: 0, end: 6 })),
      getText: jest.fn(() => 'MyFunc'),
      lineAt: jest.fn(i => makeLine(lines[i])),
    };

    const result = await provider.provideHover(document, { line: 3, character: 0 });

    expect(result).toBeDefined();
    expect(result.contents).toBe('My hover docs');
  });
});
