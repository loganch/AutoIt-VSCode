const mockWindow = {
  onDidChangeVisibleTextEditors: jest.fn(),
};

const mockKillScript = jest.fn(arg => `killed:${arg}`);
const mockUtilityGetActiveDocumentFileName = jest.fn(() => 'C:\\workspace\\active.au3');

jest.mock('vscode', () => ({
  window: mockWindow,
}));

jest.mock('../src/config/ai_config', () => ({
  __esModule: true,
  default: {
    config: {
      aiPath: 'C:\\AutoIt\\AutoIt3.exe',
    },
    addListener: jest.fn(),
  },
}));

jest.mock('../src/commands/scriptCommands', () => ({
  runScript: jest.fn(),
  killScript: (...args) => mockKillScript(...args),
  restartScript: jest.fn(),
}));

jest.mock('../src/commands/toolCommands', () => ({
  build: jest.fn(),
  check: jest.fn(),
  compile: jest.fn(),
  launchHelp: jest.fn(),
  launchInfo: jest.fn(),
  launchKoda: jest.fn(),
  tidy: jest.fn(),
}));

jest.mock('../src/commands/debugCommands', () => ({
  debugConsole: jest.fn(),
  debugMsgBox: jest.fn(),
  debugRemove: jest.fn(),
  traceRemove: jest.fn(),
}));

jest.mock('../src/commands/utilityCommands', () => ({
  changeParams: jest.fn(),
  getActiveDocumentFileName: (...args) => mockUtilityGetActiveDocumentFileName(...args),
  insertHeader: jest.fn(),
  openInclude: jest.fn(),
}));

jest.mock('../src/commands/functionTraceAdd.js', () => ({
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
    aiCommands = require('../src/providers/ai_commands');
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
