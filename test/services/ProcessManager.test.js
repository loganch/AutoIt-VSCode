jest.mock('vscode', () => ({
  window: {
    visibleTextEditors: [],
  },
}));

const ProcessManager = require('../../src/services/ProcessManager');

describe('ProcessManager', () => {
  let manager;
  let mockOutputChannel;
  let mockGetActiveFileName;

  beforeEach(() => {
    mockOutputChannel = {
      appendLine: jest.fn(),
      show: jest.fn(),
    };
    mockGetActiveFileName = jest.fn(() => 'C:\\scripts\\active.au3');
    manager = new ProcessManager(
      { multiOutputFinishedTimeout: 5, multiOutputMaxFinished: 3 },
      mockOutputChannel,
      mockGetActiveFileName,
      'TestOutput',
    );
  });

  describe('constructor', () => {
    it('initialises with empty runners map', () => {
      expect(manager.runners.size).toBe(0);
    });

    it('stores config, outputChannel, outputName', () => {
      expect(manager.config.multiOutputFinishedTimeout).toBe(5);
      expect(manager.outputChannel).toBe(mockOutputChannel);
      expect(manager.outputName).toBe('TestOutput');
    });

    it('sets lastId and id to 0', () => {
      expect(manager.lastId).toBe(0);
      expect(manager.id).toBe(0);
    });
  });

  describe('addRunner', () => {
    it('adds a runner and emits runnerAdded', () => {
      const runner = {};
      const info = {
        id: 1,
        thisFile: 'test.au3',
        status: true,
        processCommand: 'autoIt.exe test.au3',
      };
      const listener = jest.fn();
      manager.on('runnerAdded', listener);

      manager.addRunner(runner, info);

      expect(manager.runners.get(runner)).toBe(info);
      expect(listener).toHaveBeenCalledWith({
        id: 1,
        file: 'test.au3',
        command: 'autoIt.exe test.au3',
      });
    });
  });

  describe('getAllRunners', () => {
    it('returns the runners map', () => {
      expect(manager.getAllRunners()).toBe(manager.runners);
    });
  });

  describe('findRunner', () => {
    it('returns null when no runners exist', () => {
      expect(manager.findRunner({ status: true, thisFile: null })).toBeNull();
    });

    it('finds a running runner', () => {
      const runner = {};
      const info = { id: 1, thisFile: 'test.au3', status: true };
      manager.runners.set(runner, info);

      const result = manager.findRunner({ status: true, thisFile: null });
      expect(result).not.toBeNull();
      expect(result.info).toBe(info);
    });

    it('returns null when no runner matches filter', () => {
      const runner = {};
      manager.runners.set(runner, { id: 1, thisFile: 'other.au3', status: true });
      const result = manager.findRunner({ status: true, thisFile: 'different.au3' });
      expect(result).toBeNull();
    });
  });

  describe('lastRunning getter', () => {
    it('returns null when no runners', () => {
      expect(manager.lastRunning).toBeNull();
    });

    it('returns the last running runner', () => {
      const runner = {};
      const info = { id: 1, thisFile: 'test.au3', status: true };
      manager.runners.set(runner, info);
      expect(manager.lastRunning).not.toBeNull();
    });
  });

  describe('lastRunningOpened getter', () => {
    it('returns null when no running runner for active file', () => {
      manager.runners.set({}, { id: 1, thisFile: 'other.au3', status: true });
      expect(manager.lastRunningOpened).toBeNull();
    });

    it('returns runner matching active document', () => {
      const runner = {};
      const info = { id: 1, thisFile: 'C:\\scripts\\active.au3', status: true };
      manager.runners.set(runner, info);
      expect(manager.lastRunningOpened).not.toBeNull();
    });
  });

  describe('updateRunnerStatus', () => {
    it('updates status and emits runnerFinished when set to false', () => {
      const runner = {};
      const info = { id: 1, thisFile: 'test.au3', status: true, exitCode: 0 };
      manager.runners.set(runner, info);

      const listener = jest.fn();
      manager.on('runnerFinished', listener);

      manager.updateRunnerStatus(runner, false);

      expect(info.status).toBe(false);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    it('does nothing for unknown runner', () => {
      expect(() => manager.updateRunnerStatus({}, true)).not.toThrow();
    });
  });

  describe('isAiOutVisible', () => {
    it('returns null when no visible editors', () => {
      const vscode = require('vscode');
      vscode.window.visibleTextEditors = [];
      expect(manager.isAiOutVisible()).toBeNull();
    });

    it('returns null when no editor matches outputName', () => {
      const vscode = require('vscode');
      vscode.window.visibleTextEditors = [{ document: { fileName: 'SomeOtherOutput' } }];
      expect(manager.isAiOutVisible()).toBeNull();
    });

    it('returns id, name and output for matching editor', () => {
      const vscode = require('vscode');
      const mockEditor = { document: { fileName: 'TestOutput1-processID' } };
      vscode.window.visibleTextEditors = [mockEditor];

      const result = manager.isAiOutVisible();
      expect(result).not.toBeNull();
      expect(result.id).toBe('1');
      expect(result.name).toBe('processID');
      expect(result.output).toBe(mockEditor);
    });
  });
});
