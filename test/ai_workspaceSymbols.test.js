/**
 * ai_workspaceSymbols.test.js
 * Tests for workspace symbol provider
 */

// Named constants for magic numbers in tests
const SYMBOL_MAX_LINES = 50000;
const TOTAL_FILES_COUNT = 1000;
const MAX_FILES_LIMIT = 500;
const BATCH_SIZE_TEN = 10;
const FILES_UNEVEN_COUNT = 47;
const BATCHES_EXPECTED_COUNT = 5;
const LAST_BATCH_UNEVEN_SIZE = 7;
const LARGE_FILES_COUNT = 100;
const PROCESSED_COUNT_TWO_BATCHES = 20;
const MAP_INITIAL_SIZE = 2;
const MAP_UPDATED_SIZE = 2;
const MAP_ENTRY_UPDATE_COUNT = 3;
const CACHE_INITIAL_COUNT = 2;
const CACHE_SIZE_THREE = 3;
const SYMBOLS_QUERY_COUNT = 2;
const FILES_COUNT_SIMPLE = 50;
const BATCHES_EXPECTED_SIMPLE = 5;

const mockRegisterWorkspaceSymbolProvider = jest.fn(() => ({ dispose: jest.fn() }));
const mockCreateFileSystemWatcher = jest.fn(() => ({
  onDidChange: jest.fn(),
  onDidCreate: jest.fn(),
  onDidDelete: jest.fn(),
}));
const mockFindFiles = jest.fn(() => Promise.resolve([]));
const mockOpenTextDocument = jest.fn(() => Promise.resolve({ getText: () => '' }));
// provideDocumentSymbols now lives in ai_symbols and is invoked by the service's
// indexDocument (which the provider delegates to), so the mock must intercept there.
const mockProvideDocumentSymbols = jest.fn(() => Promise.resolve([]));

jest.mock('vscode', () => ({
  DocumentSymbol: class DocumentSymbol {
    constructor(name, detail, kind, range) {
      this.name = name;
      this.detail = detail;
      this.kind = kind;
      this.range = range;
      this.children = [];
    }
  },
  Location: class Location {
    constructor(uri, range) {
      this.uri = uri;
      this.range = range;
    }
  },
  Range: class Range {
    constructor(start, end) {
      this.start = start;
      this.end = end;
    }
  },
  Position: class Position {
    constructor(line, character) {
      this.line = line;
      this.character = character;
    }
  },
  SymbolInformation: class SymbolInformation {
    constructor(name, kind, containerName, location) {
      this.name = name;
      this.kind = kind;
      this.containerName = containerName;
      this.location = location;
    }
  },
  SymbolKind: {
    Function: 11,
    Variable: 12,
    Key: 19,
  },
  Uri: { file: p => ({ fsPath: p, toString: () => `file://${p}` }) },
  languages: {
    registerDocumentSymbolProvider: jest.fn(() => ({ dispose: jest.fn() })),
    registerWorkspaceSymbolProvider: (...args) => mockRegisterWorkspaceSymbolProvider(...args),
  },
  window: {
    showWarningMessage: jest.fn(),
    showErrorMessage: jest.fn(),
  },
  workspace: {
    getConfiguration: jest.fn(() => ({
      get: jest.fn(() => SYMBOL_MAX_LINES),
    })),
    findFiles: (...args) => mockFindFiles(...args),
    openTextDocument: (...args) => mockOpenTextDocument(...args),
    createFileSystemWatcher: (...args) => mockCreateFileSystemWatcher(...args),
    onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
  },
}));

jest.mock('../src/services/MapTrackingService.js', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn(() => ({
      getMap: jest.fn(),
      clear: jest.fn(),
    })),
    resetInstance: jest.fn(),
  },
}));

jest.mock('../src/constants', () => ({
  DEFAULT_MAX_INCLUDE_DEPTH: 3,
  AUTOIT_MODE: { language: 'autoit' },
}));

