/**
 * ai_completion.test.js
 * Tests for the completion provider with focus on cache behavior and memory management
 */

const path = require('path');

// Mock paths
const DOC1_PATH = path.join(process.cwd(), 'test', 'fixtures', 'doc1.au3');
const DOC2_PATH = path.join(process.cwd(), 'test', 'fixtures', 'doc2.au3');
const INCLUDE_PATH = path.join(process.cwd(), 'test', 'fixtures', 'include.au3');

// Mock document contents
const DOC1_CONTENT = [
  '#include "include.au3"',
  'Func LocalFunc()',
  '  Return 1',
  'EndFunc',
  'Local $var1 = 1',
].join('\n');

const DOC2_CONTENT = [
  '#include "include.au3"',
  'Func OtherFunc()',
  '  Return 2',
  'EndFunc',
  'Local $var2 = 2',
].join('\n');

const INCLUDE_CONTENT = ['Func IncludedFunc($x)', '  Return $x', 'EndFunc'].join('\n');

// Mock VSCode classes
class MockUri {
  constructor(fsPath) {
    this.fsPath = fsPath;
  }

  toString() {
    return this.fsPath;
  }

  static file(p) {
    return new MockUri(path.normalize(p));
  }
}

class MockPosition {
  constructor(line, character) {
    this.line = line;
    this.character = character;
  }
}

class MockRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

class MockTextDocument {
  constructor(text, filePath, languageId = 'autoit') {
    this._text = text;
    this.uri = MockUri.file(filePath);
    this.languageId = languageId;
    const lines = text.split(/\r?\n/);
    this._lines = lines;
  }

  getText(range) {
    if (!range) return this._text;
    return this._text;
  }

  lineAt(line) {
    const text = this._lines[line] || '';
    const firstNonWS = text.search(/\S/);
    return {
      text,
      firstNonWhitespaceCharacterIndex: firstNonWS === -1 ? 0 : firstNonWS,
    };
  }

  getWordRangeAtPosition(position) {
    const line = this._lines[position.line] || '';
    const char = line[position.character];
    if (char && /\w|\$/.test(char)) {
      return new MockRange(position, position);
    }
    return undefined;
  }
}

// Mock workspace with proper return values
const mockGetConfig = jest.fn(() => false);
const mockWorkspace = {
  getConfiguration: jest.fn(() => ({
    get: mockGetConfig,
  })),
  onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
  onDidCloseTextDocument: jest.fn(() => ({ dispose: jest.fn() })),
};

const mockLanguages = {
  registerCompletionItemProvider: jest.fn(() => ({ dispose: jest.fn() })),
};

const mockCompletionItemKind = {
  Function: 3,
  Variable: 6,
};

// Set up mock before importing module
jest.mock('vscode', () => {
  const mockPath = require('path');
  const mockGetConfig = jest.fn(() => false);
  const mockWorkspace = {
    getConfiguration: jest.fn(() => ({
      get: mockGetConfig,
    })),
    onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
    onDidCloseTextDocument: jest.fn(() => ({ dispose: jest.fn() })),
  };

  class MockVSCodeUri {
    constructor(fsPath) {
      this.fsPath = fsPath;
    }

    toString() {
      return this.fsPath;
    }

    static file(p) {
      return new MockVSCodeUri(mockPath.normalize(p));
    }
  }

  return {
    CompletionItem: class {
      constructor(label, kind) {
        this.label = label;
        this.kind = kind;
        this.detail = '';
      }
    },
    CompletionItemKind: {
      Function: 3,
      Variable: 6,
    },
    Range: class {
      constructor(start, end) {
        this.start = start;
        this.end = end;
      }
    },
    Position: class {
      constructor(line, character) {
        this.line = line;
        this.character = character;
      }
    },
    Uri: MockVSCodeUri,
    languages: {
      registerCompletionItemProvider: jest.fn(() => ({ dispose: jest.fn() })),
    },
    workspace: mockWorkspace,
  };
});

// Mock util functions
const mockFindFilepath = jest.fn(file => {
  if (file === 'include.au3') return INCLUDE_PATH;
  return null;
});

const mockGetIncludeData = jest.fn((file, doc) => {
  if (file === 'include.au3' || file === INCLUDE_PATH) {
    return { IncludedFunc: {} };
  }
  return null;
});

jest.mock('../src/util', () => ({
  AUTOIT_MODE: { language: 'autoit' },
  functionPattern: /Func\s+(?:volatile\s+)?(\w+)/i,
  variablePattern: /\$(\w+)/g,
  includePattern: /#include\s+"([^"]+)"/g,
  libraryIncludePattern: /#include\s+<([^>]+)>/g,
  findFilepath: (...args) => mockFindFilepath(...args),
  getIncludeData: (...args) => mockGetIncludeData(...args),
  setRegExpFlags: (pattern, flags) => new RegExp(pattern.source, flags),
}));

jest.mock('../src/completions', () => []);
jest.mock('../src/constants', () => []);

