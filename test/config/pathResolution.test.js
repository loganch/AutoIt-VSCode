const FileType = { Unknown: 0, File: 1, Directory: 2, SymbolicLink: 64 };

jest.mock('vscode', () => ({
  __esModule: true,
  FileType: { Unknown: 0, File: 1, Directory: 2, SymbolicLink: 64 },
  Uri: { file: p => ({ fsPath: p }) },
  workspace: {
    fs: { stat: jest.fn() },
  },
}));

const mockShowErrorMessage = jest.fn();
jest.mock('../../src/config/ai_showMessage', () => ({
  showErrorMessage: (...args) => mockShowErrorMessage(...args),
}));

const mockDetectAutoItPaths = jest.fn(() => []);
jest.mock('../../src/config/autoItInstallDetector', () => ({
  detectAutoItPaths: (...args) => mockDetectAutoItPaths(...args),
}));

const testConf = { data: {}, defaultPaths: {} };
jest.mock('../../src/config/configStore', () => ({ conf: testConf }));

const { workspace } = require('vscode');
const fs = require('fs');
// isWinOS is captured once at module load; these tests run on the Windows
// dev machine this repo targets, so refreshPaths()'s error-surfacing path is
// exercised for real rather than being faked.
const { resolvePaths, refreshPaths, findFilePath } = require('../../src/config/pathResolution');

const flushAsync = () => new Promise(resolve => setImmediate(resolve));

describe('findFilePath', () => {
  beforeEach(() => {
    testConf.defaultPaths.includePaths = [{ fullPath: 'C:\\Configured\\Include' }];
    mockDetectAutoItPaths.mockReturnValue([]);
  });

  test('returns the first match from configured include paths', () => {
    jest
      .spyOn(fs, 'existsSync')
      .mockImplementation(p => p === 'C:\\Configured\\Include\\Array.au3');

    expect(findFilePath('Array.au3')).toBe('C:\\Configured\\Include\\Array.au3');

    fs.existsSync.mockRestore();
  });

  test('falls back to an auto-detected AutoIt install when not in configured paths', () => {
    mockDetectAutoItPaths.mockReturnValue(['C:\\Program Files\\AutoIt3']);
    jest
      .spyOn(fs, 'existsSync')
      .mockImplementation(
        p =>
          p === 'C:\\Program Files\\AutoIt3\\Include' ||
          p === 'C:\\Program Files\\AutoIt3\\Include\\Array.au3',
      );

    expect(findFilePath('Array.au3')).toBe('C:\\Program Files\\AutoIt3\\Include\\Array.au3');

    fs.existsSync.mockRestore();
  });

  test('returns undefined when the file is nowhere to be found', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    expect(findFilePath('Missing.au3')).toBeUndefined();

    fs.existsSync.mockRestore();
  });
});

describe('resolvePaths / refreshPaths', () => {
  beforeEach(() => {
    testConf.data = { checkPath: 'C:\\AutoIt\\AU3Check.exe' };
    testConf.defaultPaths = { checkPath: { file: 'AU3Check.exe' } };
    mockDetectAutoItPaths.mockReturnValue([]);
    mockShowErrorMessage.mockClear();
  });

  test('resolves fullPath for a configured value that exists on disk', async () => {
    workspace.fs.stat.mockResolvedValue({ type: FileType.File });

    resolvePaths();
    await flushAsync();

    expect(testConf.defaultPaths.checkPath.fullPath).toContain('AU3Check.exe');
    expect(mockShowErrorMessage).not.toHaveBeenCalled();
  });

  test('surfaces an error message when the configured path does not exist', async () => {
    jest.useFakeTimers();
    try {
      workspace.fs.stat.mockRejectedValue(new Error('ENOENT'));

      refreshPaths();
      // showError's own message is scheduled behind a setTimeout delay; this
      // drains both the workspace.fs.stat rejection microtask and that timer.
      await jest.runAllTimersAsync();

      expect(mockShowErrorMessage).toHaveBeenCalledWith(expect.stringContaining('AU3Check.exe'));
    } finally {
      jest.useRealTimers();
    }
  });
});
