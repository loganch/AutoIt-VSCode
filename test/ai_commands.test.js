const mockWindow = {
  onDidChangeVisibleTextEditors: jest.fn(),
};

const mockKillScript = jest.fn(arg => `killed:${arg}`);
const mockUtilityGetActiveDocumentFileName = jest.fn(() => 'C:\\workspace\\active.au3');

jest.mock('vscode', () => ({
  window: mockWindow,
}));

jest.mock('../src/ai_config', () => ({
  __esModule: true,
  default: {
    config: {
      aiPath: 'C:\\AutoIt\\AutoIt3.exe',
    },
    addListener: jest.fn(),
  },
}));

jest.mock('../src/commands/ScriptCommands', () => ({
  runScript: jest.fn(),
  killScript: (...args) => mockKillScript(...args),
  restartScript: jest.fn(),
}));

jest.mock('../src/commands/ToolCommands', () => ({
  build: jest.fn(),
  check: jest.fn(),
  compile: jest.fn(),
  launchHelp: jest.fn(),
  launchInfo: jest.fn(),
  launchKoda: jest.fn(),
  tidy: jest.fn(),
}));

jest.mock('../src/commands/DebugCommands', () => ({
  debugConsole: jest.fn(),
  debugMsgBox: jest.fn(),
}));

jest.mock('../src/commands/UtilityCommands', () => ({
  changeParams: jest.fn(),
  getActiveDocumentFileName: (...args) => mockUtilityGetActiveDocumentFileName(...args),
  insertHeader: jest.fn(),
  openInclude: jest.fn(),
}));

jest.mock('../src/commands/debugRemove.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../src/commands/functionTraceAdd.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../src/commands/trace.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('ai_commands', () => {
  let aiCommands;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockKillScript.mockImplementation(arg => `killed:${arg}`);
    mockUtilityGetActiveDocumentFileName.mockImplementation(() => 'C:\\workspace\\active.au3');
    aiCommands = require('../src/ai_commands');
  });

  test('re-exports command handlers from command modules', () => {
    expect(typeof aiCommands.runScript).toBe('function');
    expect(typeof aiCommands.compile).toBe('function');
    expect(typeof aiCommands.debugMsgBox).toBe('function');
    expect(typeof aiCommands.changeParams).toBe('function');
    expect(typeof aiCommands.openInclude).toBe('function');
    expect(typeof aiCommands.insertHeader).toBe('function');
  });

  test('killScriptOpened uses active document path when no argument passed', () => {
    const result = aiCommands.killScriptOpened();

    expect(mockUtilityGetActiveDocumentFileName).toHaveBeenCalledTimes(1);
    expect(mockKillScript).toHaveBeenCalledWith('C:\\workspace\\active.au3');
    expect(result).toBe('killed:C:\\workspace\\active.au3');
  });

  test('killScriptOpened prefers explicit file path argument', () => {
    const explicitPath = 'C:\\workspace\\explicit.au3';
    const result = aiCommands.killScriptOpened(explicitPath);

    expect(mockUtilityGetActiveDocumentFileName).not.toHaveBeenCalled();
    expect(mockKillScript).toHaveBeenCalledWith(explicitPath);
    expect(result).toBe(`killed:${explicitPath}`);
  });

  test('exports facade management and accessor functions', () => {
    expect(typeof aiCommands.initializeCommands).toBe('function');
    expect(typeof aiCommands.disposeCommands).toBe('function');
    expect(typeof aiCommands.getCommandsFacade).toBe('function');
    expect(typeof aiCommands.getProcessManager).toBe('function');
    expect(typeof aiCommands.getKeybindings).toBe('function');

    const facade = aiCommands.getCommandsFacade();
    expect(facade).toEqual(
      expect.objectContaining({
        initialize: expect.any(Function),
        dispose: expect.any(Function),
      }),
    );
  });
});