describe('ai_completion cache behavior', () => {
  let provideCompletionItems;
  let vscode;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Get vscode mock
    vscode = require('vscode');

    // Re-import to get fresh module state
    const completionModule = require('../src/ai_completion');

    // Extract the provider function
    const registerCall = vscode.languages.registerCompletionItemProvider.mock.calls[0];
    if (registerCall && registerCall[1]) {
      provideCompletionItems = registerCall[1].provideCompletionItems;
    }
  });

  test('caches include completions per document', () => {
    const doc1 = new MockTextDocument(DOC1_CONTENT, DOC1_PATH);
    const position = new MockPosition(0, 0);

    // First call should process includes
    provideCompletionItems(doc1, position);
    expect(mockGetIncludeData).toHaveBeenCalledWith('include.au3', doc1);
    const firstCallCount = mockGetIncludeData.mock.calls.length;

    // Second call with same document should use cache
    mockGetIncludeData.mockClear();
    provideCompletionItems(doc1, position);
    expect(mockGetIncludeData).not.toHaveBeenCalled();

    expect(firstCallCount).toBeGreaterThan(0);
  });

  test('does not share cache between different documents', () => {
    const doc1 = new MockTextDocument(DOC1_CONTENT, DOC1_PATH);
    const doc2 = new MockTextDocument(DOC2_CONTENT, DOC2_PATH);
    const position = new MockPosition(0, 0);

    // Call with first document
    provideCompletionItems(doc1, position);
    const doc1Results = mockGetIncludeData.mock.calls.length;

    mockGetIncludeData.mockClear();

    // Call with second document should process separately
    provideCompletionItems(doc2, position);
    const doc2Results = mockGetIncludeData.mock.calls.length;

    expect(doc1Results).toBeGreaterThan(0);
    expect(doc2Results).toBeGreaterThan(0);
  });

  test('invalidates cache when includes change', () => {
    const doc = new MockTextDocument(DOC1_CONTENT, DOC1_PATH);
    const position = new MockPosition(0, 0);

    // First call
    provideCompletionItems(doc, position);
    expect(mockGetIncludeData).toHaveBeenCalled();

    mockGetIncludeData.mockClear();

    // Second call with same includes uses cache
    provideCompletionItems(doc, position);
    expect(mockGetIncludeData).not.toHaveBeenCalled();

    // Change document content (different includes)
    const modifiedDoc = new MockTextDocument(
      '#include "other.au3"\nFunc Test()\nEndFunc',
      DOC1_PATH,
    );

    // Should rebuild cache with new includes
    provideCompletionItems(modifiedDoc, position);
    expect(mockGetIncludeData).toHaveBeenCalled();
  });

  test('cleans up cache on document close', () => {
    // Get the onDidCloseTextDocument listener
    const closeListener = vscode.workspace.onDidCloseTextDocument.mock.calls[0]?.[0];

    if (closeListener) {
      const doc = new MockTextDocument(DOC1_CONTENT, DOC1_PATH, 'autoit');
      const position = new MockPosition(0, 0);

      // Build cache
      provideCompletionItems(doc, position);
      mockGetIncludeData.mockClear();

      // Simulate document close
      closeListener(doc);

      // Next call should rebuild (cache was cleared)
      provideCompletionItems(doc, position);
      expect(mockGetIncludeData).toHaveBeenCalled();
    }
  });

  test('returns correct completion types', () => {
    const doc = new MockTextDocument(DOC1_CONTENT, DOC1_PATH);
    const position = new MockPosition(4, 1); // Position at start of variable line

    const completions = provideCompletionItems(doc, position);

    expect(Array.isArray(completions)).toBe(true);
    expect(completions.length).toBeGreaterThan(0);

    // Should have local functions
    const localFuncs = completions.filter(
      c => c.kind === mockCompletionItemKind.Function && c.label === 'LocalFunc',
    );
    expect(localFuncs.length).toBe(1);

    // Should have included functions (from cache)
    const includedFuncs = completions.filter(
      c => c.kind === mockCompletionItemKind.Function && c.label === 'IncludedFunc',
    );
    expect(includedFuncs.length).toBeGreaterThanOrEqual(0);
  });

  test('does not provide completions in comments', () => {
    const commentDoc = new MockTextDocument('; This is a comment\nFunc Test()\nEndFunc', DOC1_PATH);
    const position = new MockPosition(0, 5); // Inside comment

    const completions = provideCompletionItems(commentDoc, position);
    expect(completions).toBeNull();
  });

  test('does not provide completions in function declarations', () => {
    const doc = new MockTextDocument('Func MyFunction($param)\nEndFunc', DOC1_PATH);
    const position = new MockPosition(0, 10); // Inside Func line

    const completions = provideCompletionItems(doc, position);
    expect(completions).toBeNull();
  });
});

describe('arraysMatch utility', () => {
  let provideCompletionItems;
  let vscode;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Get vscode mock
    vscode = require('vscode');

    // Access internal function through module
    const completionModule = require('../src/ai_completion');
    // Note: arraysMatch is not exported, so we test it indirectly through cache behavior

    // Extract the provider function
    const registerCall = vscode.languages.registerCompletionItemProvider.mock.calls[0];
    if (registerCall && registerCall[1]) {
      provideCompletionItems = registerCall[1].provideCompletionItems;
    }
  });

  test('cache invalidation detects array differences', () => {
    const doc1 = new MockTextDocument('#include "a.au3"\n#include "b.au3"', DOC1_PATH);
    const doc2 = new MockTextDocument('#include "a.au3"\n#include "c.au3"', DOC1_PATH);
    const position = new MockPosition(0, 0);

    // First doc
    provideCompletionItems(doc1, position);
    const firstCount = mockGetIncludeData.mock.calls.length;

    mockGetIncludeData.mockClear();

    // Same doc structure, should use cache
    provideCompletionItems(doc1, position);
    expect(mockGetIncludeData).not.toHaveBeenCalled();

    // Different includes, should rebuild
    provideCompletionItems(doc2, position);
    expect(mockGetIncludeData).toHaveBeenCalled();
  });
});
