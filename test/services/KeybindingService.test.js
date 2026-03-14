const mockReadFile = jest.fn();
const mockCreateFileSystemWatcher = jest.fn(() => ({
  dispose: jest.fn(),
  onDidChange: jest.fn(),
  onDidCreate: jest.fn(),
  onDidDelete: jest.fn(),
}));

const mockPrefsUpdate = jest.fn(() => Promise.resolve());
const mockPrefsInspect = jest.fn(() => ({
  globalValue: '--flag',
  key: 'autoit.consoleParams',
}));

jest.mock('fs', () => ({
  readFile: (...args) => mockReadFile(...args),
}));

jest.mock('vscode', () => ({
  RelativePattern: class RelativePattern {
    constructor(base, pattern) {
      this.base = base;
      this.pattern = pattern;
    }
  },
  workspace: {
    getConfiguration: jest.fn(() => ({
      inspect: (...args) => mockPrefsInspect(...args),
      update: (...args) => mockPrefsUpdate(...args),
    })),
    createFileSystemWatcher: (...args) => mockCreateFileSystemWatcher(...args),
  },
}));

const KeybindingService = require('../../src/services/KeybindingService.js');

describe('KeybindingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.APPDATA = 'C:/Users/Test/AppData/Roaming';
  });

  test('constructor applies defaults', () => {
    const service = new KeybindingService();
    expect(service.commandsList).toEqual([]);
    expect(service.commandsPrefix).toBe('');
    expect(service.keybindingsDefaultRaw).toEqual([]);
    expect(service.isInitialized).toBe(false);
  });

  test('_loadKeybindings merges user overrides and removals', async () => {
    const service = new KeybindingService({
      commandsList: ['run', 'build'],
      commandsPrefix: 'autoit.',
      keybindingsDefaultRaw: [
        { command: 'autoit.run', key: 'ctrl+r' },
        { command: 'autoit.build', key: 'ctrl+b' },
      ],
    });

    mockReadFile.mockImplementation((filePath, cb) => {
      const json = JSON.stringify([
        { command: 'autoit.run', key: 'alt+r' },
        { command: '-autoit.build', key: '' },
      ]);
      cb(null, Buffer.from(json));
    });

    const result = await service._loadKeybindings('C:/fake/keybindings.json');

    expect(result['autoit.run']).toBe('Alt+R');
    expect(result['autoit.build']).toBeUndefined();
  });

  test('_loadKeybindings falls back to defaults on parse error', async () => {
    const service = new KeybindingService({
      commandsList: ['run'],
      commandsPrefix: 'autoit.',
      keybindingsDefaultRaw: [{ command: 'autoit.run', key: 'ctrl+r' }],
    });

    mockReadFile.mockImplementation((filePath, cb) => {
      cb(null, Buffer.from('{invalid json')); // parse error
    });

    const result = await service._loadKeybindings('C:/fake/keybindings.json');
    expect(result['autoit.run']).toBe('Ctrl+R');
  });

  test('getKeybinding and hasKeybinding use initialized map', async () => {
    const service = new KeybindingService();
    service.isInitialized = true;
    service.keybindings = { 'autoit.run': 'Ctrl+R' };

    await expect(service.getKeybinding('autoit.run')).resolves.toBe('Ctrl+R');
    await expect(service.getKeybinding('autoit.missing')).resolves.toBeNull();
    await expect(service.hasKeybinding('autoit.run')).resolves.toBe(true);
    await expect(service.hasKeybinding('autoit.missing')).resolves.toBe(false);
  });

  test('dispose clears watchers and resets initialized flag', () => {
    const settingsWatcher = { dispose: jest.fn() };
    const keybindingsWatcher = { dispose: jest.fn() };

    const service = new KeybindingService();
    service.settingsWatcher = settingsWatcher;
    service.keybindingsWatcher = keybindingsWatcher;
    service.isInitialized = true;

    service.dispose();

    expect(settingsWatcher.dispose).toHaveBeenCalledTimes(1);
    expect(keybindingsWatcher.dispose).toHaveBeenCalledTimes(1);
    expect(service.settingsWatcher).toBeNull();
    expect(service.keybindingsWatcher).toBeNull();
    expect(service.isInitialized).toBe(false);
  });
});
