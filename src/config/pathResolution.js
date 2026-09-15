import { FileType, Uri, workspace } from 'vscode';
import fs from 'fs';
import path from 'path';
import { showErrorMessage } from './ai_showMessage';
import { detectAutoItPaths } from './autoItInstallDetector';
import { resolveVariables, splitPath, fixPath } from './pathStringUtils';
import { migrateSmartHelpConfig } from './smartHelpMigrator';
import { syncIncludePathsToRegistry } from './registrySync';
import { conf } from './configStore';

const isWinOS = process.platform === 'win32';
const MESSAGE_HIDE_DELAY_MS = 1000;
let showErrors = false;
let aiPath = { path: '', dir: '', file: '', isRelative: false };

/**
 * @typedef {Object} PathState - Per-configured-path verification/message state,
 * mutated in place across showError/verifyPath/updateFullPath calls.
 * @property {string} [fullPath] - Resolved absolute path (set by updateFullPath).
 * @property {string} [file] - Expected filename; presence (vs. undefined) distinguishes a file check from a directory check.
 * @property {{isHidden: boolean, hide: Function, message: Promise<any>}} [message] - The currently-shown "not found" message, if any (ai_showMessage.js's custom shape).
 * @property {string} [prevCheck] - The last filePath checked, to avoid re-notifying for an unchanged value.
 */

/**
 * @param {string} filePath
 * @param {PathState} pathState
 * @param {string} msgSuffix
 */
function showError(filePath, pathState, msgSuffix) {
  if (!msgSuffix) return;

  const timeout = pathState.message && !pathState.message.isHidden ? MESSAGE_HIDE_DELAY_MS : 0;
  if (timeout) {
    pathState.message.hide();
    delete pathState.message;
  }
  if (pathState.prevCheck !== filePath) {
    const type = pathState.file !== undefined ? 'File' : 'Directory';
    setTimeout(() => {
      pathState.message = showErrorMessage(`${type} "${filePath}" not found (autoit.${msgSuffix})`);
    }, timeout);
  }

  pathState.prevCheck = filePath;
}

/**
 * Verify that a previously-resolved fullPath exists and matches expected type.
 * Uses workspace.fs.stat for editor-friendly checks.
 * @param {string} filePath - original (user) path string used for messages
 * @param {PathState} pathState - state holding fullPath and file indicator
 * @param {string} msgSuffix - configuration key suffix for error messages
 * @returns {Promise<string|undefined>} resolves to filePath on success, undefined on failure
 */
function verifyPath(filePath, pathState, msgSuffix) {
  return Promise.resolve(workspace.fs.stat(Uri.file(pathState.fullPath)))
    .then(stats => {
      const type =
        (pathState.file !== undefined ? FileType.File : FileType.Directory) | FileType.SymbolicLink;
      if (!(stats.type & type)) {
        if (showErrors) showError(filePath, pathState, msgSuffix);

        return undefined;
      }

      if (pathState.message) {
        pathState.message.hide();
        delete pathState.message;
      }
      pathState.prevCheck = filePath;
      return filePath;
    })
    .catch(() => {
      if (showErrors) showError(filePath, pathState, msgSuffix);
      return undefined;
    });
}

/**
 * Compute and set pathState.fullPath for a configured value, then verify it.
 * @param {string} _path - configured path/value
 * @param {PathState} pathState - state object to update with fullPath
 * @param {string} [msgSuffix] - configuration key suffix for error messages (optional)
 * @returns {Promise<string|undefined>} resolves to filePath on success, undefined on failure
 */
function updateFullPath(_path, pathState, msgSuffix) {
  // Resolve VS Code variables before processing the path
  const resolvedPath = resolveVariables(_path);
  if (resolvedPath !== '') pathState.fullPath = fixPath(resolvedPath, pathState, aiPath);

  if (pathState.fullPath === undefined) pathState.fullPath = '';

  return verifyPath(_path, pathState, msgSuffix);
}

/**
 * Include-capability layering (see also utils/includeResolution.js,
 * language/include.js, services/includeGraph.js, utils/includeAutoInsert.js):
 * this is the lowest layer — it owns *where to search* (configured
 * includePaths + auto-detected AutoIt installs) and is the library-path
 * fallback the higher layers call into. It knows nothing about #include
 * syntax or document structure.
 *
 * Find a file by checking configured includePaths and (optionally) auto-detected AutoIt Include folders.
 * Returns the first matching full path or null if not found.
 * @param {string} fileName - filename to search for
 * @param {boolean} preferLibrary - whether to prefer library entries (true) or search them last (false)
 * @returns {(string|null)} Full path if found, or null
 */
