import { FileType, Uri, window, workspace } from 'vscode';
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { showErrorMessage } from './ai_showMessage';

const meta = require('../package.json');

/**
 * Fix the output style of the extension
 * #209
 * @link https://github.com/microsoft/vscode/issues/201603
 */
try {
  const cConfig = workspace.getConfiguration('editor');
  const dataNew = {};
  let save = false;

  // Safely read token color defaults from package.json (guard for packaging changes)
  const cfgDefaults = meta?.contributes?.configurationDefaults?.['editor.tokenColorCustomizations'];

  if (!cfgDefaults?.textMateRules?.length) {
    // nothing to add, skip
  } else {
    // convert default rules into an object with the scope as key
    const defaultRules = cfgDefaults.textMateRules.reduce((obj, item) => {
      obj[item.scope] = item;
      return obj;
    }, {});

    let value = cConfig.get('tokenColorCustomizations');
    if (typeof value !== 'object' || value === null) value = {};

    const keys = Object.keys(value);
    if (!Array.isArray(value.textMateRules)) keys.push('textMateRules');

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // we are only interested in settings that have textMateRules
      if (key !== 'textMateRules' && !value[key].textMateRules) continue;

      const list = (value[key] && value[key].textMateRules) || value[key] || [];
      const rules = { ...defaultRules };
      for (let j = 0; j < list.length; j++) {
        // remove all existing rules, we don't want to replace user-changed rules
        if (rules[list[j].scope]) delete rules[list[j].scope];
      }
      // add all remaining rules
      for (const scope in rules) {
        if (Object.prototype.hasOwnProperty.call(rules, scope)) {
          list.push(rules[scope]);
          save = true;
        }
      }

      // store data in a new object, because original might be a Proxy
      if (value[key] && value[key].textMateRules) dataNew[key] = { textMateRules: list };
      else dataNew[key] = list;
    }
    if (save) {
      // save global settings
      cConfig.update('tokenColorCustomizations', dataNew, true);
    }
  }
} catch {
  /* swallow to avoid impacting activation */
}

const conf = {
  data: workspace.getConfiguration('autoit'),
  defaultPaths: {
    aiPath: { file: 'AutoIt3.exe' },
    wrapperPath: { dir: 'SciTE\\AutoIt3Wrapper\\', file: 'AutoIt3Wrapper.au3' },
    checkPath: { file: 'AU3Check.exe' },
    helpPath: { file: 'AutoIt3Help.exe' },
    infoPath: { file: 'Au3Info.exe' },
    kodaPath: { dir: 'SciTE\\Koda\\', file: 'FD.exe' },
    includePaths: [{ dir: '' }],
    smartHelp: { check: { dir: 'Advanced.Help\\HelpFiles\\', file: '' } },
  },
};

const listeners = new Map();
let listenerId = 0;
let aiPath = { path: '', dir: '', file: '', isRelative: false };
let bNoEvents;
const isWinOS = process.platform === 'win32';
let showErrors = false;

/**
 * Attempts to auto-detect AutoIt installation paths on Windows.
 * Returns an array of candidate install directories that contain AutoIt3.exe.
 * Non-Windows platforms receive an empty array.
 * @returns {string[]} Array of potential AutoIt installation paths
 */
function detectAutoItPaths() {
  if (!isWinOS) return [];

  const potentialPaths = [
    'C:\\Program Files (x86)\\AutoIt3',
    'C:\\Program Files\\AutoIt3',
    'C:\\AutoIt3',
    process.env.PROGRAMFILES ? `${process.env.PROGRAMFILES}\\AutoIt3` : null,
    process.env['PROGRAMFILES(X86)'] ? `${process.env['PROGRAMFILES(X86)']}\\AutoIt3` : null,
  ].filter(Boolean);

  // Check registry for AutoIt installation path
  if (isWinOS) {
    try {
      const { execSync } = require('child_process');
      try {
        const regResult = execSync(
          'reg query "HKLM\\SOFTWARE\\AutoIt v3\\AutoIt" /v InstallDir 2>nul',
          { encoding: 'utf8' },
        );
        const match = regResult.match(/InstallDir\s+REG_SZ\s+(.+)/);
        if (match && match[1]) {
          potentialPaths.unshift(match[1].trim());
        }
      } catch {
        // Try 32-bit registry view
        try {
          const regResult32 = execSync(
            'reg query "HKLM\\SOFTWARE\\WOW6432Node\\AutoIt v3\\AutoIt" /v InstallDir 2>nul',
            { encoding: 'utf8' },
          );
          const match32 = regResult32.match(/InstallDir\s+REG_SZ\s+(.+)/);
          if (match32 && match32[1]) {
            potentialPaths.unshift(match32[1].trim());
          }
        } catch {
          // Registry queries failed, use default paths
        }
      }
    } catch {
      // execSync not available or failed, use default paths
    }
  }

  return potentialPaths.filter(p => {
    try {
      return p && fs.existsSync(path.join(p, 'AutoIt3.exe'));
    } catch {
      return false;
    }
  });
}

/**
 * Split a filesystem path into components.
 * Returns an object with raw path, directory (always trailing backslash unless empty),
 * filename, and whether the directory is relative.
 * @param {string} _path - input path string
 * @returns {{path:string,dir:string,file:string,isRelative:boolean}}
 */
