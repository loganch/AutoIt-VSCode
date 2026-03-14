const path = require('path');

const mockFindFilepath = jest.fn(() => '');
const mockExistsSync = jest.fn();
const mockReadFileSync = jest.fn();
const mockStatSync = jest.fn(() => ({ mtimeMs: 1 }));

const normalizedEndsWith = (inputPath, suffix) =>
  path.normalize(inputPath).toLowerCase().endsWith(path.normalize(suffix).toLowerCase());

jest.mock('fs', () => ({
  existsSync: (...args) => mockExistsSync(...args),
  readFileSync: (...args) => mockReadFileSync(...args),
  statSync: (...args) => mockStatSync(...args),
}));

jest.mock('vscode', () => ({
  CompletionItemKind: {
    Function: 'function',
    Constant: 'constant',
  },
  MarkdownString: class MarkdownString {
    constructor(value = '') {
      this.value = value;
    }

    appendCodeblock(code, language) {
      this.codeblock = { code, language };
      return this;
    }
  },
  window: {
    showErrorMessage: jest.fn(),
  },
  workspace: {
    getConfiguration: jest.fn(() => ({
      get: jest.fn(() => false),
    })),
    onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
  },
}));

jest.mock('../../src/ai_config', () => ({
  __esModule: true,
  default: {
    findFilepath: (...args) => mockFindFilepath(...args),
  },
}));

const {
  getIncludePath,
  getIncludeScripts,
  getIncludeText,
  isSkippableLine,
  normalizePath,
  setRegExpFlags,
} = require('../../src/util');

describe('util module', () => {
  const fixturesDir = path.join(process.cwd(), 'fixtures');
  const helperPath = path.join(fixturesDir, 'helper.au3');
  const nestedPath = path.join(fixturesDir, 'nested.au3');
  const mainDocumentPath = path.join(fixturesDir, 'main.au3');

  beforeEach(() => {
    jest.clearAllMocks();
    mockFindFilepath.mockImplementation(() => '');
    mockStatSync.mockImplementation(() => ({ mtimeMs: 1 }));

    mockExistsSync.mockImplementation(filePath => {
      return normalizedEndsWith(filePath, helperPath) || normalizedEndsWith(filePath, nestedPath);
    });

    mockReadFileSync.mockImplementation(filePath => {
      if (normalizedEndsWith(filePath, helperPath)) {
        return '#include "nested.au3"';
      }

      return '; nested include';
    });
  });

  test('normalizePath returns an absolute path', () => {
    const normalized = normalizePath(path.join('fixtures', 'helper.au3'));

    expect(path.isAbsolute(normalized)).toBe(true);
    expect(path.basename(normalized)).toBe('helper.au3');
  });

  test('setRegExpFlags preserves the original pattern', () => {
    const baseRegex = /autoit/i;
    const updatedRegex = setRegExpFlags(baseRegex, 'gm');

    expect(updatedRegex.source).toBe(baseRegex.source);
    expect(updatedRegex.flags).toBe('gm');
  });

  test('getIncludePath resolves quoted includes relative to the current document', () => {
    const document = {
      fileName: mainDocumentPath,
      getText: jest.fn(),
      uri: { fsPath: mainDocumentPath },
    };

    const resolved = getIncludePath('"helper.au3"', document);

    expect(path.basename(resolved)).toBe('helper.au3');
  });

  test('getIncludeText reads and caches AutoIt include files', () => {
    const firstRead = getIncludeText(helperPath);
    const secondRead = getIncludeText(helperPath);

    expect(firstRead).toContain('nested.au3');
    expect(secondRead).toBe(firstRead);
    expect(mockReadFileSync).toHaveBeenCalledTimes(1);
  });

  test('getIncludeScripts collects nested include files recursively', () => {
    const document = {
      fileName: mainDocumentPath,
      getText: jest.fn(),
      uri: { fsPath: mainDocumentPath },
    };
    const scriptsToSearch = [];

    getIncludeScripts(document, '#include "helper.au3"', scriptsToSearch);

    expect(scriptsToSearch.map(filePath => path.basename(filePath))).toEqual([
      'helper.au3',
      'nested.au3',
    ]);
  });

  test('isSkippableLine ignores comments but keeps code', () => {
    const commentLine = {
      firstNonWhitespaceCharacterIndex: 0,
      isEmptyOrWhitespace: false,
      text: '; comment',
    };
    const codeLine = {
      firstNonWhitespaceCharacterIndex: 0,
      isEmptyOrWhitespace: false,
      text: 'Local $value = 1',
    };

    expect(isSkippableLine(commentLine)).toBe(true);
    expect(isSkippableLine(codeLine)).toBe(false);
  });
});
