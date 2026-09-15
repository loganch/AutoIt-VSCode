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

jest.mock('../../src/utils/fsCache', () => ({
  getIncludeText: (...args) => mockGetIncludeText(...args),
  safeFileExists: (...args) => mockExistsSync(...args),
}));

jest.mock('../../src/config/ai_config', () => ({
  __esModule: true,
  default: {
    config: mockConfig,
    findFilePath: (...args) => mockFindFilepath(...args),
  },
}));

jest.mock('../../src/commands/scriptCommands.js', () => ({
  globalOutputChannel: {},
}));

jest.mock('../../src/services/process/ProcessRunner', () =>
  jest.fn().mockImplementation(() => ({
    run: jest.fn(),
  })),
);

jest.mock('../../src/services/process/ProcessManager', () =>
  jest.fn().mockImplementation(() => ({})),
);
jest.mock('../../src/services/OutputChannelManager', () => {
  const MockOutputChannelManager = jest.fn().mockImplementation(() => ({}));
  MockOutputChannelManager.createGlobalOutputChannel = jest.fn(() => ({
    append: jest.fn(),
    appendLine: jest.fn(),
    clear: jest.fn(),
    dispose: jest.fn(),
    hide: jest.fn(),
    show: jest.fn(),
  }));
  return MockOutputChannelManager;
});
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

    ({ launchHelp } = require('../../src/commands/toolCommands'));
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

  test('shows an error and does not spawn when the help executable is missing', () => {
    mockExistsSync.mockReturnValue(false);

    launchHelp();

    expect(mockWindow.showErrorMessage).toHaveBeenCalledWith(
      `AutoIt help file not found: ${mockConfig.helpPath}`,
    );
    expect(mockSpawn).not.toHaveBeenCalled();
  });
});

describe('ToolCommands.launchInfo', () => {
  let launchInfo;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    mockExistsSync.mockReturnValue(true);

    ({ launchInfo } = require('../../src/commands/toolCommands'));
  });

  test('spawns the info tool when the executable exists', () => {
    launchInfo();

    expect(mockSpawn).toHaveBeenCalledWith(mockConfig.infoPath, [], { detached: true });
  });

  test('shows an error and does not spawn when the info executable is missing', () => {
    mockExistsSync.mockReturnValue(false);

    launchInfo();

    expect(mockWindow.showErrorMessage).toHaveBeenCalledWith(
      `AutoIt Window Info tool not found: ${mockConfig.infoPath}`,
    );
    expect(mockSpawn).not.toHaveBeenCalled();
  });
});

describe('ToolCommands.launchKoda', () => {
  let launchKoda;
  const mockRun = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    mockExistsSync.mockReturnValue(true);

    // resetMocks wipes the class-mock implementations; reinstall for the stack factory
    const ProcessRunner = require('../../src/services/process/ProcessRunner');
    const ProcessManager = require('../../src/services/process/ProcessManager');
    const OutputChannelManager = require('../../src/services/OutputChannelManager');
    const HotkeyManager = require('../../src/services/HotkeyManager');
    ProcessRunner.mockImplementation(() => ({ run: (...args) => mockRun(...args) }));
    ProcessManager.mockImplementation(() => ({}));
    OutputChannelManager.mockImplementation(() => ({}));
    OutputChannelManager.createGlobalOutputChannel.mockImplementation(() => ({
      append: jest.fn(),
      appendLine: jest.fn(),
      clear: jest.fn(),
      dispose: jest.fn(),
      hide: jest.fn(),
      show: jest.fn(),
    }));
    HotkeyManager.mockImplementation(() => ({}));

    ({ launchKoda } = require('../../src/commands/toolCommands'));
  });

  test('runs Koda when the executable exists', () => {
    launchKoda();

    expect(mockRun).toHaveBeenCalledWith(mockConfig.kodaPath, []);
  });

  test('shows an error and does not run when the Koda executable is missing', () => {
    mockExistsSync.mockReturnValue(false);

    launchKoda();

    expect(mockWindow.showErrorMessage).toHaveBeenCalledWith(
      `Koda Form Designer not found: ${mockConfig.kodaPath}`,
    );
    expect(mockRun).not.toHaveBeenCalled();
  });
});
