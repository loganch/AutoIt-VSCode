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
import { init } from './tokenColorMigration';

workspace.onDidChangeConfiguration(({ affectsConfiguration }) => {
  if (isNoEvents() || !affectsConfiguration('autoit')) return;

  refreshData();

  if (affectsConfiguration('autoit.includePaths')) {
    updateIncludePaths();
  }

  notifyListeners();
  refreshPaths();
});

getPaths();

export default {
  config,
  init,
  addListener,
  removeListener,
  noEvents,
  findFilepath,
};
