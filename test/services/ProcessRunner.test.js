const { EventEmitter } = require('events');

jest.mock('../../src/utils/pathValidation', () => ({
  validateFilePath: () => ({ valid: true }),
  validateExecutablePath: () => ({ valid: true }),
}));

jest.mock('child_process', () => ({ spawn: jest.fn() }));

const { spawn } = require('child_process');
const ProcessRunner = require('../../src/services/ProcessRunner').default;

function makeRunner() {
  const hotkeyManager = { disable: jest.fn(), reset: jest.fn() };
  const processManager = {
    id: 0,
    findRunner: () => false,
    addRunner: jest.fn(),
    runners: new Map(),
    cleanup: jest.fn(),
  };
  const appendLineCalls = [];
  const outputChannelManager = {
    createProcessOutputChannel: () => ({ clear: jest.fn(), show: jest.fn() }),
    createProxyOutputChannel: () => ({
      appendLine: text => appendLineCalls.push(text),
      append: () => {},
      flush: () => {},
    }),
  };
  const runner = new ProcessRunner({
    config: { multiOutput: false, clearOutput: false, outputCodePage: null },
    processManager,
    outputChannelManager,
    hotkeyManager,
    getActiveDocumentFileName: () => 'C:\\scripts\\test.au3',
    globalOutputChannel: { clear: jest.fn(), show: jest.fn() },
  });
  return { runner, hotkeyManager, appendLineCalls };
}

describe('ProcessRunner spawn error handling', () => {
  it('routes an asynchronous spawn error through the same exit/cleanup path as a normal exit', async () => {
    const fakeChild = new EventEmitter();
    fakeChild.pid = 1234;
    fakeChild.stdout = new EventEmitter();
    fakeChild.stderr = new EventEmitter();
    spawn.mockImplementation(() => fakeChild);

    const { runner, hotkeyManager, appendLineCalls } = makeRunner();

    await runner.run('C:\\AutoIt3.exe', ['/in', 'test.au3']);

    fakeChild.emit('error', new Error('spawn ENOENT'));
    // _handleProcessExit is async (awaits hotkeyManager.reset) — flush microtasks
    await Promise.resolve();
    await Promise.resolve();

    expect(hotkeyManager.reset).toHaveBeenCalledWith(expect.any(Number));
    expect(appendLineCalls.some(line => line.includes('spawn ENOENT'))).toBe(true);
  });
});