jest.mock('../src/util', () => ({
  AI_CONSTANTS: {},
  AUTOIT_MODE: { language: 'autoit' },
  functionPattern: /func/i,
  isSkippableLine: jest.fn(() => false),
  regionPattern: /#region/i,
  variablePattern: /\$\w+/g,
  getIncludePath: jest.fn(() => ''),
  // symbolIndex.indexDocument tags variable symbols via this helper.
  isVariableDeclarationLine: () => false,
}));

// The provider delegates per-file indexing to symbolIndex.indexDocument, which
// pulls provideDocumentSymbols from ai_symbols. Mock it here so the indexer sees
// the mock and the heavy real ai_symbols module never loads.
jest.mock('../src/providers/ai_symbols', () => ({
  __esModule: true,
  default: { dispose: jest.fn() },
  provideDocumentSymbols: (...args) => mockProvideDocumentSymbols(...args),
}));

describe('ai_workspaceSymbols module', () => {
  // Load module once in beforeAll (before resetMocks:true global beforeEach clears mock call history)
  let capturedProviderArg;
  let capturedWatcherArg;

  beforeAll(() => {
    require('../src/providers/ai_workspaceSymbols');
    // Capture before resetMocks resets these
    capturedProviderArg =
      mockRegisterWorkspaceSymbolProvider.mock.calls.length > 0
        ? mockRegisterWorkspaceSymbolProvider.mock.calls[0][0]
        : null;
    capturedWatcherArg =
      mockCreateFileSystemWatcher.mock.calls.length > 0
        ? mockCreateFileSystemWatcher.mock.calls[0][0]
        : null;
  });

  test('registers a workspace symbol provider on module load', () => {
    expect(capturedProviderArg).not.toBeNull();
    expect(capturedProviderArg).toEqual(
      expect.objectContaining({ provideWorkspaceSymbols: expect.any(Function) }),
    );
  });

  test('creates a file system watcher on module load', () => {
    expect(capturedWatcherArg).toBe('**/*.{au3,a3x}');
  });

  test('a workspace build populates the shared symbolIndex cache', async () => {
    // eslint-disable-next-line global-require
    const { workspace } = require('vscode');
    // eslint-disable-next-line global-require
    const symbolIndex = require('../src/services/symbolIndex');
    symbolIndex.__resetForTests();

    // resetMocks wipes the getConfiguration implementation each test; restore a
    // config that returns sane batch/maxFiles defaults so the build can run.
    workspace.getConfiguration.mockReturnValue({ get: (_key, def) => def ?? SYMBOL_MAX_LINES });
    mockFindFiles.mockResolvedValue([{ toString: () => 'file:///shared.au3' }]);
    mockOpenTextDocument.mockResolvedValue({
      uri: { toString: () => 'file:///shared.au3', fsPath: '/shared.au3' },
      getText: () => '',
    });
    mockProvideDocumentSymbols.mockResolvedValue([{ name: 'SharedFunc' }]);

    // Cold cache: provideWorkspaceSymbols debounces (300ms real) then builds.
    await capturedProviderArg.provideWorkspaceSymbols('', { isCancellationRequested: false });

    expect(symbolIndex.symbolsCache.size).toBeGreaterThan(0);
    const allNames = [...symbolIndex.symbolsCache.values()].flat().map(s => s.name);
    expect(allNames).toContain('SharedFunc');
  });
});

