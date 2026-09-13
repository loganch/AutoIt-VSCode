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
  const rawDir = parts[1] || '';

  return {
    path: parts[0] || '',
    // Always exactly one trailing separator (the match already includes one).
    dir: rawDir === '' ? '' : `${rawDir.replace(/[\\/]+$/, '')}\\`,
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
  const parts = splitPath(value || '');
  const { file } = data;
  const { dir } = data;
  if (parts.file === '') parts.file = file || '';

  if (parts.dir === '' || parts.isRelative)
    parts.dir = aiPath.dir + parts.dir + (!parts.isRelative ? dir || '' : '');

  if (file === undefined) parts.file += '/';

  return (parts.dir + '/' + parts.file).replace(/[\\/]+/g, '\\');
}
