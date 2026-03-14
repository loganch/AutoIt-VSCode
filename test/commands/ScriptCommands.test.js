const STATUS_BAR_MESSAGE_TIMEOUT = 1500;

const mockWindow = {
  activeTextEditor: null,
  setStatusBarMessage: jest.fn(),
};

const mockShowErrorMessage = jest.fn();
const mockShowInformationMessage = jest.fn();
const mockShowWarningMessage = jest.fn();
const mockValidateFilePath = jest.fn(() => ({ valid: true }));
const mockValidateParameterString = jest.fn(() => ({
  hasWarnings: false,
  sanitized: [],
  warnings: [],
}));
const mockRun = jest.fn();
const mockFindRunner = jest.fn();

const mockGlobalOutputChannel = {
  append: jest.fn(),
  appendLine: jest.fn(),
  clear: jest.fn(),
  dispose: jest.fn(),
  hide: jest.fn(),
  name: 'AutoIt (global)',
  show: jest.fn(),
};

const processManagerInstance = {
  findRunner: (...args) => mockFindRunner(...args),
  lastRunningOpened: null,
};

const processRunnerInstance = {
  run: (...args) => mockRun(...args),
};

const outputChannelManagerInstance = {
  createProxyOutputChannel: jest.fn(() => mockGlobalOutputChannel),
};

const mockConfig = {
  aiPath: 'C:\\AutoIt\\AutoIt3.exe',
  consoleParams: '',
  multiOutput: true,
  multiOutputReuseOutput: true,
  wrapperPath: 'C:\\AutoIt\\AutoIt3Wrapper.au3',
};

const MockProcessRunner = jest.fn().mockImplementation(() => processRunnerInstance);
const MockProcessManager = jest.fn().mockImplementation(() => processManagerInstance);
const MockHotkeyManager = jest.fn().mockImplementation(() => ({}));
const MockOutputChannelManager = jest.fn().mockImplementation(() => outputChannelManagerInstance);
MockOutputChannelManager.createGlobalOutputChannel = jest.fn(() => mockGlobalOutputChannel);
MockOutputChannelManager.createProcessOutputChannel = jest.fn(() => mockGlobalOutputChannel);

jest.mock('vscode', () => ({
  window: mockWindow,
}));

jest.mock('../../src/services/ProcessRunner', () => MockProcessRunner);
jest.mock('../../src/services/ProcessManager', () => MockProcessManager);
jest.mock('../../src/services/OutputChannelManager', () => MockOutputChannelManager);
jest.mock('../../src/services/HotkeyManager', () => MockHotkeyManager);

jest.mock('../../src/ai_config', () => ({
  __esModule: true,
  default: {
    config: mockConfig,
  },
}));

jest.mock('../../src/ai_showMessage', () => ({
  showErrorMessage: (...args) => mockShowErrorMessage(...args),
  showInformationMessage: (...args) => mockShowInformationMessage(...args),
  showWarningMessage: (...args) => mockShowWarningMessage(...args),
}));

jest.mock('../../src/utils/pathValidation.js', () => ({
  validateFilePath: (...args) => mockValidateFilePath(...args),
}));

jest.mock('../../src/utils/parameterValidation.js', () => ({
  validateParameterString: (...args) => mockValidateParameterString(...args),
}));

describe('ScriptCommands', () => {
  let globalOutputChannel;
  let killScript;
  let restartScript;
  let runScript;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    processManagerInstance.lastRunningOpened = null;
    mockConfig.consoleParams = '';
    mockValidateFilePath.mockReturnValue({ valid: true });
    mockValidateParameterString.mockReturnValue({
      hasWarnings: false,
      sanitized: [],
      warnings: [],
    });
    outputChannelManagerInstance.createProxyOutputChannel.mockImplementation(
      () => mockGlobalOutputChannel,
    );
    MockProcessRunner.mockImplementation(() => processRunnerInstance);
    MockProcessManager.mockImplementation(() => processManagerInstance);
    MockHotkeyManager.mockImplementation(() => ({}));
    MockOutputChannelManager.mockImplementation(() => outputChannelManagerInstance);
    MockOutputChannelManager.createGlobalOutputChannel.mockImplementation(
      () => mockGlobalOutputChannel,
    );
    MockOutputChannelManager.createProcessOutputChannel.mockImplementation(
      () => mockGlobalOutputChannel,
    );

    ({
      globalOutputChannel,
      killScript,
      restartScript,
      runScript,
    } = require('../../src/commands/ScriptCommands.js'));
  });

  test('exports the singleton global output channel', () => {
    expect(globalOutputChannel).toBe(mockGlobalOutputChannel);
    expect(MockOutputChannelManager.createGlobalOutputChannel).toHaveBeenCalledWith(
      'AutoIt (global)',
      'vscode-autoit-output',
    );
  });

  test('runScript prompts the user to save untitled files first', async () => {
    mockWindow.activeTextEditor = {
      document: {
        fileName: 'untitled.au3',
        isUntitled: true,
        save: jest.fn(),
      },
    };

    await runScript();

    expect(mockShowErrorMessage).toHaveBeenCalledWith('"untitled.au3" file must be saved first!');
    expect(mockRun).not.toHaveBeenCalled();
  });

  test('runScript validates parameters and delegates execution to ProcessRunner', async () => {
    const savedDocument = {
      fileName: 'C:\\workspace\\script.au3',
      isUntitled: false,
      save: jest.fn().mockResolvedValue(true),
    };
    mockConfig.consoleParams = '--flag';
    mockValidateParameterString.mockReturnValue({
      hasWarnings: true,
      sanitized: ['--flag', 'value'],
      warnings: ['metacharacters detected'],
    });
    mockWindow.activeTextEditor = { document: savedDocument };

    await runScript();

    expect(mockValidateFilePath).toHaveBeenCalledWith('C:\\workspace\\script.au3');
    expect(mockShowWarningMessage).toHaveBeenCalledWith(
      expect.stringContaining('potentially dangerous characters'),
      { timeout: 15000 },
    );
    expect(mockWindow.setStatusBarMessage).toHaveBeenCalledWith(
      'Running the script...',
      STATUS_BAR_MESSAGE_TIMEOUT,
    );
    expect(mockRun).toHaveBeenCalledWith(
      mockConfig.aiPath,
      [
        mockConfig.wrapperPath,
        '/run',
        '/prod',
        '/ErrorStdOut',
        '/in',
        'C:\\workspace\\script.au3',
        '/UserParams',
        '--flag',
        'value',
      ],
      true,
    );
  });

  test('killScript notifies the user when no script is running', () => {
    mockFindRunner.mockReturnValue(null);

    killScript('C:\\workspace\\script.au3');

    expect(mockShowInformationMessage).toHaveBeenCalledWith(
      'No script (workspace\\script.au3) currently is running.',
      { timeout: 10000 },
    );
  });

  test('restartScript starts the script when nothing is running yet', async () => {
    mockWindow.activeTextEditor = {
      document: {
        fileName: 'C:\\workspace\\script.au3',
        isUntitled: false,
        save: jest.fn().mockResolvedValue(true),
      },
    };

    await restartScript();

    expect(mockRun).toHaveBeenCalledTimes(1);
  });
});
