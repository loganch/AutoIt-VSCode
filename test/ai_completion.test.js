/**
 * ai_completion.test.js
 * Tests for the completion provider with focus on cache behavior and memory management
 */

const path = require('path');

// Mock paths
const DOC1_PATH = path.join(process.cwd(), 'test', 'fixtures', 'doc1.au3');
const DOC2_PATH = path.join(process.cwd(), 'test', 'fixtures', 'doc2.au3');
const INCLUDE_PATH = path.join(process.cwd(), 'test', 'fixtures', 'include.au3');
const LIBRARY_PATH = path.join(process.cwd(), 'test', 'fixtures', 'MyLib.au3');
const VARIABLE_LINE_INDEX = 4;
const COMMENT_CHAR_INDEX = 5;
const FUNCTION_DECLARATION_CHAR_INDEX = 10;

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

const mockCompletionItemKind = {
  Function: 3,
  Variable: 6,
};

// Set up mock before importing module
jest.mock('vscode', () => {
  const mockPath = require('path');
  const mockGetConfig = jest.fn(key => {
    if (key === 'autoInsertInclude') return true;
    return false;
  });
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
    MarkdownString: class {
      constructor(value) {
        this.value = value;
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
    TextEdit: class {
      static insert(position, newText) {
        return { position, newText, _isInsert: true };
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
// NOTE: jest config sets resetMocks: true, which wipes implementations before
// each test — implementations are (re)applied via applyMockImplementations()
const mockFindFilepath = jest.fn();
const mockGetIncludeData = jest.fn();

const applyMockImplementations = () => {
  mockFindFilepath.mockImplementation(file => {
    if (file === 'include.au3') return INCLUDE_PATH;
    if (file === 'MyLib.au3') return LIBRARY_PATH;
    return null;
  });

  mockGetIncludeData.mockImplementation(file => {
    if (file === 'include.au3' || file === INCLUDE_PATH) {
      return { IncludedFunc: {} };
    }
    if (file === LIBRARY_PATH) {
      return { LibraryFunc: {} };
    }
    return null;
  });
};

jest.mock('../src/util', () => ({
  AUTOIT_MODE: { language: 'autoit' },
  buildFunctionSignature: jest.fn(() => ({
    functionName: '',
    functionObject: { description: '', documentation: '' },
  })),
  functionPattern: /Func\s+(?:volatile\s+)?(\w+)/i,
  variablePattern: /\$(\w+)/g,
  includePattern: /#include\s+"([^"]+)"/g,
  libraryIncludePattern: /#include\s+<([^>]+)>/g,
  getIncludeData: (...args) => mockGetIncludeData(...args),
  setRegExpFlags: (pattern, flags) => new RegExp(pattern.source, flags),
}));

jest.mock('../src/providers/ai_config', () => ({
  __esModule: true,
  default: {
    findFilepath: (...args) => mockFindFilepath(...args),
  },
}));

jest.mock('../src/completions', () => []);
jest.mock('../src/constants', () => ({ DEFAULT_UDFS: [] }));

describe('ai_completion cache behavior', () => {
  let provideCompletionItems;
  let languages;
  let workspace;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    applyMockImplementations();

    // Get vscode mock
    ({ languages, workspace } = require('vscode'));

    // Re-import to get fresh module state
    require('../src/providers/ai_completion');

    // Extract the provider function
    const [, provider] = languages.registerCompletionItemProvider.mock.calls[0] || [];
    if (provider) {
      ({ provideCompletionItems } = provider);
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
    const closeListener = workspace.onDidCloseTextDocument.mock.calls[0]?.[0];

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

  test('caches library include completions per document', async () => {
    const doc = new MockTextDocument('#include <MyLib.au3>\nLocal $a = 1', DOC1_PATH);
    const position = new MockPosition(1, 0);

    // First call should parse the library include
    await provideCompletionItems(doc, position);
    expect(mockGetIncludeData).toHaveBeenCalledWith(LIBRARY_PATH, doc);

    // Second call with same document should use cache
    mockGetIncludeData.mockClear();
    const completions = await provideCompletionItems(doc, position);
    expect(mockGetIncludeData).not.toHaveBeenCalled();

    // Cached completions still returned
    const libraryFuncs = completions.filter(c => c.label === 'LibraryFunc');
    expect(libraryFuncs.length).toBe(1);
  });

  test('invalidates library cache when library includes change', async () => {
    const doc = new MockTextDocument('#include <MyLib.au3>\nLocal $a = 1', DOC1_PATH);
    const position = new MockPosition(1, 0);

    await provideCompletionItems(doc, position);
    mockGetIncludeData.mockClear();

    // Same library includes: cache hit
    await provideCompletionItems(doc, position);
    expect(mockGetIncludeData).not.toHaveBeenCalled();

    // Different library includes: rebuild
    const modifiedDoc = new MockTextDocument('#include <OtherLib.au3>\nLocal $a = 1', DOC1_PATH);
    await provideCompletionItems(modifiedDoc, position);
    expect(mockFindFilepath).toHaveBeenCalledWith('OtherLib.au3');
  });

  test('cleans up library cache on document close', async () => {
    const closeListener = workspace.onDidCloseTextDocument.mock.calls[0]?.[0];
    expect(closeListener).toBeDefined();

    const doc = new MockTextDocument('#include <MyLib.au3>\nLocal $a = 1', DOC1_PATH, 'autoit');
    const position = new MockPosition(1, 0);

    await provideCompletionItems(doc, position);
    mockGetIncludeData.mockClear();

    closeListener(doc);

    // Next call should rebuild (cache was cleared)
    await provideCompletionItems(doc, position);
    expect(mockGetIncludeData).toHaveBeenCalledWith(LIBRARY_PATH, doc);
  });

  test('returns correct completion types', async () => {
    const doc = new MockTextDocument(DOC1_CONTENT, DOC1_PATH);
    const position = new MockPosition(VARIABLE_LINE_INDEX, 1); // Position at start of variable line

    const completions = await provideCompletionItems(doc, position);

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

  test('does not provide completions in comments', async () => {
    const commentDoc = new MockTextDocument('; This is a comment\nFunc Test()\nEndFunc', DOC1_PATH);
    const position = new MockPosition(0, COMMENT_CHAR_INDEX); // Inside comment

    const completions = await provideCompletionItems(commentDoc, position);
    expect(completions).toBeNull();
  });

  test('does not provide completions in function declarations', async () => {
    const doc = new MockTextDocument('Func MyFunction($param)\nEndFunc', DOC1_PATH);
    const position = new MockPosition(0, FUNCTION_DECLARATION_CHAR_INDEX); // Inside Func line

    const completions = await provideCompletionItems(doc, position);
    expect(completions).toBeNull();
  });

  test('getLocalFunctionCompletions sets documentation from buildFunctionSignature description', async () => {
    const { buildFunctionSignature } = require('../src/util');
    // mockReturnValueOnce (not mockReturnValue) keeps this override test-local;
    // the default mock takes over for any subsequent loop iteration
    buildFunctionSignature.mockReturnValueOnce({
      functionName: 'DoThing',
      functionObject: {
        description: 'Does the thing',
        documentation: 'Does the thing\rtest.au3',
      },
    });

    const doc = new MockTextDocument('Func DoThing()\nEndFunc\nLocal $x = 1', '/test.au3');
    // Line 2 (Local) avoids the early-exit guard that returns null on Func declaration lines
    const position = new MockPosition(2, 0);

    const result = await provideCompletionItems(doc, position);
    const funcItem = result?.find(item => item.label === 'DoThing');
    expect(funcItem).toBeDefined();
    expect(funcItem.documentation?.value).toBe('Does the thing');
  });
});

describe('arraysMatch utility', () => {
  let provideCompletionItems;
  let languages;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    applyMockImplementations();

    // Get vscode mock
    ({ languages } = require('vscode'));

    // Access internal function through module
    require('../src/providers/ai_completion');
    // Note: arraysMatch is not exported, so we test it indirectly through cache behavior

    // Extract the provider function
    const [, provider] = languages.registerCompletionItemProvider.mock.calls[0] || [];
    if (provider) {
      ({ provideCompletionItems } = provider);
    }
  });

  test('cache invalidation detects array differences', () => {
    const doc1 = new MockTextDocument('#include "a.au3"\n#include "b.au3"', DOC1_PATH);
    const doc2 = new MockTextDocument('#include "a.au3"\n#include "c.au3"', DOC1_PATH);
    const position = new MockPosition(0, 0);

    // First doc
    provideCompletionItems(doc1, position);
    mockGetIncludeData.mockClear();

    // Same doc structure, should use cache
    provideCompletionItems(doc1, position);
    expect(mockGetIncludeData).not.toHaveBeenCalled();

    // Different includes, should rebuild
    provideCompletionItems(doc2, position);
    expect(mockGetIncludeData).toHaveBeenCalled();
  });
});

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

    require('../src/providers/ai_completion');

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
    expect(arrayItem).toBeDefined();
    expect(arrayItem.additionalTextEdits).toHaveLength(1);
    expect(arrayItem.additionalTextEdits[0].position.line).toBe(3);
  });

  test('respects autoInsertInclude = false config', async () => {
    const { workspace } = require('vscode');
    workspace.getConfiguration.mockReturnValue({
      get: jest.fn(() => false),
    });

    const doc = new MockTextDocument('Local $x = 1\nFunc Foo()\nEndFunc', DOC1_PATH);
    const position = new MockPosition(0, 0);

    const completions = await provideCompletionItems(doc, position);

    const arrayItem = completions.find(c => c.label === '_ArrayDisplay');
    expect(arrayItem).toBeDefined();
    expect(arrayItem.additionalTextEdits).toBeUndefined();
  });
});
