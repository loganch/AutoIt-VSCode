jest.mock('vscode', () => ({
  window: {
    createOutputChannel: jest.fn(),
  },
}));

jest.mock('../../src/commandTimings', () => ({
  HOTKEY_LINE_DELAY_MS: 100,
  NO_BREAK_SPACE: '\u00a0',
}));

const OutputChannelManager = require('../../src/services/OutputChannelManager').default;

const PROCESS_OUTPUT_CHANNEL_ID = 1234;

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

    const manager = new OutputChannelManager(
      {
        append: jest.fn(),
        appendLine: jest.fn(),
        show: jest.fn(),
        hide: jest.fn(),
        clear: jest.fn(),
        dispose: jest.fn(),
      },
      {},
    );

    manager.createProcessOutputChannel(PROCESS_OUTPUT_CHANNEL_ID, 'demo.au3', 'autoit');

    expect(window.createOutputChannel).toHaveBeenCalledWith(
      `AutoIt #${PROCESS_OUTPUT_CHANNEL_ID} (demo.au3)`,
      'autoit',
    );
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

  it('collapses a hotkey-failure line run into a single replacement message once', () => {
    // Plain functions (not jest.fn()) — the OutputChannelManager proxy checks
    // `instanceof Function` on the wrapped channel methods, which jest.fn()
    // mocks fail across Jest's sandbox realm.
    const processAppendCalls = [];
    const processChannel = { ...makeChannel(), append: text => processAppendCalls.push(text) };
    const globalAppendCalls = [];
    const globalPlainChannel = { ...globalChannel, append: text => globalAppendCalls.push(text) };

    const manager = new OutputChannelManager(
      globalPlainChannel,
      config,
      { 'extension.restartScript': 'Ctrl+R' },
      hotkeyManager,
      runners,
    );

    const proxy = manager.createProxyOutputChannel({ id: 1, aiOutProcess: processChannel });

    proxy.append(
      '!>Failed Setting Hotkey(s)...\r\n--> SetHotKey () Restart failed, SetHotKey () Stop failed.\r\n',
    );

    expect(hotkeyManager.reset).toHaveBeenCalledTimes(1);
    const written = globalAppendCalls.join('');
    expect(written).toContain('Ctrl+R');
    expect(written).not.toContain('SetHotKey');

    // A second failure block later in the run is left untouched — the
    // wrapper only reports this once per launch.
    globalAppendCalls.length = 0;
    hotkeyManager.reset.mockClear();
    proxy.append('!>Failed Setting Hotkey(s)...\r\n');
    expect(hotkeyManager.reset).not.toHaveBeenCalled();
    expect(globalAppendCalls.join('')).toContain('!>Failed Setting Hotkey(s)...');
  });
});
