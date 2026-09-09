jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

jest.mock('fs', () => ({
  __esModule: true,
  default: { existsSync: jest.fn() },
}));

jest.mock('path', () => ({
  __esModule: true,
  default: { join: (...parts) => parts.join('/') },
}));

const setPlatform = platform => {
  Object.defineProperty(process, 'platform', { value: platform });
};

// Load fresh module + mock instances after resetModules so the test always
// holds the same mock objects the freshly-evaluated module bound to.
const loadModule = () => {
  jest.resetModules();
  const childProcess = require('child_process');
  const fsModule = require('fs');
  const mod = require('../src/providers/autoItInstallDetector');
  return {
    detectAutoItPaths: mod.detectAutoItPaths,
    execSync: childProcess.execSync,
    fs: fsModule.default,
  };
};

const REG_OUTPUT_64 = '    InstallDir    REG_SZ    C:\\AutoIt3Custom\r\n';
const REG_OUTPUT_32 = '    InstallDir    REG_SZ    C:\\AutoIt3Custom32\r\n';

describe('detectAutoItPaths', () => {
  const originalPlatform = process.platform;

  afterEach(() => {
    setPlatform(originalPlatform);
    jest.clearAllMocks();
  });

  test('returns empty on non-Windows platforms without touching fs or registry', () => {
    setPlatform('linux');
    const { detectAutoItPaths, execSync, fs } = loadModule();

    expect(detectAutoItPaths()).toEqual([]);
    expect(execSync).not.toHaveBeenCalled();
    expect(fs.existsSync).not.toHaveBeenCalled();
  });

  test('prepends the registry install dir when AutoIt3.exe exists there', () => {
    setPlatform('win32');
    const { detectAutoItPaths, execSync, fs } = loadModule();
    execSync.mockReturnValue(REG_OUTPUT_64);
    fs.existsSync.mockImplementation(p => p.replace(/\\/g, '/') === 'C:/AutoIt3Custom/AutoIt3.exe');

    expect(detectAutoItPaths()).toEqual(['C:\\AutoIt3Custom']);
    expect(execSync).toHaveBeenCalledTimes(1);
  });

  test('falls back to the 32-bit registry view when the 64-bit query fails', () => {
    setPlatform('win32');
    const { detectAutoItPaths, execSync, fs } = loadModule();
    execSync
      .mockImplementationOnce(() => {
        throw new Error('reg not found');
      })
      .mockReturnValueOnce(REG_OUTPUT_32);
    fs.existsSync.mockImplementation(
      p => p.replace(/\\/g, '/') === 'C:/AutoIt3Custom32/AutoIt3.exe',
    );

    expect(detectAutoItPaths()).toEqual(['C:\\AutoIt3Custom32']);
    expect(execSync).toHaveBeenCalledTimes(2);
  });

  test('uses default paths when both registry views fail', () => {
    setPlatform('win32');
    const { detectAutoItPaths, execSync, fs } = loadModule();
    execSync.mockImplementation(() => {
      throw new Error('reg not found');
    });
    fs.existsSync.mockImplementation(
      p => p.replace(/\\/g, '/') === 'C:/Program Files (x86)/AutoIt3/AutoIt3.exe',
    );

    expect(detectAutoItPaths()).toEqual(['C:\\Program Files (x86)\\AutoIt3']);
  });

  test('filters candidate paths that lack AutoIt3.exe', () => {
    setPlatform('win32');
    const { detectAutoItPaths, execSync, fs } = loadModule();
    execSync.mockImplementation(() => {
      throw new Error('reg not found');
    });
    fs.existsSync.mockReturnValue(false);

    expect(detectAutoItPaths()).toEqual([]);
  });
});
