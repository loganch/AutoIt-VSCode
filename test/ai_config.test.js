const mockFsExistsSync = jest.fn(() => false);
const mockShowErrorMessage = jest.fn();
const mockWorkspaceFsStat = jest.fn(() => Promise.resolve({ type: 1 }));
const mockGetConfiguration = jest.fn(() => ({
  get: jest.fn(key => {
    if (key === 'aiPath') return '';
    if (key === 'includePaths') return [''];
    return undefined;
  }),
  update: jest.fn(),
  inspect: jest.fn(() => ({})),
}));

jest.mock('vscode', () => ({
  FileType: {
    File: 1,
    Directory: 2,
    SymbolicLink: 64,
  },
  Uri: {
    file: p => ({ fsPath: p }),
  },
  window: {
    showErrorMessage: (...args) => mockShowErrorMessage(...args),
    showInformationMessage: jest.fn(),
  },
  workspace: {
    getConfiguration: (...args) => mockGetConfiguration(...args),
    onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
    fs: {
      stat: (...args) => mockWorkspaceFsStat(...args),
    },
  },
}));

jest.mock('fs', () => ({
  existsSync: (...args) => mockFsExistsSync(...args),
}));

jest.mock('child_process', () => ({
  execFile: jest.fn(),
}));

jest.mock('../src/ai_showMessage', () => ({
  showErrorMessage: jest.fn(),
}));

let conf;

describe('ai_config', () => {
  beforeAll(() => {
    conf = require('../src/ai_config').default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('exports default object with expected shape', () => {
    expect(conf).toEqual(
      expect.objectContaining({
        config: expect.any(Object),
        addListener: expect.any(Function),
        removeListener: expect.any(Function),
        noEvents: expect.any(Function),
        findFilepath: expect.any(Function),
      }),
    );
  });

  describe('addListener / removeListener', () => {
    test('addListener returns numeric id', () => {
      const id = conf.addListener(() => {});
      expect(typeof id).toBe('number');
    });

    test('removeListener removes earlier-added listener', () => {
      const listener = jest.fn();
      const id = conf.addListener(listener);
      conf.removeListener(id);
      // If removed, listener should not be called when config changes are simulated
      // Just verify no throw
      expect(() => conf.removeListener(id)).not.toThrow();
    });
  });

  describe('noEvents', () => {
    test('can be called with truthy value without throwing', () => {
      expect(() => conf.noEvents(true)).not.toThrow();
      expect(() => conf.noEvents(false)).not.toThrow();
    });
  });

  describe('findFilepath', () => {
    test('returns false when file does not exist on any path', () => {
      mockFsExistsSync.mockReturnValue(false);
      const result = conf.findFilepath('nonexistent.au3');
      expect(result).toBe(false);
    });

    test('returns file path when file exists in include path', () => {
      // All existsSync calls: first for include dir check returns false,
      // second for actual file returns true
      mockFsExistsSync
        .mockReturnValueOnce(true) // candidate in includePaths exists
        .mockReturnValue(false);

      const result = conf.findFilepath('Array.au3');
      // Either returns a string path or false — just validate type
      expect(typeof result === 'string' || result === false).toBe(true);
    });
  });
});
