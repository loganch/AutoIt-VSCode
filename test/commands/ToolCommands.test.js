const mockWindow = {
  activeTextEditor: null,
  setStatusBarMessage: jest.fn(),
  showErrorMessage: jest.fn(),
};

const mockSpawn = jest.fn();
const mockExistsSync = jest.fn();
const mockFindFilepath = jest.fn();
const mockGetIncludeText = jest.fn();

const mockConfig = {
  helpPath: 'C:\\AutoIt\\AutoIt3Help.exe',
  infoPath: 'C:\\AutoIt\\Au3Info.exe',
  kodaPath: 'C:\\AutoIt\\Koda.exe',
  aiPath: 'C:\\AutoIt\\AutoIt3.exe',
  wrapperPath: 'C:\\AutoIt\\AutoIt3Wrapper.au3',
  smartHelp: {
    _ABC_: {
      chmPath: 'C:\\AutoIt\\AutoIt.chm',
      udfPath: ['C:\\AutoIt\\Include\\Abc.au3'],
    },
  },
};

const STATUS_MSG_TIMEOUT_MS = 1500;

jest.mock('vscode', () => ({
  window: mockWindow,
}));

jest.mock('child_process', () => ({
  spawn: (...args) => mockSpawn(...args),
}));

jest.mock('fs', () => ({
  existsSync: (...args) => mockExistsSync(...args),
}));

jest.mock('../../src/util', () => ({
  findFilepath: (...args) => mockFindFilepath(...args),
  getIncludeText: (...args) => mockGetIncludeText(...args),
}));

jest.mock('../../src/ai_config', () => ({
  __esModule: true,
  default: {
    config: mockConfig,
  },
}));

jest.mock('../../src/commands/ScriptCommands.js', () => ({
  globalOutputChannel: {},
}));

jest.mock('../../src/services/ProcessRunner', () =>
  jest.fn().mockImplementation(() => ({
    run: jest.fn(),
  })),
);

jest.mock('../../src/services/ProcessManager', () => jest.fn().mockImplementation(() => ({})));
jest.mock('../../src/services/OutputChannelManager', () =>
  jest.fn().mockImplementation(() => ({})),
);
jest.mock('../../src/services/HotkeyManager', () => jest.fn().mockImplementation(() => ({})));

describe('ToolCommands.launchHelp', () => {
  let launchHelp;

  const setActiveEditorQuery = query => {
    const wordRange = { start: 0, end: 0 };
    mockWindow.activeTextEditor = {
      selection: {
        start: { line: 0, character: 0 },
        active: { line: 0, character: 0 },
      },
      document: {
        getWordRangeAtPosition: jest.fn(() => wordRange),
        getText: jest.fn(() => query),
      },
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    mockExistsSync.mockReturnValue(true);
    mockFindFilepath.mockReturnValue('');
    mockGetIncludeText.mockReturnValue('; no matching function declaration');

    ({ launchHelp } = require('../../src/commands/ToolCommands'));
  });

  test('does not throw for malformed query with unmatched parenthesis in smart-help path', () => {
    const malformedQuery = '_ABC_) -1))';
    setActiveEditorQuery(malformedQuery);

    expect(() => launchHelp()).not.toThrow();

    expect(mockWindow.setStatusBarMessage).toHaveBeenCalledWith(
      `Searching documentation for ${malformedQuery}`,
      STATUS_MSG_TIMEOUT_MS,
    );

    expect(mockGetIncludeText).toHaveBeenCalledWith('C:\\AutoIt\\Include\\Abc.au3');
    expect(mockSpawn).toHaveBeenCalledWith(mockConfig.helpPath, [malformedQuery], {
      detached: true,
    });
  });

  test('opens smart-help CHM entry when function is found in configured UDFs', () => {
    const query = '_ABC_Func';
    setActiveEditorQuery(query);
    mockGetIncludeText.mockReturnValue('Func _ABC_Func($x)\nEndFunc');

    launchHelp();

    expect(mockSpawn).toHaveBeenCalledWith(
      'hh',
      ['mk:@MSITStore:C:\\AutoIt\\AutoIt.chm::/funcs/_ABC_Func.htm'],
      { detached: true },
    );
  });
});
