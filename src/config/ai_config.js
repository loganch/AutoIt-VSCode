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
  setSuppressEvents,
  isNoEvents,
  refreshData,
  notifyListeners,
  config,
} from './configStore';
import { resolvePaths, updateIncludePaths, findFilePath, refreshPaths } from './pathResolution';
import { init as initTokenColors } from './tokenColorMigration';

/**
 * Explicit init gate (F17): resolvePaths() can write global config (the legacy
 * smartHelp array gets migrated via upgradeSmartHelpConfig), so — like the
 * token-color migration — it must not run merely from importing this module.
 * Called once from extension.js's `activate()`.
 */
function init() {
  initTokenColors();
  resolvePaths();
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

// findFilePath's public seam: provider/command-layer callers should import
// this facade's `findFilePath`, not pathResolution.js directly. The two
// exceptions are utils/functionSignature.js and utils/includeResolution.js,
// which import pathResolution.js's findFilePath directly on purpose — routing
// the utils layer through this stateful config facade would be a step
// backward for layering, not an improvement (see includeResolution.js's own
// layering-contract comment for that reasoning).
export default {
  config,
  init,
  registerConfigListener,
  addListener,
  removeListener,
  setSuppressEvents,
  findFilePath,
};
