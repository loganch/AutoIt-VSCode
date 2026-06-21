const mockExecFile = jest.fn();
const mockShowErrorMessage = jest.fn();

jest.mock('child_process', () => ({
  execFile: (...args) => mockExecFile(...args),
}));

jest.mock('vscode', () => ({
  window: {
    showErrorMessage: (...args) => mockShowErrorMessage(...args),
  },
}));

const { syncIncludePathsToRegistry } = require('../src/providers/registrySync');

describe('syncIncludePathsToRegistry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('writes the joined include paths to the AutoIt registry key', () => {
    syncIncludePathsToRegistry(['C:\\Include', 'C:\\Other']);

    expect(mockExecFile).toHaveBeenCalledWith(
      'reg',
      [
        'add',
        'HKCU\\Software\\AutoIt v3\\AutoIt',
        '/v',
        'Include',
        '/t',
        'REG_SZ',
        '/d',
        'C:\\Include;C:\\Other',
        '/f',
      ],
      expect.any(Function),
    );
  });

  test('shows an error message when the registry write fails', () => {
    mockExecFile.mockImplementation((cmd, args, callback) => {
      callback(new Error('boom'), '', '');
    });

    syncIncludePathsToRegistry(['C:\\Include']);

    expect(mockShowErrorMessage).toHaveBeenCalledWith('Error updating registry: boom');
  });

  test('shows stderr output when present', () => {
    mockExecFile.mockImplementation((cmd, args, callback) => {
      callback(null, '', 'warning text');
    });

    syncIncludePathsToRegistry(['C:\\Include']);

    expect(mockShowErrorMessage).toHaveBeenCalledWith('Registry stderr: warning text');
  });
});