const findFilePath = (fileName, preferLibrary = true) => {
  // work with copy to avoid changing main config
  const includePaths = [...conf.defaultPaths.includePaths.map(a => a.fullPath)];
  if (!preferLibrary) {
    // move main library entry to the bottom so that it is searched last
    includePaths.push(includePaths.shift());
  }

  // Search configured include paths (skip falsy entries)
  for (const iPath of includePaths.filter(Boolean)) {
    const candidate = path.join(iPath, fileName);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // If not found, always try auto-detection as fallback
  const detectedPaths = detectAutoItPaths();
  for (const autoItPath of detectedPaths) {
    const includePath = path.join(autoItPath, 'Include');
    if (fs.existsSync(includePath)) {
      const candidate = path.join(includePath, fileName);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  return null;
};

/**
 * Resolve confValue[j] into defaultPath[j].fullPath, initializing the slot's
 * default shape first if this is its first sighting. Shared by resolvePaths'
 * includePaths and generic-array branches, which otherwise duplicated this
 * loop body identically apart from the '' -> 'Include' fallback.
 * @param {Array} confValue
 * @param {Array} defaultPath
 * @param {number} j
 * @param {string} suffix - configuration key suffix for error messages
 * @param {boolean} fallbackToInclude - whether an empty entry defaults to 'Include'
 */
function ensureIndexedPath(confValue, defaultPath, j, suffix, fallbackToInclude) {
  let filePath = (typeof confValue[j] === 'string' ? confValue[j] : '').trim();

  if (filePath === '' && fallbackToInclude) filePath = 'Include';

  if (defaultPath[j] === undefined)
    defaultPath[j] = {
      fullPath: '',
      ...(defaultPath[0].check || { dir: '', file: undefined }),
    };

  updateFullPath(filePath, defaultPath[j], suffix);
}

/**
 * Populates defaultPath.fullPath in place with resolved smartHelp entries
 * (chmPath/udfPath, keyed by UDF function prefix) from the configured value.
 * @param {Object} defaultPath - The smartHelp defaultPaths entry to mutate.
 * @param {Object} confValue - The configured smartHelp value, keyed by prefix.
 * @param {string} i - Configuration key suffix used for error messages.
 * @returns {void}
 */
function populateSmartHelpPaths(defaultPath, confValue, i) {
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
    const pathState = { fullPath: '', ...defaultPath.check };
    const udfPath = Array.isArray(val.udfPath) ? [...val.udfPath] : val.udfPath.split('|');
    const msgSuffix = `${i}.${prefix}`;

    updateFullPath(chmPath, pathState, `${msgSuffix}.chmPath`);

    for (let k = 0; k < udfPath.length; k++) {
      const udfPathState = { fullPath: '', ...defaultPath.check };
      // Snapshot the module-level showErrors flag: it can be reassigned by
      // refreshPaths() before this .then() runs, and no-loop-func forbids
      // referencing the mutable outer binding directly from a loop closure.
      const shouldShowErrors = showErrors;
      updateFullPath(udfPath[k], udfPathState).then(filePath => {
        // prefer the resolved path from updateFullPath, otherwise try configured include paths
        let resolved = filePath;
        if (!resolved) {
          resolved = findFilePath(udfPath[k], true);
        }
        if (resolved) {
          udfPath[k] = resolved;
        } else if (shouldShowErrors) {
          showError(udfPath[k], udfPathState, `${msgSuffix}.udfPath[${k}]`);
        }
      });
    }
    defaultPath.fullPath[prefix] = {
      chmPath: pathState.fullPath,
      udfPath,
    };
  }
}

/**
 * Populate all configured path objects from the current configuration.
 *
 * Path values (fullPath, dir, file) are resolved synchronously. Existence
 * verification via workspace.fs.stat is fire-and-forget async — any "path not
 * found" error messages appear after this function returns.
 */
function resolvePaths() {
  aiPath = splitPath(conf.data.aiPath || '');

  // Auto-detect AutoIt installation if no aiPath is configured
  if (!aiPath.dir || aiPath.dir === '\\') {
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
          ensureIndexedPath(confValue, defaultPath, j, `${i}[${j}]`, true);
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
        return migrateSmartHelpConfig(conf.data);

      populateSmartHelpPaths(defaultPath, confValue, i);
    } else if (Array.isArray(confValue)) {
      // i !== 'includePaths' here (that case is handled above), so entries
      // never fall back to 'Include'.
      for (let j = 0; j < confValue.length; j++) {
        ensureIndexedPath(confValue, defaultPath, j, `${i}[${j}]`, false);
      }
    } else {
      defaultPath.fullPath = fixPath(confValue, defaultPath, aiPath);
      verifyPath(confValue, defaultPath, i);
    }
  }
  return undefined;
}

/**
 * Re-resolve include paths and sync them to the registry.
 *
 * Path values are resolved synchronously. Existence verification is
 * fire-and-forget async — see resolvePaths() for the same contract.
 */
function updateIncludePaths() {
  // Only operate on Windows
  if (!isWinOS) return;

  const { includePaths } = conf.data;
  if (Array.isArray(includePaths)) {
    for (let j = 0; j < includePaths.length; j++) {
      let filePath = (typeof includePaths[j] === 'string' ? includePaths[j] : '').trim();
      if (filePath === '') filePath = 'Include';
      if (conf.defaultPaths.includePaths[j] === undefined)
        conf.defaultPaths.includePaths[j] = {
          fullPath: '',
          ...(conf.defaultPaths.includePaths[0].check || { dir: '', file: undefined }),
        };
      updateFullPath(filePath, conf.defaultPaths.includePaths[j], `includePaths[${j}]`);
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
  resolvePaths();
}

export { resolvePaths, updateIncludePaths, findFilePath, refreshPaths };
