const mockRegisterCommand = jest.fn(() => ({ dispose: jest.fn() }));
const mockPush = jest.fn();

jest.mock('vscode', () => ({
  commands: {
    registerCommand: (...args) => mockRegisterCommand(...args),
  },
}));

// Mock all ai_commands exports so registerCommands can map them
jest.mock('../src/ai_commands', () => ({
  commandA: jest.fn(),
  commandB: jest.fn(),
}));

// Mock commandsList to use simple known values
jest.mock('../src/commandsList', () => ({
  commandsList: ['commandA', 'commandB', 'commandC'],
  commandsPrefix: 'autoit.',
}));

const { registerCommands } = require('../src/registerCommands');

const REGISTERED_COMMAND_COUNT = 2;

describe('registerCommands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registers commands that exist in ai_commands', () => {
    const ctx = { subscriptions: { push: mockPush } };

    registerCommands(ctx);

    // commandA and commandB exist in ai_commands mock → should register
    expect(mockRegisterCommand).toHaveBeenCalledTimes(REGISTERED_COMMAND_COUNT);
    expect(mockRegisterCommand).toHaveBeenCalledWith('autoit.commandA', expect.any(Function));
    expect(mockRegisterCommand).toHaveBeenCalledWith('autoit.commandB', expect.any(Function));
  });

  test('skips commands not present in ai_commands', () => {
    const ctx = { subscriptions: { push: mockPush } };

    registerCommands(ctx);

    // commandC is not in the ai_commands mock, so it should not be registered
    const registeredNames = mockRegisterCommand.mock.calls.map(([name]) => name);
    expect(registeredNames).not.toContain('autoit.commandC');
  });

  test('pushes disposables to context subscriptions', () => {
    const ctx = { subscriptions: { push: mockPush } };

    registerCommands(ctx);

    expect(mockPush).toHaveBeenCalledTimes(REGISTERED_COMMAND_COUNT);
  });
});
