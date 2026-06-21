/**
 * Integration tests for the diagnostics version-cache in src/extension.js.
 *
 * These drive activate() through file-local vscode mocks so we can capture the
 * real onDidChangeActiveTextEditor / onDidChangeConfiguration handlers and assert
 * that Au3Check:
 *   - is NOT re-run on a tab switch when the document version is unchanged, but
 *   - IS re-run when diagnostics-relevant config changes (includePaths, checkPath,
 *     enableDiagnostics) even though the document version is unchanged.
 *
 * The second case guards the regression where caching purely by document.version
 * left stale Problems output after a settings change.
 */

// Captured event handlers registered during activate(). Prefixed `mock` so jest's
// babel plugin allows referencing it from the hoisted jest.mock factory below.
const mockHandlers = {};

const INITIAL_DOC_VERSION = 1;
const UPDATED_DOC_VERSION = 2;
const SINGLE_RUN_COUNT = 1;
const DOUBLE_RUN_COUNT = 2;

// Mutable config object returned via the mocked ai_config module.
const mockConfig = {
  enableDiagnostics: true,
  checkPath: 'C:/fake/au3check.exe',
  includePaths: [],
};

jest.mock('vscode', () => {
  const register = name => fn => {
    // onDidSave/Open/Close are registered twice (tracking + diagnostics); the
    // diagnostics registration runs later in activate() and wins, which is what
    // these tests exercise.
    mockHandlers[name] = fn;
    return { dispose: () => {} };
  };
  return {
    __esModule: true,
    Uri: { file: p => ({ fsPath: p, toString: () => p }) },
    // extension.js imports services/symbolIndex (and its split-out modules) at
    // module load time, which read SymbolKind off this mock eagerly.
    SymbolKind: { Function: 11, Namespace: 2, Constant: 13, Enum: 9, Variable: 12, Key: 19 },
    languages: {
      setLanguageConfiguration: () => ({ dispose: () => {} }),
      createDiagnosticCollection: () => ({
        clear: () => {},
        delete: () => {},
        set: () => {},
        dispose: () => {},
      }),
    },
    window: {
      showErrorMessage: () => {},
      activeTextEditor: undefined,
      onDidChangeActiveTextEditor: register('activeEditor'),
    },
    workspace: {
      workspaceFolders: [{ uri: { fsPath: 'C:/ws' } }],
      textDocuments: [],
      getConfiguration: () => ({ get: (key, fallback) => fallback }),
      onDidOpenTextDocument: register('open'),
      onDidChangeTextDocument: register('change'),
      onDidSaveTextDocument: register('save'),
      onDidCloseTextDocument: register('close'),
      onDidChangeConfiguration: register('config'),
    },
  };
});

jest.mock('../src/providers/ai_config', () => ({
  __esModule: true,
  default: { config: mockConfig, aiPath: '', wrapperPath: '', data: {}, init: () => {} },
}));

const stubService = {
  __esModule: true,
  default: {
    getInstance: () => ({
      updateFile: () => {},
      updateFileImmediate: () => {},
      updateFileDebounced: () => {},
      updateConfiguration: () => {},
    }),
  },
};
jest.mock('../src/services/MapTrackingService.js', () => stubService);
jest.mock('../src/services/VariableTrackingService.js', () => stubService);

// Feature providers are irrelevant here; stub them to keep activate() cheap.
const stubFeature = { __esModule: true, default: { dispose: () => {} } };
jest.mock('../src/languageConfiguration', () => stubFeature);
jest.mock('../src/providers/ai_hover', () => stubFeature);
jest.mock('../src/providers/ai_completion', () => stubFeature);
jest.mock('../src/providers/ai_symbols', () => stubFeature);
jest.mock('../src/providers/ai_workspaceSymbols', () => stubFeature);
jest.mock('../src/providers/ai_definition', () => stubFeature);
jest.mock('../src/providers/ai_references', () => stubFeature);
jest.mock('../src/providers/ai_signature', () => ({
  __esModule: true,
  default: { dispose: () => {} },
  signatureHoverProvider: { dispose: () => {} },
}));
jest.mock('../src/providers/ai_formatter', () => ({
  __esModule: true,
  formatterProvider: { dispose: () => {} },
}));
jest.mock('../src/registerCommands', () => ({
  __esModule: true,
  registerCommands: () => {},
}));
jest.mock('../src/diagnosticUtils', () => ({
  __esModule: true,
  parseAu3CheckOutput: () => {},
  clearDiagnosticsOwnedBy: () => {},
}));

