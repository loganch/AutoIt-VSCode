jest.mock('vscode', () => ({
  workspace: {
    workspaceFolders: [{ uri: { fsPath: 'C:\\work\\demo' }, name: 'demo' }],
  },
}));

import { workspace } from 'vscode';
import { fixPath, resolveVariables, splitPath } from '../../src/config/pathStringUtils';

describe('resolveVariables', () => {
  const originalHome = process.env.HOME;
  const originalUserProfile = process.env.USERPROFILE;

  afterEach(() => {
    process.env.HOME = originalHome;
    process.env.USERPROFILE = originalUserProfile;
  });

  test('resolves ${workspaceFolder} to the first workspace folder fsPath', () => {
    expect(resolveVariables('${workspaceFolder}\\script.au3')).toBe('C:\\work\\demo\\script.au3');
  });

  test('resolves ${workspaceFolderBasename} to the folder name', () => {
    expect(resolveVariables('${workspaceFolderBasename}\\out')).toBe('demo\\out');
  });

  test('resolves ${cwd}', () => {
    expect(resolveVariables('${cwd}\\x')).toBe(`${process.cwd()}\\x`);
  });

  test('resolves ${home} from HOME then USERPROFILE', () => {
    process.env.HOME = 'C:\\Users\\me';
    delete process.env.USERPROFILE;
    expect(resolveVariables('${home}\\docs')).toBe('C:\\Users\\me\\docs');

    delete process.env.HOME;
    process.env.USERPROFILE = 'C:\\Users\\profile';
    expect(resolveVariables('${home}\\docs')).toBe('C:\\Users\\profile\\docs');
  });

  test('resolves all occurrences of a variable', () => {
    expect(resolveVariables('${workspaceFolder}\\a\\${workspaceFolder}\\b')).toBe(
      'C:\\work\\demo\\a\\C:\\work\\demo\\b',
    );
  });

  test('leaves unknown variables untouched', () => {
    expect(resolveVariables('${unknown}\\x')).toBe('${unknown}\\x');
  });

  test('passes through non-string and empty input unchanged', () => {
    expect(resolveVariables('')).toBe('');
    expect(resolveVariables(null)).toBeNull();
    expect(resolveVariables(undefined)).toBeUndefined();
    expect(resolveVariables(42)).toBe(42);
  });

  test('resolves to empty string when no workspace folders are open', () => {
    workspace.workspaceFolders = [];
    expect(resolveVariables('${workspaceFolder}\\x')).toBe('\\x');
    expect(resolveVariables('${workspaceFolderBasename}\\x')).toBe('\\x');
  });
});

describe('splitPath', () => {
  test('splits an absolute Windows path', () => {
    expect(splitPath('C:\\dir\\file.au3')).toEqual({
      path: 'C:\\dir\\file.au3',
      dir: 'C:\\dir\\',
      file: 'file.au3',
      isRelative: false,
    });
  });

  test('splits a bare filename as relative', () => {
    const result = splitPath('file.au3');
    expect(result.file).toBe('file.au3');
    expect(result.dir).toBe('');
    expect(result.isRelative).toBe(false);
  });

  test('marks relative directories as relative', () => {
    const result = splitPath('sub\\file.au3');
    expect(result.dir).toBe('sub\\');
    expect(result.file).toBe('file.au3');
    expect(result.isRelative).toBe(true);
  });

  test('handles empty input', () => {
    const result = splitPath('');
    expect(result.path).toBe('');
    expect(result.dir).toBe('');
    expect(result.file).toBe('');
  });

  test('handles null input', () => {
    const result = splitPath(null);
    expect(result.path).toBe('');
    expect(result.file).toBe('');
  });
});

describe('fixPath', () => {
  const aiPath = { dir: 'C:\\AutoIt3\\' };

  test('fills in the default file when the value has none', () => {
    expect(fixPath('C:\\AutoIt3\\', { file: 'AutoIt3.exe', dir: '' }, aiPath)).toBe(
      'C:\\AutoIt3\\AutoIt3.exe',
    );
  });

  test('keeps an explicit file from the value', () => {
    expect(fixPath('C:\\AutoIt3\\custom.exe', { file: 'AutoIt3.exe', dir: '' }, aiPath)).toBe(
      'C:\\AutoIt3\\custom.exe',
    );
  });

  test('appends the default dir for relative values', () => {
    expect(fixPath('sub\\', { file: 'tool.exe', dir: 'sub' }, aiPath)).toBe(
      'C:\\AutoIt3\\sub\\tool.exe',
    );
  });

  test('appends a trailing slash when data.file is undefined', () => {
    expect(fixPath('C:\\docs', {}, aiPath)).toBe('C:\\docs\\');
  });

  test('normalizes mixed separators to backslashes', () => {
    expect(fixPath('C:/AutoIt3/exe/', { file: 'AutoIt3.exe', dir: '' }, aiPath)).toBe(
      'C:\\AutoIt3\\exe\\AutoIt3.exe',
    );
  });
});
