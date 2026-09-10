import { window, workspace } from 'vscode';

/**
 * Configuration store: holds the `autoit` workspace configuration, the
 * default-path metadata table, the `config` Proxy, and the listener registry.
 *
 * Proxy contract (deliberate): reading `config.<key>` returns the resolved
 * `fullPath` for keys present in `defaultPaths` (arrays map to fullPath lists)
 * and passes any other key through to the raw workspace configuration. Writes
 * are forwarded to `workspace.update`. This shape-shifting behavior is the
 * module's single responsibility; keep it here and document new key shapes.
 */

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
let bNoEvents = false;

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

/** @returns {boolean} True while configuration-change handling is suppressed. */
function isNoEvents() {
  return bNoEvents;
}

/** Re-read the workspace configuration after a change event. */
function refreshData() {
  conf.data = workspace.getConfiguration('autoit');
}

/** Invoke every registered listener, surfacing listener failures to the user. */
function notifyListeners() {
  listeners.forEach(listener => {
    try {
      listener();
    } catch (er) {
      window.showErrorMessage(er);
    }
  });
}

export {
  conf,
  config,
  addListener,
  removeListener,
  noEvents,
  isNoEvents,
  refreshData,
  notifyListeners,
};
