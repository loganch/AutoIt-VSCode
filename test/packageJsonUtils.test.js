jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  copyFileSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

const fs = require('fs');
const {
  readPackageJson,
  writePackageJson,
  restorePackageJson,
  packageJsonPath,
  backupPath,
} = require('../scripts/packageJsonUtils');

describe('packageJsonUtils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('readPackageJson parses the file contents', () => {
    fs.readFileSync.mockReturnValue('{"name":"autoit","version":"1.6.0"}');

    expect(readPackageJson()).toEqual({ name: 'autoit', version: '1.6.0' });
    expect(fs.readFileSync).toHaveBeenCalledWith(packageJsonPath, 'utf8');
  });

  test('writePackageJson writes formatted JSON with a trailing newline', () => {
    writePackageJson({ name: 'autoit' });

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      packageJsonPath,
      '{\n  "name": "autoit"\n}\n',
      'utf8',
    );
  });

  test('restorePackageJson copies the backup over package.json and removes it', () => {
    restorePackageJson();

    expect(fs.copyFileSync).toHaveBeenCalledWith(backupPath, packageJsonPath);
    expect(fs.unlinkSync).toHaveBeenCalledWith(backupPath);
  });

  test('restorePackageJson prints the success message', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    restorePackageJson('restored!');

    expect(logSpy).toHaveBeenCalledWith('restored!');
    logSpy.mockRestore();
  });

  test('restorePackageJson logs and rethrows on failure', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    fs.copyFileSync.mockImplementation(() => {
      throw new Error('backup missing');
    });

    expect(() => restorePackageJson()).toThrow('backup missing');
    expect(errorSpy).toHaveBeenCalledWith('Error restoring package.json:', 'backup missing');
    errorSpy.mockRestore();
  });
});
