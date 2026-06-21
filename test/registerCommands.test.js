const mockRegisterCommand = jest.fn(() => ({ dispose: jest.fn() }));
const mockPush = jest.fn();

jest.mock('vscode', () => ({
  commands: {
    registerCommand: (...args) => mockRegisterCommand(...args),
  },
}));

// Mock the command registry: commandA/commandB have handlers, commandC does not.
jest.mock('../src/commandRegistry', () => ({
  commandRegistry: {
    commandA: jest.fn(),
    commandB: jest.fn(),
  },
}));

// Mock commandsList to use simple known values (commandC has no registry handler)
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

  test('registers commands that have a handler in the registry', () => {
    const ctx = { subscriptions: { push: mockPush } };

    registerCommands(ctx);

    // commandA and commandB have registry handlers → should register
    expect(mockRegisterCommand).toHaveBeenCalledTimes(REGISTERED_COMMAND_COUNT);
    expect(mockRegisterCommand).toHaveBeenCalledWith('autoit.commandA', expect.any(Function));
    expect(mockRegisterCommand).toHaveBeenCalledWith('autoit.commandB', expect.any(Function));
  });

  test('skips commands with no registry handler', () => {
    const ctx = { subscriptions: { push: mockPush } };

    registerCommands(ctx);

    // commandC has no registry handler, so it should not be registered
    const registeredNames = mockRegisterCommand.mock.calls.map(([name]) => name);
    expect(registeredNames).not.toContain('autoit.commandC');
  });

  test('pushes disposables to context subscriptions', () => {
    const ctx = { subscriptions: { push: mockPush } };

    registerCommands(ctx);

    expect(mockPush).toHaveBeenCalledTimes(REGISTERED_COMMAND_COUNT);
  });
});
