jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  copyFileSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

const fs = require('fs');
const { execSync } = require('child_process');

const {
  rootDir,
  packageJsonPath,
  backupPath,
  readPackageJson,
  writePackageJson,
  restorePackageJson,
  packageExtension,
  packageAll,
} = require('../../scripts/package-all.js');

describe('scripts/package-all', () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    process.exitCode = 0;
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('reads and parses package.json', () => {
    fs.readFileSync.mockReturnValue('{"name":"autoit","version":"1.4.0"}');

    const parsed = readPackageJson();

    expect(fs.readFileSync).toHaveBeenCalledWith(packageJsonPath, 'utf8');
    expect(parsed).toEqual({ name: 'autoit', version: '1.4.0' });
  });

  it('writes package.json with two-space indentation and trailing newline', () => {
    const packageData = { name: 'autoit', version: '1.4.0', publisher: 'loganch' };

    writePackageJson(packageData);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      packageJsonPath,
      '{\n  "name": "autoit",\n  "version": "1.4.0",\n  "publisher": "loganch"\n}\n',
      'utf8',
    );
  });

  it('restores package.json from backup and removes backup file', () => {
    restorePackageJson();

    expect(fs.copyFileSync).toHaveBeenCalledWith(backupPath, packageJsonPath);
    expect(fs.unlinkSync).toHaveBeenCalledWith(backupPath);
  });

  it('packages both marketplace artifacts and restores backup in finally block', () => {
    fs.readFileSync.mockReturnValue(
      JSON.stringify({
        name: 'autoit',
        version: '1.4.0',
        publisher: 'Damien',
      }),
    );

    packageAll();

    expect(fs.copyFileSync).toHaveBeenNthCalledWith(1, packageJsonPath, backupPath);
    expect(execSync).toHaveBeenNthCalledWith(
      1,
      'npm run vscode:prepublish',
      expect.objectContaining({ cwd: rootDir, stdio: 'inherit' }),
    );

    expect(execSync).toHaveBeenNthCalledWith(
      2,
      'npx @vscode/vsce package --out autoit-1.4.0.vsix',
      expect.objectContaining({ cwd: rootDir, stdio: 'inherit' }),
    );

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      packageJsonPath,
      expect.stringContaining('"publisher": "loganch"'),
      'utf8',
    );

    expect(execSync).toHaveBeenNthCalledWith(
      3,
      'npx @vscode/vsce package --out autoit-1.4.0-openvsx.vsix',
      expect.objectContaining({ cwd: rootDir, stdio: 'inherit' }),
    );

    expect(fs.copyFileSync).toHaveBeenNthCalledWith(2, backupPath, packageJsonPath);
    expect(fs.unlinkSync).toHaveBeenCalledWith(backupPath);
    expect(process.exitCode).toBe(0);
  });

  it('delegates packageExtension to vsce with root cwd', () => {
    packageExtension('Damien', 'artifact.vsix');

    expect(execSync).toHaveBeenCalledWith(
      'npx @vscode/vsce package --out artifact.vsix',
      expect.objectContaining({ cwd: rootDir, stdio: 'inherit' }),
    );
  });
});