jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

jest.mock('iconv-lite', () => ({
  decode: jest.fn((data, enc) => `decoded:${enc}:${data.toString()}`),
}));

jest.mock('../../src/utils/pathValidation', () => ({
  validateFilePath: jest.fn(() => ({ valid: true })),
  validateExecutablePath: jest.fn(() => ({ valid: true })),
}));

const { spawn } = require('child_process');
const { decode } = require('iconv-lite');
const { validateFilePath, validateExecutablePath } = require('../../src/utils/pathValidation');
const ProcessRunner = require('../../src/services/ProcessRunner');

function createChannel() {
  return {
    append: jest.fn(),
    appendLine: jest.fn(),
    clear: jest.fn(),
    show: jest.fn(),
    flush: jest.fn(),
  };
}

describe('ProcessRunner', () => {
  let config;
  let processManager;
  let outputChannelManager;
  let hotkeyManager;
  let getActiveDocumentFileName;
  let globalOutputChannel;
  let runner;

  beforeEach(() => {
    spawn.mockReset();
    decode.mockReset();
    validateFilePath.mockReset();
    validateExecutablePath.mockReset();

    decode.mockImplementation((data, enc) => `decoded:${enc}:${data.toString()}`);
    validateFilePath.mockImplementation(() => ({ valid: true }));
    validateExecutablePath.mockImplementation(() => ({ valid: true }));

    config = {
      multiOutput: false,
      clearOutput: true,
      outputCodePage: null,
    };
    processManager = {
      id: 0,
      lastId: 0,
      runners: new Map(),
      findRunner: jest.fn(() => null),
      addRunner: jest.fn(),
      cleanup: jest.fn(),
    };
    outputChannelManager = {
      createProxyOutputChannel: jest.fn(() => createChannel()),
      constructor: {
        createProcessOutputChannel: jest.fn(() => createChannel()),
      },
    };
    hotkeyManager = {
      disable: jest.fn(() => Promise.resolve(undefined)),
      reset: jest.fn(() => Promise.resolve(undefined)),
    };
    getActiveDocumentFileName = jest.fn(() => 'C:\\scripts\\demo.au3');
    globalOutputChannel = createChannel();
    runner = new ProcessRunner(
      config,
      processManager,
      outputChannelManager,
      hotkeyManager,
      getActiveDocumentFileName,
      globalOutputChannel,
    );
  });

  it('creates a void output channel', () => {
    const voidChannel = runner._createVoidOutputChannel();
    expect(voidChannel.void).toBe(true);
    expect(typeof voidChannel.append).toBe('function');
  });

  it('formats exit messages with normal, warning, and error prefixes', () => {
    const info = { startTime: 1000, endTime: 3000 };

    expect(runner._formatExitMessage(1, '', info)).toContain('->Exit code 1');
    expect(runner._formatExitMessage(0, '', info)).toContain('>Exit code 0');
    expect(runner._formatExitMessage(2, 'bad', info)).toContain('!>Exit code 2 (bad)');
  });

  it('clears global output when multiOutput is disabled and clearOutput is enabled', () => {
    runner._clearOutputIfNeeded(createChannel());
    expect(globalOutputChannel.clear).toHaveBeenCalled();
  });

  it('shows global output channel when multiOutput is disabled', () => {
    const processChannel = createChannel();
    runner._showOutputChannel(processChannel);
    expect(globalOutputChannel.show).toHaveBeenCalledWith(true);
  });

  it('writes the startup command line with quoted leading input args', () => {
    const channel = createChannel();
    runner._displayProcessCommand(
      channel,
      1,
      'C:\\AutoIt\\AutoIt3.exe',
      ['script.au3', '/in', 'input file.txt'],
      999,
    );
    expect(channel.appendLine).toHaveBeenCalledWith(
      expect.stringContaining(
        '"C:\\AutoIt\\AutoIt3.exe" "script.au3" /in "input file.txt" [PID 999]',
      ),
    );
  });

  it('registers new runners through the process manager', () => {
    const child = { pid: 99 };
    const info = { id: 1 };
    runner._registerRunner(child, null, info);
    expect(processManager.addRunner).toHaveBeenCalledWith(child, info);
  });

  it('reuses previous runner entries when provided', () => {
    const prevRunner = { pid: 1 };
    const nextRunner = { pid: 2 };
    const prevInfo = { id: 7 };
    processManager.runners.set(prevRunner, prevInfo);

    runner._registerRunner(nextRunner, { runner: prevRunner, info: prevInfo }, { id: 8 });

    expect(processManager.runners.get(nextRunner)).toBe(prevInfo);
    expect(processManager.runners.has(prevRunner)).toBe(false);
  });

  it('pipes stdout and stderr through append using configured code page decoding', () => {
    const stdoutHandlers = {};
    const stderrHandlers = {};
    const child = {
      stdout: {
        on: jest.fn((event, cb) => {
          stdoutHandlers[event] = cb;
        }),
      },
      stderr: {
        on: jest.fn((event, cb) => {
          stderrHandlers[event] = cb;
        }),
      },
    };
    const channel = createChannel();
    runner.config.outputCodePage = 'cp1252';

    runner._setupOutputHandlers(child, channel);
    stdoutHandlers.data(Buffer.from('hello'));
    stderrHandlers.data(Buffer.from('oops'));

    expect(decode).toHaveBeenCalled();
    expect(channel.append).toHaveBeenCalledWith('decoded:cp1252:hello');
    expect(channel.append).toHaveBeenCalledWith('decoded:cp1252:oops');
  });

  it('run validates paths, disables hotkeys, spawns the process, and registers it', async () => {
    const stdoutHandlers = {};
    const stderrHandlers = {};
    const exitHandlers = {};
    const child = {
      pid: 123,
      stdout: {
        on: jest.fn((event, cb) => {
          stdoutHandlers[event] = cb;
        }),
      },
      stderr: {
        on: jest.fn((event, cb) => {
          stderrHandlers[event] = cb;
        }),
      },
      on: jest.fn((event, cb) => {
        exitHandlers[event] = cb;
      }),
    };
    spawn.mockReturnValue(child);

    const result = await runner.run('C:\\AutoIt\\AutoIt3.exe', ['script.au3']);

    expect(validateFilePath).toHaveBeenCalledWith('C:\\scripts\\demo.au3');
    expect(validateExecutablePath).toHaveBeenCalledWith('C:\\AutoIt\\AutoIt3.exe');
    expect(hotkeyManager.disable).toHaveBeenCalled();
    expect(spawn).toHaveBeenCalledWith('C:\\AutoIt\\AutoIt3.exe', ['script.au3'], {
      cwd: 'C:\\scripts',
    });
    expect(processManager.addRunner).toHaveBeenCalled();
    expect(result).toBe(child);
    expect(typeof exitHandlers.exit).toBe('function');
  });
});