jest.mock('child_process', () => ({ execFile: jest.fn() }));
jest.mock('fs', () => ({ existsSync: jest.fn() }));

// A fake child process whose Au3Check run resolves on the next tick with no output.
const makeChild = () => ({
  stdout: { on: () => {} },
  stderr: { on: () => {} },
  on: (event, cb) => {
    if (event === 'close') setImmediate(() => cb(0));
  },
});

const flush = () => new Promise(resolve => setImmediate(resolve));

const makeDoc = version => ({
  languageId: 'autoit',
  version,
  fileName: 'C:/ws/test.au3',
  uri: { fsPath: 'C:/ws/test.au3', toString: () => 'file:///C:/ws/test.au3' },
  getText: () => '',
});

const switchToEditor = async doc => {
  // The active-editor handler doesn't return the (async) check promise, so flush
  // afterwards to let the process close and the version cache settle.
  mockHandlers.activeEditor({ document: doc });
  await flush();
};

describe('extension diagnostics version cache', () => {
  let execFile;

  beforeEach(() => {
    // resetMocks (jest config) wipes implementations between tests; rebuild them.
    jest.resetModules();
    Object.keys(mockHandlers).forEach(key => delete mockHandlers[key]);
    mockConfig.enableDiagnostics = true;
    mockConfig.includePaths = [];

    ({ execFile } = require('child_process'));
    execFile.mockImplementation(() => makeChild());
    require('fs').existsSync.mockReturnValue(true);

    const { activate } = require('../src/extension');
    activate({ subscriptions: [] });
  });

  test('skips Au3Check on tab switch when document version is unchanged', async () => {
    const doc = makeDoc(INITIAL_DOC_VERSION);

    await switchToEditor(doc);
    expect(execFile).toHaveBeenCalledTimes(SINGLE_RUN_COUNT);

    // Same document, same version, switched back to — should hit the cache.
    await switchToEditor(doc);
    expect(execFile).toHaveBeenCalledTimes(SINGLE_RUN_COUNT);
  });

  test('re-runs Au3Check when a new document version is seen', async () => {
    await switchToEditor(makeDoc(INITIAL_DOC_VERSION));
    expect(execFile).toHaveBeenCalledTimes(SINGLE_RUN_COUNT);

    // Edited document (version bumped) — cache miss, must re-run.
    await switchToEditor(makeDoc(UPDATED_DOC_VERSION));
    expect(execFile).toHaveBeenCalledTimes(DOUBLE_RUN_COUNT);
  });

  test('includePaths change invalidates cache and re-runs for an unchanged version', async () => {
    const doc = makeDoc(INITIAL_DOC_VERSION);

    await switchToEditor(doc);
    expect(execFile).toHaveBeenCalledTimes(SINGLE_RUN_COUNT);

    // Unrelated config change must NOT invalidate the cache.
    mockHandlers.config({ affectsConfiguration: () => false });
    await switchToEditor(doc);
    expect(execFile).toHaveBeenCalledTimes(SINGLE_RUN_COUNT);

    // includePaths feeds Au3Check (-I args), so its change must force a re-run
    // even though document.version is unchanged.
    mockHandlers.config({ affectsConfiguration: key => key === 'autoit.includePaths' });
    await switchToEditor(doc);
    expect(execFile).toHaveBeenCalledTimes(DOUBLE_RUN_COUNT);
  });

  test('checkPath change invalidates cache and re-runs for an unchanged version', async () => {
    const doc = makeDoc(INITIAL_DOC_VERSION);

    await switchToEditor(doc);
    expect(execFile).toHaveBeenCalledTimes(SINGLE_RUN_COUNT);

    mockHandlers.config({ affectsConfiguration: key => key === 'autoit.checkPath' });
    await switchToEditor(doc);
    expect(execFile).toHaveBeenCalledTimes(DOUBLE_RUN_COUNT);
  });

  test('enableDiagnostics change invalidates cache and re-runs for an unchanged version', async () => {
    const doc = makeDoc(INITIAL_DOC_VERSION);

    await switchToEditor(doc);
    expect(execFile).toHaveBeenCalledTimes(SINGLE_RUN_COUNT);

    mockHandlers.config({ affectsConfiguration: key => key === 'autoit.enableDiagnostics' });
    await switchToEditor(doc);
    expect(execFile).toHaveBeenCalledTimes(DOUBLE_RUN_COUNT);
  });
});
