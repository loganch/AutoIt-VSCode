// Facade for the AutoIt configuration subsystem. The concerns live in focused
// modules; this file keeps the historical default-export shape so the ~30
// importers are unaffected:
//   - configStore.js    — configuration data, `config` Proxy, listener registry
//   - pathResolution.js — path resolution/verification, include search
//   - tokenColorMigration.js — one-shot editor token-color migration (init)
import { workspace } from 'vscode';
import {
  addListener,
  removeListener,
  noEvents,
  isNoEvents,
  refreshData,
  notifyListeners,
  config,
} from './configStore';
import { getPaths, updateIncludePaths, findFilepath, refreshPaths } from './pathResolution';
import { init as initTokenColors } from './tokenColorMigration';

/**
 * Explicit init gate (F17): getPaths() can write global config (the legacy
 * smartHelp array gets migrated via upgradeSmartHelpConfig), so — like the
 * token-color migration — it must not run merely from importing this module.
 * Called once from extension.js's `activate()`.
 */
function init() {
  initTokenColors();
  getPaths();
}

/**
 * Registers the `autoit.*` config-change listener and returns its Disposable
 * so extension.js can tie its lifetime to the extension via ctx.subscriptions,
 * instead of it living for the process lifetime as an import-time side effect.
 * @returns {import('vscode').Disposable}
 */
function registerConfigListener() {
  return workspace.onDidChangeConfiguration(({ affectsConfiguration }) => {
    if (isNoEvents() || !affectsConfiguration('autoit')) return;

    refreshData();

    if (affectsConfiguration('autoit.includePaths')) {
      updateIncludePaths();
    }

    notifyListeners();
    refreshPaths();
  });
}

export default {
  config,
  init,
  registerConfigListener,
  addListener,
  removeListener,
  noEvents,
  findFilepath,
};
