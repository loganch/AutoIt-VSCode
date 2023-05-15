import { workspace, Uri, FileType } from 'vscode';
import fs from 'fs';
import path from 'path';
import { showErrorMessage } from './ai_showMessage';

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
let aiPath = '';
let bNoEvents;
const isWinOS = process.platform === 'win32';
let showErrors = false;

function splitPath(_path) {
  _path = _path
    .trim()
    .match(/^(.*[\\/])?([^\\/]+)?$/)
    .map(a => a || '');

  return {
    path: _path[0],
    dir: _path[1] + (_path[1] === '' ? '' : '\\'),
    file: _path[2],
    isRelative: !!(_path[1] && !_path[1].match(/^[a-zA-Z]:[\\/]/)),
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

function verifyPath(sPath, data, msgSuffix) {
  return workspace.fs
    .stat(Uri.file(data.fullPath))
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
    });
}

function updateFullPath(_path, data, msgSuffix) {
  if (_path !== '') data.fullPath = fixPath(_path, data);

  if (data.fullPath === undefined) data.fullPath = '';

  return verifyPath(_path, data, msgSuffix);
}

const config = new Proxy(conf, {
  get(target, prop) {
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
    return target.data.update(prop, val);
  },
});

/**
 * Checks a filename with the include paths for a valid path
 * @param {string} file - the filename to append to the paths
 * @param {boolean} library - Search Autoit library first?
 * @returns {(string|boolean)} Full path if found to exist or false
 */
const findFilepath = (file, library = true) => {
  // work with copy to avoid changing main config
  const includePaths = [...config.includePaths];
  if (!library) {
    // move main library entry to the bottom so that it is searched last
    includePaths.push(includePaths.shift());
  }

  let newPath;
  const pathFound = includePaths.some(iPath => {
    newPath = path.normalize(`${iPath}\\`) + file;
    if (fs.existsSync(newPath)) {
      return true;
    }
    return false;
  });

  if (pathFound && newPath) {
    return newPath;
  }
  return false;
};

function getPaths() {
  aiPath = splitPath(conf.data.aiPath || '');

  for (const i in conf.defaultPaths) {
    if (Object.hasOwn(conf.defaultPaths, i)) {
      const defaultPath = conf.defaultPaths[i];
      const confValue = conf.data[i];

      if (i === 'smartHelp') {
        if (Array.isArray(confValue))
          // convert array-based old config into new object-based
          return upgradeSmartHelpConfig();

        defaultPath.fullPath = {};
        for (const prefix in confValue) {
          if (Object.hasOwn(defaultPath, prefix)) {
            const val = confValue[prefix];
            if (
              prefix === '_yourUdfFuncPrefix_' ||
              typeof val.chmPath !== 'string' ||
              (typeof val.udfPath !== 'string' && !Array.isArray(val.udfPath))
            )
              continue;

            const chmPath = val.chmPath.trim();
            const data = Object.assign({ fullPath: '' }, defaultPath.check);
            const udfPath = Array.isArray(val.udfPath) ? [...val.udfPath] : val.udfPath.split('|');
            const msgSuffix = `${i}.${prefix}`;

            updateFullPath(chmPath, data, `${msgSuffix}.chmPath`);

            for (let k = 0; k < udfPath.length; k++) {
              const oData = Object.assign({ fullPath: '' }, defaultPath.check);
              const bShowErrors = showErrors;
              const sMsgSuffix = msgSuffix;
              const aUdfPath = udfPath;
              updateFullPath(udfPath[k], oData).then(filePath => {
                if (!filePath) {
                  filePath = findFilepath(aUdfPath[k], true);
                }
                if (filePath) {
                  aUdfPath[k] = filePath;
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
      } else if (Array.isArray(confValue)) {
        for (let j = 0; j < confValue.length; j++) {
          let sPath = (typeof confValue[j] === 'string' ? confValue[j] : '').trim();

          if (sPath === '' && i === 'includePaths') sPath = 'Include';

          if (defaultPath[j] === undefined)
            defaultPath[j] = Object.assign({ fullPath: '' }, defaultPath[0].check);

          updateFullPath(sPath, defaultPath[j], `${i}[${j}]`);
        }
      } else {
        defaultPath.fullPath = fixPath(confValue, defaultPath);
        verifyPath(confValue, defaultPath, i);
      }
    }
  }
  return undefined;
}

workspace.onDidChangeConfiguration(({ affectsConfiguration }) => {
  if (bNoEvents || !affectsConfiguration('autoit')) return;

  conf.data = workspace.getConfiguration('autoit');
  listeners.forEach(listener => {
    try {
      listener();
    } catch (er) {
      console.error(er);
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
  listeners.remove(id);
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