function splitPath(_path) {
  const m = (_path || '').trim().match(/^(.*[\\/])?([^\\/]+)?$/) || [];
  const parts = m.map(a => a || '');

  return {
    path: parts[0] || '',
    dir: (parts[1] || '') + ((parts[1] || '') === '' ? '' : '\\'),
    file: parts[2] || '',
    isRelative: !!(parts[1] && !parts[1].match(/^[a-zA-Z]:[\\/]/)),
  };
}

function upgradeSmartHelpConfig() {
  const data = conf.data.smartHelp;
  const inspect = conf.data.inspect('smartHelp');
  const props = {
    workspaceFolderLanguageValue: [null, true],
    workspaceLanguageValue: [false, true],
    globalLanguageValue: [true, true],
    defaultLanguageValue: [null, true],
    workspaceFolderValue: [],
    workspaceValue: [false],
    globalValue: [true],
    defaultValue: [],
  };

  let ret = {};
  let ConfigurationTarget;
  let overrideInLanguage;
  for (const i in props) {
    if (inspect[i] !== undefined) {
      [ConfigurationTarget, overrideInLanguage] = props[i];
      break;
    }
  }
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      ret[data[i][0]] = {
        chmPath: data[i][1],
        udfPath: data[i][2].split('|'),
      };
    }
  }
  if (!Object.keys(ret).length || typeof data === 'string') ret = undefined;

  conf.data.update('smartHelp', ret, ConfigurationTarget, overrideInLanguage);
}

/**
 * Normalize and resolve a configured value against the detected aiPath and defaults.
 * Returns a filesystem path using backslashes.
 * @param {string} value - configured path value (may be file or dir)
 * @param {object} data - default path metadata (may include file, dir)
 * @returns {string} normalized path
 */
function fixPath(value, data) {
  const sPath = splitPath(value || '');
  const { file } = data;
  const { dir } = data;
  if (sPath.file === '') sPath.file = file || '';

  if (sPath.dir === '' || sPath.isRelative)
    sPath.dir = aiPath.dir + sPath.dir + (!sPath.isRelative ? dir || '' : '');

  if (file === undefined) sPath.file += '/';

  return (sPath.dir + '/' + sPath.file).replace(/[\\/]+/g, '\\');
}

function showError(sPath, data, msgSuffix) {
  if (!msgSuffix) return;

  const timeout = data.message && !data.message.isHidden ? 1000 : 0;
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
  if (_path !== '') data.fullPath = fixPath(_path, data);

  if (data.fullPath === undefined) data.fullPath = '';

  return verifyPath(_path, data, msgSuffix);
}

const config = new Proxy(conf, {
  get(target, prop) {
    if (typeof prop !== 'string') return undefined;
    const val = target.defaultPaths[prop];
    if (val) {
      const isArray = Array.isArray(val);
      if (isArray || (val !== null && typeof val === 'object'))
        return isArray ? val.map(a => a.fullPath) : val.fullPath;

      return val.fullPath;
    }
    return target.data[prop];
  },
  set(target, prop, val) {
    if (typeof prop !== 'string') return false;
    target.data.update(prop, val);
    return true;
  },
});

/**
 * Find a file by checking configured includePaths and (optionally) auto-detected AutoIt Include folders.
 * Returns the first matching full path or false if not found.
 * @param {string} file - filename to search for
 * @param {boolean} library - whether to prefer library entries (true) or search them last (false)
 * @returns {(string|boolean)} Full path if found, or false
 */
const findFilepath = (file, library = true) => {
  // work with copy to avoid changing main config
  const includePaths = [...config.includePaths];
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

  return false;
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
          const found = findFilepath(aUdfPath[k], true);
          if (typeof found === 'string') resolved = found;
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
        return upgradeSmartHelpConfig();

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
      defaultPath.fullPath = fixPath(confValue, defaultPath);
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

    // Update the registry key (silent on success, only surface errors)
    const includePathsString = includePaths.join(';');
    execFile(
      'reg',
      [
        'add',
        'HKCU\\Software\\AutoIt v3\\AutoIt',
        '/v',
        'Include',
        '/t',
        'REG_SZ',
        '/d',
        includePathsString,
        '/f',
      ],
      (error, stdout, stderr) => {
        if (error) {
          window.showErrorMessage(`Error updating registry: ${error.message}`);
          return;
        }
        if (stderr) {
          window.showErrorMessage(`Registry stderr: ${stderr}`);
        }
        // Success: do not notify to reduce noise
      },
    );
  }
}

workspace.onDidChangeConfiguration(({ affectsConfiguration }) => {
  if (bNoEvents || !affectsConfiguration('autoit')) return;

  conf.data = workspace.getConfiguration('autoit');

  if (affectsConfiguration('autoit.includePaths')) {
    updateIncludePaths();
  }

  listeners.forEach(listener => {
    try {
      listener();
    } catch (er) {
      window.showErrorMessage(er);
    }
  });
  showErrors = isWinOS;
  getPaths();
});

getPaths();

function addListener(listener) {
  listeners.set(++listenerId, listener);
  return listenerId;
}

function removeListener(id) {
  listeners.delete(id);
}

function noEvents(value) {
  bNoEvents = Boolean(value);
}

export default {
  config,
  addListener,
  removeListener,
  noEvents,
  findFilepath,
};
