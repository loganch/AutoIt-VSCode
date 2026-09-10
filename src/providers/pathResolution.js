import { FileType, Uri, workspace } from 'vscode';
import fs from 'fs';
import path from 'path';
import { showErrorMessage } from './ai_showMessage';
import { detectAutoItPaths } from './autoItInstallDetector';
import { resolveVariables, splitPath, fixPath } from './pathResolver';
import { upgradeSmartHelpConfig } from './smartHelpMigrator';
import { syncIncludePathsToRegistry } from './registrySync';
import { conf } from './configStore';

const isWinOS = process.platform === 'win32';
const MESSAGE_HIDE_DELAY_MS = 1000;
let showErrors = false;
let aiPath = { path: '', dir: '', file: '', isRelative: false };

function showError(sPath, data, msgSuffix) {
  if (!msgSuffix) return;

  const timeout = data.message && !data.message.isHidden ? MESSAGE_HIDE_DELAY_MS : 0;
  if (timeout) {
    data.message.hide();
    delete data.message;
  }
  if (data.prevCheck !== sPath) {
    const type = data.file !== undefined ? 'File' : 'Directory';
    setTimeout(() => {
      data.message = showErrorMessage(`${type} "${sPath}" not found (autoit.${msgSuffix})`);
      return data.message;
    }, timeout);
  }

  data.prevCheck = sPath;
}

/**
 * Verify that a previously-resolved fullPath exists and matches expected type.
 * Uses workspace.fs.stat for editor-friendly checks.
 * @param {string} sPath - original (user) path string used for messages
 * @param {object} data - metadata holding fullPath and file indicator
 * @param {string} msgSuffix - configuration key suffix for error messages
 * @returns {Promise<string|undefined>} resolves to sPath on success, undefined on failure
 */
function verifyPath(sPath, data, msgSuffix) {
  return Promise.resolve(workspace.fs.stat(Uri.file(data.fullPath)))
    .then(stats => {
      const type =
        (data.file !== undefined ? FileType.File : FileType.Directory) | FileType.SymbolicLink;
      if (!(stats.type & type)) {
        if (showErrors) showError(sPath, data, msgSuffix);

        return undefined;
      }

      if (data.message) {
        data.message.hide();
        delete data.message;
      }
      data.prevCheck = sPath;
      return sPath;
    })
    .catch(() => {
      if (showErrors) showError(sPath, data, msgSuffix);
      return undefined;
    });
}

/**
 * Compute and set data.fullPath for a configured value, then verify it.
 * @param {string} _path - configured path/value
 * @param {object} data - metadata object to update with fullPath
 * @param {string} [msgSuffix] - configuration key suffix for error messages (optional)
 * @returns {Promise<string|undefined>} resolves to sPath on success, undefined on failure
 */
function updateFullPath(_path, data, msgSuffix) {
  // Resolve VS Code variables before processing the path
  const resolvedPath = resolveVariables(_path);
  if (resolvedPath !== '') data.fullPath = fixPath(resolvedPath, data, aiPath);

  if (data.fullPath === undefined) data.fullPath = '';

  return verifyPath(_path, data, msgSuffix);
}

/**
 * Find a file by checking configured includePaths and (optionally) auto-detected AutoIt Include folders.
 * Returns the first matching full path or null if not found.
 * @param {string} file - filename to search for
 * @param {boolean} library - whether to prefer library entries (true) or search them last (false)
 * @returns {(string|null)} Full path if found, or null
 */
