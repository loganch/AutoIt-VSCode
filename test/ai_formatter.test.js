const mockShowErrorMessage = jest.fn();
const mockRegisterDocumentFormattingEditProvider = jest.fn(() => ({ dispose: jest.fn() }));
const mockSpawn = jest.fn();
const mockFsExistsSync = jest.fn();

jest.mock('child_process', () => ({
  spawn: (...args) => mockSpawn(...args),
}));

jest.mock('fs/promises', () => ({
  access: jest.fn(),
  mkdir: jest.fn(),
  unlink: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: (...args) => mockFsExistsSync(...args),
}));

jest.mock('../src/ai_config', () => ({
  __esModule: true,
  default: {
    config: {
      aiPath: 'C:\\AutoIt3\\AutoIt3.exe',
      wrapperPath: 'C:\\AutoIt3\\AutoIt3Wrapper.au3',
    },
  },
}));

jest.mock('vscode', () => ({
  Position: class Position {
    constructor(line, character) {
      this.line = line;
      this.character = character;
    }
  },
  Range: class Range {
    constructor(start, end) {
      this.start = start;
      this.end = end;
    }
  },
  TextEdit: {
    replace: jest.fn((range, text) => ({ range, newText: text })),
  },
  Uri: {
    file: p => ({ fsPath: p }),
  },
  languages: {
    registerDocumentFormattingEditProvider: (...args) =>
      mockRegisterDocumentFormattingEditProvider(...args),
  },
  window: {
    showErrorMessage: (...args) => mockShowErrorMessage(...args),
  },
  workspace: {
    workspaceFolders: [{ uri: { fsPath: 'C:\\workspace' } }],
    fs: {
      writeFile: jest.fn(),
      readFile: jest.fn(),
      stat: jest.fn(),
    },
  },
}));

// Load module and capture provider reference in beforeAll so we capture the call
// before resetMocks:true clears mock history before each test.
let formatterModule;
let provider;

beforeAll(() => {
  formatterModule = require('../src/ai_formatter');
  // Capture before the global resetMocks:true runs (it runs before each test, not before beforeAll)
  provider = mockRegisterDocumentFormattingEditProvider.mock.calls[0]?.[1] ?? null;
});

describe('ai_formatter module', () => {
  test('exports formatterProvider', () => {
    expect(formatterModule.formatterProvider).toBeDefined();
  });

  test('registered document formatting provider for autoit language', () => {
    expect(formatterModule.formatterProvider).toBeTruthy();
  });

  describe('provideDocumentFormattingEdits', () => {
    test('provider object captured correctly', () => {
      expect(provider).not.toBeNull();
      expect(typeof provider.provideDocumentFormattingEdits).toBe('function');
    });

    test('returns [] when no document provided', async () => {
      const vscode = require('vscode');
      vscode.workspace.workspaceFolders = [{ uri: { fsPath: 'C:\\workspace' } }];

      const result = await provider.provideDocumentFormattingEdits(null);
      expect(result).toEqual([]);
      expect(mockShowErrorMessage).toHaveBeenCalledWith('No document provided for formatting');
    });

    test('returns [] when document text is empty', async () => {
      const vscode = require('vscode');
      vscode.workspace.workspaceFolders = [{ uri: { fsPath: 'C:\\workspace' } }];

      const emptyDoc = { getText: () => '' };
      const result = await provider.provideDocumentFormattingEdits(emptyDoc);
      expect(result).toEqual([]);
      expect(mockShowErrorMessage).toHaveBeenCalledWith('Document is empty or invalid');
    });

    test('returns [] when document has no getText method', async () => {
      const vscode = require('vscode');
      vscode.workspace.workspaceFolders = [{ uri: { fsPath: 'C:\\workspace' } }];

      const badDoc = {};
      const result = await provider.provideDocumentFormattingEdits(badDoc);
      expect(result).toEqual([]);
    });

    test('returns [] when workspace folders not available', async () => {
      const vscode = require('vscode');
      vscode.workspace.workspaceFolders = undefined;

      const doc = { getText: () => 'MsgBox(0, "test", "hello")' };
      const result = await provider.provideDocumentFormattingEdits(doc);

      expect(result).toEqual([]);
      expect(mockShowErrorMessage).toHaveBeenCalledWith('No workspace folder open');
    });
  });
});