describe('Workspace Symbols Performance', () => {
  describe('Batch Processing Logic', () => {
    it('should process files in batches', () => {
      const files = Array.from({ length: FILES_COUNT_SIMPLE }, (_, i) => ({ id: i }));
      const batchSize = BATCH_SIZE_TEN;
      const batches = [];

      // Simulate batch processing
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        batches.push(batch);
      }

      expect(batches.length).toBe(BATCHES_EXPECTED_SIMPLE);
      expect(batches[0].length).toBe(BATCH_SIZE_TEN);
      expect(batches[BATCHES_EXPECTED_SIMPLE - 1].length).toBe(BATCH_SIZE_TEN);
    });

    it('should respect maxFiles limit', () => {
      const allFiles = Array.from({ length: TOTAL_FILES_COUNT }, (_, i) => ({ id: i }));
      const maxFiles = MAX_FILES_LIMIT;

      // Simulate limiting files
      const filesToProcess = allFiles.slice(0, maxFiles);

      expect(allFiles.length).toBe(TOTAL_FILES_COUNT);
      expect(filesToProcess.length).toBe(MAX_FILES_LIMIT);
    });

    it('should handle uneven batch sizes', () => {
      const files = Array.from({ length: FILES_UNEVEN_COUNT }, (_, i) => ({ id: i }));
      const batchSize = BATCH_SIZE_TEN;
      const batches = [];

      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        batches.push(batch);
      }

      expect(batches.length).toBe(BATCHES_EXPECTED_COUNT);
      expect(batches[BATCHES_EXPECTED_COUNT - 1].length).toBe(LAST_BATCH_UNEVEN_SIZE); // Last batch is smaller
    });
  });

  describe('Cancellation Support', () => {
    it('should stop processing when cancellation is requested', () => {
      const mockToken = {
        isCancellationRequested: false,
      };

      const files = Array.from({ length: LARGE_FILES_COUNT }, (_, i) => ({ id: i }));
      const batchSize = BATCH_SIZE_TEN;
      const processed = [];

      // Simulate cancellation after 2 batches
      for (let i = 0; i < files.length; i += batchSize) {
        if (mockToken.isCancellationRequested) {
          break;
        }

        const batch = files.slice(i, i + batchSize);
        processed.push(...batch);

        // Cancel after 2 batches
        if (i >= batchSize) {
          mockToken.isCancellationRequested = true;
        }
      }

      expect(processed.length).toBe(PROCESSED_COUNT_TWO_BATCHES); // Only 2 batches processed
    });
  });

  describe('Cache Management', () => {
    it('should use Map for incremental updates', () => {
      const cache = new Map();

      // Add entries
      cache.set('file1', ['symbol1', 'symbol2']);
      cache.set('file2', ['symbol3']);

      expect(cache.size).toBe(MAP_INITIAL_SIZE);

      // Update single entry
      cache.set('file1', ['symbol1', 'symbol2', 'symbol4']);

      expect(cache.size).toBe(MAP_UPDATED_SIZE);
      expect(cache.get('file1').length).toBe(MAP_ENTRY_UPDATE_COUNT);
    });

    it('should remove individual files from cache', () => {
      const cache = new Map();

      cache.set('file1', ['symbol1']);
      cache.set('file2', ['symbol2']);
      cache.set('file3', ['symbol3']);

      expect(cache.size).toBe(CACHE_SIZE_THREE);

      // Remove single file
      cache.delete('file2');

      expect(cache.size).toBe(CACHE_INITIAL_COUNT);
      expect(cache.has('file2')).toBe(false);
    });
  });

  describe('Query Filtering', () => {
    it('should filter symbols by query string', () => {
      const symbols = [
        { name: 'TestFunc', kind: 1 },
        { name: 'HelperFunc', kind: 1 },
        { name: 'TestVariable', kind: SYMBOLS_QUERY_COUNT },
      ];

      const query = 'test';
      const filtered = symbols.filter(s => s.name.toLowerCase().includes(query));

      expect(filtered).toHaveLength(SYMBOLS_QUERY_COUNT);
      expect(filtered[0].name).toBe('TestFunc');
      expect(filtered[1].name).toBe('TestVariable');
    });

    it('should be case-insensitive', () => {
      const symbols = [{ name: 'MyFunction' }, { name: 'myVariable' }, { name: 'OTHER' }];

      const query = 'my';
      const filtered = symbols.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

      expect(filtered).toHaveLength(SYMBOLS_QUERY_COUNT);
    });
  });
});