const findFilepath = (file, library = true) => {
  // work with copy to avoid changing main config
  const includePaths = [...conf.defaultPaths.includePaths.map(a => a.fullPath)];
  if (!library) {
    // move main library entry to the bottom so that it is searched last
    includePaths.push(includePaths.shift());
  }

  // Search configured include paths (skip falsy entries)
  for (const iPath of includePaths.filter(Boolean)) {
    const candidate = path.join(iPath, file);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // If not found, always try auto-detection as fallback
  const detectedPaths = detectAutoItPaths();
  for (const autoItPath of detectedPaths) {
    const includePath = path.join(autoItPath, 'Include');
    if (fs.existsSync(includePath)) {
      const candidate = path.join(includePath, file);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  return null;
};

function getPathsSmartHelp(defaultPath, confValue, i) {
  defaultPath.fullPath = {};
  for (const prefix in confValue) {
    if (!Object.hasOwn(confValue, prefix)) continue;
    const val = confValue[prefix];
    if (
      prefix === '_yourUdfFuncPrefix_' ||
      typeof val.chmPath !== 'string' ||
      (typeof val.udfPath !== 'string' && !Array.isArray(val.udfPath))
    )
      continue;

    const chmPath = val.chmPath.trim();
    const data = { fullPath: '', ...defaultPath.check };
    const udfPath = Array.isArray(val.udfPath) ? [...val.udfPath] : val.udfPath.split('|');
    const msgSuffix = `${i}.${prefix}`;

    updateFullPath(chmPath, data, `${msgSuffix}.chmPath`);

    for (let k = 0; k < udfPath.length; k++) {
      const oData = { fullPath: '', ...defaultPath.check };
      const bShowErrors = showErrors;
      const sMsgSuffix = msgSuffix;
      const aUdfPath = udfPath;
      updateFullPath(udfPath[k], oData).then(filePath => {
        // prefer the resolved path from updateFullPath, otherwise try configured include paths
        let resolved = filePath;
        if (!resolved) {
          resolved = findFilepath(aUdfPath[k], true);
        }
        if (resolved) {
          aUdfPath[k] = resolved;
        } else if (bShowErrors) {
          showError(aUdfPath[k], oData, `${sMsgSuffix}.udfPath[${k}]`);
        }
      });
    }
    defaultPath.fullPath[prefix] = {
      chmPath: data.fullPath,
      udfPath,
    };
  }
}

function getPaths() {
  aiPath = splitPath(conf.data.aiPath || '');

  // Auto-detect AutoIt installation if no aiPath is configured
  if (!aiPath.dir || aiPath.dir === '' || aiPath.dir === '\\') {
    const detected = detectAutoItPaths();
    if (detected.length > 0) {
      const detectedDir = detected[0].replace(/[\\/]+$/, '');
      aiPath = { path: detectedDir, dir: detectedDir + '\\', file: '', isRelative: false };
    }
  }

  for (const i in conf.defaultPaths) {
    if (!Object.hasOwn(conf.defaultPaths, i)) continue;
    const defaultPath = conf.defaultPaths[i];
    const confValue = conf.data[i];

    if (i === 'includePaths') {
      // Enhanced include path handling with auto-detection
      if (Array.isArray(confValue)) {
        for (let j = 0; j < confValue.length; j++) {
          let sPath = (typeof confValue[j] === 'string' ? confValue[j] : '').trim();

          if (sPath === '') sPath = 'Include';

          if (defaultPath[j] === undefined)
            defaultPath[j] = {
              fullPath: '',
              ...(defaultPath[0].check || { dir: '', file: undefined }),
            };

          updateFullPath(sPath, defaultPath[j], `${i}[${j}]`);
        }
      }

      // Always add auto-detected AutoIt include paths as fallback
      const detectedPaths = detectAutoItPaths();
      detectedPaths.forEach((autoItPath, idx) => {
        const includePath = path.join(autoItPath, 'Include');
        if (fs.existsSync(includePath)) {
          // Add to the end so user configured paths take precedence
          const nextIndex = confValue && confValue.length > 0 ? confValue.length + idx : idx;
          if (defaultPath[nextIndex] === undefined) {
            defaultPath[nextIndex] = { fullPath: '', dir: '', file: undefined };
          }
          defaultPath[nextIndex].fullPath = includePath;
        }
      });
    } else if (i === 'smartHelp') {
      if (Array.isArray(confValue))
        // convert array-based old config into new object-based
        return upgradeSmartHelpConfig(conf.data);

      getPathsSmartHelp(defaultPath, confValue, i);
    } else if (Array.isArray(confValue)) {
      for (let j = 0; j < confValue.length; j++) {
        let sPath = (typeof confValue[j] === 'string' ? confValue[j] : '').trim();

        if (sPath === '' && i === 'includePaths') sPath = 'Include';

        if (defaultPath[j] === undefined)
          defaultPath[j] = {
            fullPath: '',
            ...(defaultPath[0].check || { dir: '', file: undefined }),
          };

        updateFullPath(sPath, defaultPath[j], `${i}[${j}]`);
      }
    } else {
      defaultPath.fullPath = fixPath(confValue, defaultPath, aiPath);
      verifyPath(confValue, defaultPath, i);
    }
  }
  return undefined;
}

function updateIncludePaths() {
  // Only operate on Windows
  if (!isWinOS) return;

  const { includePaths } = conf.data;
  if (Array.isArray(includePaths)) {
    for (let j = 0; j < includePaths.length; j++) {
      let sPath = (typeof includePaths[j] === 'string' ? includePaths[j] : '').trim();
      if (sPath === '') sPath = 'Include';
      if (conf.defaultPaths.includePaths[j] === undefined)
        conf.defaultPaths.includePaths[j] = {
          fullPath: '',
          ...(conf.defaultPaths.includePaths[0].check || { dir: '', file: undefined }),
        };
      updateFullPath(sPath, conf.defaultPaths.includePaths[j], `includePaths[${j}]`);
    }

    // Update the registry key with resolved paths (silent on success, only surface errors)
    const resolvedIncludePaths = includePaths.map(p => {
      const trimmed = (typeof p === 'string' ? p : '').trim();
      return resolveVariables(trimmed || 'Include');
    });
    syncIncludePathsToRegistry(resolvedIncludePaths);
  }
}

/** Re-verify all configured paths after a configuration change. */
function refreshPaths() {
  showErrors = isWinOS;
  getPaths();
}

export { getPaths, updateIncludePaths, findFilepath, refreshPaths };
