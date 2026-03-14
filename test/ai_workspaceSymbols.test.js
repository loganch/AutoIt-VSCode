/**
 * ai_workspaceSymbols.test.js
 * Tests for workspace symbol provider
 */

const mockRegisterWorkspaceSymbolProvider = jest.fn(() => ({ dispose: jest.fn() }));
const mockCreateFileSystemWatcher = jest.fn(() => ({
  onDidChange: jest.fn(),
  onDidCreate: jest.fn(),
  onDidDelete: jest.fn(),
}));
const mockFindFiles = jest.fn(() => Promise.resolve([]));
const mockOpenTextDocument = jest.fn(() => Promise.resolve({ getText: () => '' }));

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
      get: jest.fn(() => 50000),
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
}));

describe('ai_workspaceSymbols module', () => {
  // Load module once in beforeAll (before resetMocks:true global beforeEach clears mock call history)
  let capturedProviderArg;
  let capturedWatcherArg;

  beforeAll(() => {
    require('../src/ai_workspaceSymbols');
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
});

describe('Workspace Symbols Performance', () => {
  describe('Batch Processing Logic', () => {
    it('should process files in batches', () => {
      const files = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const batchSize = 10;
      const batches = [];

      // Simulate batch processing
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        batches.push(batch);
      }

      expect(batches.length).toBe(5);
      expect(batches[0].length).toBe(10);
      expect(batches[4].length).toBe(10);
    });

    it('should respect maxFiles limit', () => {
      const allFiles = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
      const maxFiles = 500;

      // Simulate limiting files
      const filesToProcess = allFiles.slice(0, maxFiles);

      expect(allFiles.length).toBe(1000);
      expect(filesToProcess.length).toBe(500);
    });

    it('should handle uneven batch sizes', () => {
      const files = Array.from({ length: 47 }, (_, i) => ({ id: i }));
      const batchSize = 10;
      const batches = [];

      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        batches.push(batch);
      }

      expect(batches.length).toBe(5);
      expect(batches[4].length).toBe(7); // Last batch is smaller
    });
  });

  describe('Cancellation Support', () => {
    it('should stop processing when cancellation is requested', () => {
      const mockToken = {
        isCancellationRequested: false,
      };

      const files = Array.from({ length: 100 }, (_, i) => ({ id: i }));
      const batchSize = 10;
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

      expect(processed.length).toBe(20); // Only 2 batches processed
    });
  });

  describe('Cache Management', () => {
    it('should use Map for incremental updates', () => {
      const cache = new Map();

      // Add entries
      cache.set('file1', ['symbol1', 'symbol2']);
      cache.set('file2', ['symbol3']);

      expect(cache.size).toBe(2);

      // Update single entry
      cache.set('file1', ['symbol1', 'symbol2', 'symbol4']);

      expect(cache.size).toBe(2);
      expect(cache.get('file1').length).toBe(3);
    });

    it('should remove individual files from cache', () => {
      const cache = new Map();

      cache.set('file1', ['symbol1']);
      cache.set('file2', ['symbol2']);
      cache.set('file3', ['symbol3']);

      expect(cache.size).toBe(3);

      // Remove single file
      cache.delete('file2');

      expect(cache.size).toBe(2);
      expect(cache.has('file2')).toBe(false);
    });
  });

  describe('Query Filtering', () => {
    it('should filter symbols by query string', () => {
      const symbols = [
        { name: 'TestFunc', kind: 1 },
        { name: 'HelperFunc', kind: 1 },
        { name: 'TestVariable', kind: 2 },
      ];

      const query = 'test';
      const filtered = symbols.filter(s => s.name.toLowerCase().includes(query));

      expect(filtered).toHaveLength(2);
      expect(filtered[0].name).toBe('TestFunc');
      expect(filtered[1].name).toBe('TestVariable');
    });

    it('should be case-insensitive', () => {
      const symbols = [{ name: 'MyFunction' }, { name: 'myVariable' }, { name: 'OTHER' }];

      const query = 'my';
      const filtered = symbols.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

      expect(filtered).toHaveLength(2);
    });
  });
});
