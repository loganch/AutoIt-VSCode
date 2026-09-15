import { workspace } from 'vscode';
import { handleError } from '../errorUtils';

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

/**
 * @typedef {Object} AutoItConfig - Shape of the `config` Proxy exported below.
 *   The `*Path`/`includePaths`/`smartHelp` keys resolve to the matching
 *   `defaultPaths` entry's `fullPath` (or `fullPath` list, for `includePaths`);
 *   every other key -- including settings not listed here -- passes through
 *   to the raw `autoit` workspace configuration, so this typedef documents
 *   the keys this codebase actually reads rather than an exhaustive contract.
 * All properties are optional here since real config objects only ever
 * carry the keys their configured/detected paths and workspace settings
 * happen to produce, and tests commonly construct partial config mocks.
 * @property {string} [aiPath] - Resolved path to AutoIt3.exe.
 * @property {string} [wrapperPath] - Resolved path to AutoIt3Wrapper.au3.
 * @property {string} [checkPath] - Resolved path to AU3Check.exe.
 * @property {string} [helpPath] - Resolved path to AutoIt3Help.exe.
 * @property {string} [infoPath] - Resolved path to Au3Info.exe.
 * @property {string} [kodaPath] - Resolved path to Koda's FD.exe.
 * @property {string[]} [includePaths] - Resolved fullPath for each configured include path.
 * @property {Object.<string, {chmPath: string, udfPath: string[]}>} [smartHelp] - Resolved smartHelp entries keyed by UDF function prefix.
 * @property {boolean} [enableDiagnostics] - Whether Au3Check diagnostics are enabled.
 * @property {string} [consoleParams] - Extra console parameters passed to AutoIt3Wrapper.
 * @property {boolean} [multiOutput] - Whether per-process output channels are shown.
 * @property {boolean} [multiOutputReuseOutput] - Whether multi-output reuses one channel.
 * @property {number} [multiOutputFinishedTimeout] - Delay before a finished multi-output channel is auto-closed.
 * @property {number} [multiOutputMaxFinished] - Max finished multi-output channels kept open.
 * @property {string} [multiOutputShowProcessId] - How process IDs are prefixed in multi-output ('Multi'|'None'|other).
 * @property {string} [outputShowTime] - When to prefix output lines with a timestamp ('Process'|'Global'|'All').
 * @property {string} [outputCodePage] - Code page used to decode process output.
 * @property {number} [outputMaxHistoryLines] - Max lines kept in the AutoIt output channel.
 * @property {boolean} [clearOutput] - Whether output is cleared before each run.
 * @property {(key: string, defaultValue?: any) => any} [get] - Pass-through to the raw workspace configuration's `get`.
 * @property {(key: string, value: any) => void} [update] - Pass-through to the raw workspace configuration's `update`.
 */

// `data` is resolved lazily via a getter (not at module-import time) so
// merely importing this module never calls the VS Code API before the
// extension host is ready — the same discipline completionTransforms.js and
// debugLog.js already apply.
let _data = null;

const conf = {
  get data() {
    if (_data === null) {
      _data = workspace.getConfiguration('autoit');
    }
    return _data;
  },
  set data(value) {
    _data = value;
  },
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
let suppressEvents = false;

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

/**
 * Sets whether configuration-change handling is suppressed.
 * @param {boolean} suppress - True to suppress events, false to re-enable them.
 * @returns {void}
 */
function setSuppressEvents(suppress) {
  suppressEvents = Boolean(suppress);
}

/** @returns {boolean} True while configuration-change handling is suppressed. */
function areEventsSuppressed() {
  return suppressEvents;
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
      handleError('configuration listener', er, true);
    }
  });
}

export {
  conf,
  config,
  addListener,
  removeListener,
  setSuppressEvents,
  areEventsSuppressed,
  refreshData,
  notifyListeners,
};
