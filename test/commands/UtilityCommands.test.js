const mockShowErrorMessage = jest.fn();
const mockShowInformationMessage = jest.fn();
const mockShowTextDocument = jest.fn();
const mockShowInputBox = jest.fn();

const mockWindow = {
  activeTextEditor: null,
  showErrorMessage: (...args) => mockShowErrorMessage(...args),
  showInformationMessage: (...args) => mockShowInformationMessage(...args),
  showInputBox: (...args) => mockShowInputBox(...args),
  showTextDocument: (...args) => mockShowTextDocument(...args),
  visibleTextEditors: [],
};

const mockExistsSync = jest.fn(() => false);
const mockFindFilepath = jest.fn(() => false);
const mockSetRegExpFlags = jest.fn((regex, flags) => new RegExp(regex.source, flags));
const mockReplace = jest.fn();
const mockConfigUpdate = jest.fn(() => Promise.resolve());

jest.mock('vscode', () => ({
  window: mockWindow,
  Position: class Position {
    constructor(line, character) {
      this.line = line;
      this.character = character;
    }
  },
  Uri: {
    file: p => ({ fsPath: p, toString: () => p }),
  },
}));

jest.mock('fs', () => ({
  existsSync: (...args) => mockExistsSync(...args),
}));

jest.mock('../../src/ai_showMessage', () => ({
  showErrorMessage: (...args) => mockShowErrorMessage(...args),
}));

jest.mock('../../src/util', () => ({
  findFilepath: (...args) => mockFindFilepath(...args),
  functionDefinitionRegex: /^\s*(Func)\s+([^\s(]+)\s*\(([^)]*)\)/i,
  setRegExpFlags: (...args) => mockSetRegExpFlags(...args),
}));

jest.mock('../../src/commands/ScriptCommands.js', () => ({
  globalOutputChannel: {
    replace: (...args) => mockReplace(...args),
  },
}));

jest.mock('../../src/ai_config', () => ({
  __esModule: true,
  default: {
    config: {
      UDFCreator: 'Unit Test',
      consoleParams: '',
      outputMaxHistoryLines: 2,
      update: (...args) => mockConfigUpdate(...args),
    },
  },
}));

describe('UtilityCommands', () => {
  let utility;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockSetRegExpFlags.mockImplementation((regex, flags) => new RegExp(regex.source, flags));
    mockWindow.activeTextEditor = null;
    mockWindow.visibleTextEditors = [];
    mockShowInputBox.mockResolvedValue(undefined);
    mockExistsSync.mockReturnValue(false);
    mockFindFilepath.mockReturnValue(false);
    utility = require('../../src/commands/UtilityCommands.js');
  });

  test('getActiveDocumentFileName returns empty string when no active editor', () => {
    expect(utility.getActiveDocumentFileName()).toBe('');
  });

  test('getActiveDocumentFileName returns current file name', () => {
    mockWindow.activeTextEditor = {
      document: { fileName: 'C:\\workspace\\script.au3' },
    };

    expect(utility.getActiveDocumentFileName()).toBe('C:\\workspace\\script.au3');
  });

  test('getTime returns a non-empty string', () => {
    const result = utility.getTime();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('changeParams returns early when user cancels input', async () => {
    mockShowInputBox.mockResolvedValue(undefined);

    await utility.changeParams();

    expect(mockConfigUpdate).not.toHaveBeenCalled();
    expect(mockShowInformationMessage).not.toHaveBeenCalled();
  });

  test('changeParams updates config and shows message', async () => {
    mockShowInputBox.mockResolvedValue(' --flag ');

    await utility.changeParams();

    expect(mockConfigUpdate).toHaveBeenCalledWith('consoleParams', '--flag', false);
    expect(mockShowInformationMessage).toHaveBeenCalledWith('Current console parameter(s): --flag');
  });

  test('openInclude shows error when no active editor', () => {
    utility.openInclude();
    expect(mockShowErrorMessage).toHaveBeenCalledWith('No active editor.');
  });

  test('openInclude shows warning when not on include line', () => {
    mockWindow.activeTextEditor = {
      document: {
        fileName: 'C:\\workspace\\script.au3',
        lineAt: jest.fn(() => ({ text: 'Local $x = 1' })),
      },
      selection: { active: { line: 0 } },
    };

    utility.openInclude();

    expect(mockShowErrorMessage).toHaveBeenCalledWith('Not on #include line.');
  });

  test('openInclude opens file when include path exists', () => {
    mockExistsSync.mockReturnValue(true);
    mockWindow.activeTextEditor = {
      document: {
        fileName: 'C:\\workspace\\script.au3',
        lineAt: jest.fn(() => ({ text: '#include "lib.au3"' })),
      },
      selection: { active: { line: 0 } },
    };

    utility.openInclude();

    expect(mockShowTextDocument).toHaveBeenCalledTimes(1);
  });

  test('insertHeader shows error when no active editor', () => {
    utility.insertHeader();
    expect(mockShowErrorMessage).toHaveBeenCalledWith('No active editor.');
  });

  test('insertHeader inserts generated header when on function definition', () => {
    const insert = jest.fn();
    mockWindow.activeTextEditor = {
      document: {
        lineAt: jest.fn(() => ({ text: 'Func Example($a, ByRef $b = 2)' })),
      },
      edit: jest.fn(cb => {
        cb({ insert });
        return true;
      }),
      selection: { active: { line: 0 } },
    };

    utility.insertHeader();

    expect(insert).toHaveBeenCalledTimes(1);
    const [, headerText] = insert.mock.calls[0];
    expect(headerText).toContain('; Name ..........: Example');
    expect(headerText).toContain('; Author ........: Unit Test');
  });

  test('trimOutputLines truncates output when visible output exceeds configured history', () => {
    const pkg = require('../../package.json');
    const outputPrefix = `extension-output-${pkg.publisher}.${pkg.name}-#`;

    mockWindow.visibleTextEditors = [
      {
        document: {
          fileName: `${outputPrefix}1-AutoIt`,
          getText: jest.fn(() => 'line1\nline2\nline3'),
          lineCount: 3,
        },
      },
    ];

    utility.trimOutputLines();

    expect(mockReplace).toHaveBeenCalledWith('line2\r\nline3');
  });
});
