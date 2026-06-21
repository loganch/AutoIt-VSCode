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
  packageForOpenVSX,
} = require('../../scripts/package-openvsx.js');

const FIRST_CALL_INDEX = 1;
const SECOND_CALL_INDEX = 2;

describe('scripts/package-openvsx', () => {
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

  it('reads package.json', () => {
    fs.readFileSync.mockReturnValue('{"name":"autoit","version":"1.4.0"}');

    const parsed = readPackageJson();

    expect(fs.readFileSync).toHaveBeenCalledWith(packageJsonPath, 'utf8');
    expect(parsed).toEqual({ name: 'autoit', version: '1.4.0' });
  });

  it('writes package.json with expected formatting', () => {
    writePackageJson({ name: 'autoit', version: '1.4.0', publisher: 'loganch' });

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      packageJsonPath,
      '{\n  "name": "autoit",\n  "version": "1.4.0",\n  "publisher": "loganch"\n}\n',
      'utf8',
    );
  });

  it('restores from backup and removes backup file', () => {
    restorePackageJson();

    expect(fs.copyFileSync).toHaveBeenCalledWith(backupPath, packageJsonPath);
    expect(fs.unlinkSync).toHaveBeenCalledWith(backupPath);
  });

  it('packages OpenVSX artifact and restores package.json in finally block', () => {
    fs.readFileSync.mockReturnValue(
      JSON.stringify({
        name: 'autoit',
        version: '1.4.0',
        publisher: 'Damien',
      }),
    );

    packageForOpenVSX();

    expect(fs.copyFileSync).toHaveBeenNthCalledWith(FIRST_CALL_INDEX, packageJsonPath, backupPath);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      packageJsonPath,
      expect.stringContaining('"publisher": "loganch"'),
      'utf8',
    );

    expect(execSync).toHaveBeenNthCalledWith(
      FIRST_CALL_INDEX,
      'npm run vscode:prepublish',
      expect.objectContaining({ cwd: rootDir, stdio: 'inherit' }),
    );

    expect(execSync).toHaveBeenNthCalledWith(
      SECOND_CALL_INDEX,
      'npx @vscode/vsce package --out autoit-1.4.0-openvsx.vsix',
      expect.objectContaining({ cwd: rootDir, stdio: 'inherit' }),
    );

    expect(fs.copyFileSync).toHaveBeenNthCalledWith(SECOND_CALL_INDEX, backupPath, packageJsonPath);
    expect(fs.unlinkSync).toHaveBeenCalledWith(backupPath);
    expect(process.exitCode).toBe(0);
  });
});
