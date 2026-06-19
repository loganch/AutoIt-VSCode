import { workspace } from 'vscode';

/**
 * Resolves VS Code variables in a path string.
 * Supports: ${workspaceFolder}, ${workspaceFolderBasename}, ${cwd}, ${home}
 * @param {string} inputPath - path string that may contain VS Code variables
 * @returns {string} path with variables resolved
 */
export function resolveVariables(inputPath) {
  if (!inputPath || typeof inputPath !== 'string') {
    return inputPath;
  }

  let result = inputPath;

  if (result.includes('${workspaceFolder}')) {
    const { workspaceFolders } = workspace;
    const wsFolder =
      workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : '';
    result = result.replace(/\$\{workspaceFolder\}/g, wsFolder);
  }

  if (result.includes('${workspaceFolderBasename}')) {
    const { workspaceFolders } = workspace;
    const wsFolderBasename =
      workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].name : '';
    result = result.replace(/\$\{workspaceFolderBasename\}/g, wsFolderBasename);
  }

  if (result.includes('${cwd}')) {
    result = result.replace(/\$\{cwd\}/g, process.cwd());
  }

  if (result.includes('${home}')) {
    result = result.replace(/\$\{home\}/g, process.env.HOME || process.env.USERPROFILE || '');
  }

  return result;
}

/**
 * Split a filesystem path into components.
 * Returns an object with raw path, directory (always trailing backslash unless empty),
 * filename, and whether the directory is relative.
 * @param {string} _path - input path string
 * @returns {{path:string,dir:string,file:string,isRelative:boolean}}
 */
export function splitPath(_path) {
  const m = (_path || '').trim().match(/^(.*[\\/])?([^\\/]+)?$/) || [];
  const parts = m.map(a => a || '');

  return {
    path: parts[0] || '',
    dir: (parts[1] || '') + ((parts[1] || '') === '' ? '' : '\\'),
    file: parts[2] || '',
    isRelative: !!(parts[1] && !parts[1].match(/^[a-zA-Z]:[\\/]/)),
  };
}

/**
 * Normalize and resolve a configured value against the detected aiPath and defaults.
 * Returns a filesystem path using backslashes.
 * @param {string} value - configured path value (may be file or dir)
 * @param {object} data - default path metadata (may include file, dir)
 * @param {{dir:string}} aiPath - the resolved AutoIt installation path
 * @returns {string} normalized path
 */
export function fixPath(value, data, aiPath) {
  const sPath = splitPath(value || '');
  const { file } = data;
  const { dir } = data;
  if (sPath.file === '') sPath.file = file || '';

  if (sPath.dir === '' || sPath.isRelative)
    sPath.dir = aiPath.dir + sPath.dir + (!sPath.isRelative ? dir || '' : '');

  if (file === undefined) sPath.file += '/';

  return (sPath.dir + '/' + sPath.file).replace(/[\\/]+/g, '\\');
}
