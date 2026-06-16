/**
 * ai_workspaceSymbols.debounce.test.js
 * Tests for the search debounce / promise lifecycle of provideWorkspaceSymbols:
 *  - a superseded search must resolve (not hang) so VS Code stops awaiting it
 *  - a warm cache must answer immediately instead of waiting the full debounce
 */

const mockRegisterWorkspaceSymbolProvider = jest.fn(() => ({ dispose: jest.fn() }));
const mockCreateFileSystemWatcher = jest.fn(() => ({
  onDidChange: jest.fn(),
  onDidCreate: jest.fn(),
  onDidDelete: jest.fn(),
}));
const mockFindFiles = jest.fn(() => Promise.resolve([]));
const mockOpenTextDocument = jest.fn(() => Promise.resolve({ getText: () => '' }));
const mockProvideDocumentSymbols = jest.fn(() => Promise.resolve([]));

jest.mock('vscode', () => ({
  Location: class Location {
    constructor(uri, range) {
      this.uri = uri;
      this.range = range;
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
  SymbolKind: { Function: 11, Variable: 12, Key: 19 },
  Uri: { file: p => ({ fsPath: p, toString: () => `file://${p}` }) },
  languages: {
    registerWorkspaceSymbolProvider: (...args) => mockRegisterWorkspaceSymbolProvider(...args),
  },
  window: { showWarningMessage: jest.fn(), showErrorMessage: jest.fn() },
  workspace: {
    getConfiguration: jest.fn(() => ({ get: (key, def) => def })),
    findFiles: (...args) => mockFindFiles(...args),
    openTextDocument: (...args) => mockOpenTextDocument(...args),
    createFileSystemWatcher: (...args) => mockCreateFileSystemWatcher(...args),
  },
}));

jest.mock('../src/ai_symbols', () => ({
  __esModule: true,
  default: { dispose: jest.fn() },
  provideDocumentSymbols: (...args) => mockProvideDocumentSymbols(...args),
}));

// symbolIndex (imported transitively via ai_workspaceSymbols) imports getIncludePath
// from util; mock it so the real util -> ai_config side-effect chain never loads.
jest.mock('../src/util', () => ({
  getIncludePath: jest.fn(() => ''),
  // symbolIndex.indexDocument tags variable symbols via this helper.
  isVariableDeclarationLine: () => false,
}));

/**
 * Load a fresh copy of the module so each test starts with an empty cache and a
 * fresh debounce timer, returning the registered provider and the file-watcher
 * handlers registered during module load.
 */
function loadProvider() {
  jest.isolateModules(() => {
    require('../src/ai_workspaceSymbols');
  });

  const providerCalls = mockRegisterWorkspaceSymbolProvider.mock.calls;
  const provider = providerCalls[providerCalls.length - 1][0];

  const watcherResults = mockCreateFileSystemWatcher.mock.results;
  const watcher = watcherResults[watcherResults.length - 1].value;

  return {
    provider,
    onCreate: watcher.onDidCreate.mock.calls[0][0],
  };
}

/** Populate the module cache directly via the file-watcher create handler. */
async function warmCache(onCreate, symbols) {
  // indexDocument requires a document.uri, so the opened doc must carry one.
  mockOpenTextDocument.mockResolvedValueOnce({
    uri: { toString: () => 'file:///test.au3', fsPath: '/test.au3' },
    getText: () => '',
  });
  mockProvideDocumentSymbols.mockResolvedValueOnce(symbols);
  await onCreate({ toString: () => 'file:///test.au3' });
}

describe('provideWorkspaceSymbols debounce lifecycle', () => {
  // resetMocks:true wipes implementations before each test; restore them here.
  beforeEach(() => {
    mockRegisterWorkspaceSymbolProvider.mockImplementation(() => ({ dispose: jest.fn() }));
    mockCreateFileSystemWatcher.mockImplementation(() => ({
      onDidChange: jest.fn(),
      onDidCreate: jest.fn(),
      onDidDelete: jest.fn(),
    }));
    mockFindFiles.mockImplementation(() => Promise.resolve([]));
    mockOpenTextDocument.mockImplementation(() => Promise.resolve({ getText: () => '' }));
    mockProvideDocumentSymbols.mockImplementation(() => Promise.resolve([]));
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('resolves the superseded search promise with [] when a newer search arrives', async () => {
    const { provider } = loadProvider();
    const token = { isCancellationRequested: false };

    const first = provider.provideWorkspaceSymbols('alpha', token);
    // A newer search arrives before the first one's debounce fires.
    provider.provideWorkspaceSymbols('beta', token);

    // The first promise must resolve (with no results) rather than hang forever.
    // With real timers this returns immediately on the fix; the bug leaves it pending.
    await expect(first).resolves.toEqual([]);
  });

  test('returns cached results without waiting for the debounce when the cache is warm', async () => {
    const { provider, onCreate } = loadProvider();
    await warmCache(onCreate, [{ name: 'TestFunc' }]);

    // Switch to fake timers AFTER warming so the only thing that could delay the
    // result is the debounce timer. If the warm-cache path still debounced, this
    // promise would stay pending because we never advance the timer.
    jest.useFakeTimers();
    const result = provider.provideWorkspaceSymbols('test', { isCancellationRequested: false });

    await expect(result).resolves.toEqual([{ name: 'TestFunc' }]);
  });

  test('returns [] immediately when the cache is warm but the request is cancelled', async () => {
    const { provider, onCreate } = loadProvider();
    await warmCache(onCreate, [{ name: 'TestFunc' }]);

    jest.useFakeTimers();
    const result = provider.provideWorkspaceSymbols('test', { isCancellationRequested: true });

    await expect(result).resolves.toEqual([]);
  });

  test('builds the cache after the debounce when the cache is cold', async () => {
    const { provider } = loadProvider();
    const token = { isCancellationRequested: false };

    mockFindFiles.mockResolvedValueOnce([{ toString: () => 'file:///a.au3' }]);
    mockOpenTextDocument.mockResolvedValueOnce({
      uri: { toString: () => 'file:///a.au3', fsPath: '/a.au3' },
      getText: () => '',
    });
    mockProvideDocumentSymbols.mockResolvedValueOnce([{ name: 'Foo' }]);

    // Real timers: the debounce elapses for real (300 ms) and the cache builds.
    const pending = provider.provideWorkspaceSymbols('foo', token);

    await expect(pending).resolves.toEqual([{ name: 'Foo' }]);
  });
});
