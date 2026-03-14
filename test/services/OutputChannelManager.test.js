jest.mock('vscode', () => ({
  window: {
    createOutputChannel: jest.fn(),
  },
}));

jest.mock('../../src/command_constants', () => ({
  HOTKEY_LINE_DELAY_MS: 100,
  NO_BREAK_SPACE: '\u00a0',
}));

const OutputChannelManager = require('../../src/services/OutputChannelManager');

function makeChannel(overrides = {}) {
  return {
    append: jest.fn(),
    appendLine: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    clear: jest.fn(),
    dispose: jest.fn(),
    ...overrides,
  };
}

describe('OutputChannelManager', () => {
  let globalChannel;
  let config;
  let hotkeyManager;
  let runners;

  beforeEach(() => {
    const { window } = require('vscode');
    window.createOutputChannel.mockImplementation(name => makeChannel({ name }));

    globalChannel = makeChannel();
    config = {
      outputShowTime: 'None',
      multiOutputShowProcessId: 'None',
      multiOutputFinishedTimeout: 5,
      multiOutputMaxFinished: 3,
    };
    hotkeyManager = { reset: jest.fn() };
    runners = { isNewLine: true, lastId: 0 };
  });

  it('throws when globalOutputChannel is missing', () => {
    expect(() => new OutputChannelManager(null, config, {}, hotkeyManager, runners)).toThrow(
      /globalOutputChannel is required/,
    );
  });

  it('throws when globalOutputChannel lacks required methods', () => {
    expect(
      () => new OutputChannelManager({ append: jest.fn() }, config, {}, hotkeyManager, runners),
    ).toThrow(/must have method/);
  });

  it('throws when config is missing', () => {
    expect(() => new OutputChannelManager(globalChannel, null, {}, hotkeyManager, runners)).toThrow(
      /config parameter is required/,
    );
  });

  it('creates an instance with valid dependencies', () => {
    const manager = new OutputChannelManager(globalChannel, config, {}, hotkeyManager, runners);
    expect(manager).toBeInstanceOf(OutputChannelManager);
    expect(manager.globalOutputChannel).toBe(globalChannel);
    expect(manager.config).toBe(config);
    expect(manager.strategies.global).toBeDefined();
    expect(manager.strategies.process).toBeDefined();
    expect(manager.strategies.multi).toBeDefined();
  });

  it('creates and caches global output channels', () => {
    const { window } = require('vscode');

    const first = OutputChannelManager.createGlobalOutputChannel('AutoIt Test', 'autoit');
    const second = OutputChannelManager.createGlobalOutputChannel('AutoIt Test', 'autoit');

    expect(window.createOutputChannel).toHaveBeenCalledTimes(1);
    expect(first).toBe(second);
  });

  it('creates process output channels with id in the name', () => {
    const { window } = require('vscode');

    OutputChannelManager.createProcessOutputChannel(1234, 'demo.au3', 'autoit');

    expect(window.createOutputChannel).toHaveBeenCalledWith('AutoIt #1234 (demo.au3)', 'autoit');
  });

  it('creates a proxy output channel with callable methods', () => {
    const manager = new OutputChannelManager(globalChannel, config, {}, hotkeyManager, runners);
    const processChannel = makeChannel({ name: 'proc1' });

    const proxy = manager.createProxyOutputChannel({
      id: 1,
      aiOutProcess: processChannel,
    });

    expect(typeof proxy.append).toBe('function');
    expect(typeof proxy.appendLine).toBe('function');
    expect(typeof proxy.flush).toBe('function');
  });

  it('generates a hotkey replacement message from configured keybindings', () => {
    const manager = new OutputChannelManager(
      globalChannel,
      config,
      {
        'extension.restartScript': 'Ctrl+R',
        'extension.killScript': 'Ctrl+K',
      },
      hotkeyManager,
      runners,
    );

    const message = manager.generateHotkeyReplacementMessage();

    expect(message).toContain('Ctrl+R');
    expect(message).toContain('Ctrl+K');
    expect(message).toContain('Restart');
    expect(message).toContain('Stop');
  });
});
