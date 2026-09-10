import { workspace } from 'vscode';

import meta from '../../package.json';

/**
 * Fix the output style of the extension
 * #209
 * @link https://github.com/microsoft/vscode/issues/201603
 */
function migrateTokenColorDefaults() {
  try {
    const cConfig = workspace.getConfiguration('editor');
    const dataNew = {};
    let save = false;

    // Safely read token color defaults from package.json (guard for packaging changes)
    const cfgDefaults =
      meta?.contributes?.configurationDefaults?.['editor.tokenColorCustomizations'];

    if (!cfgDefaults?.textMateRules?.length) {
      // nothing to add, skip
      return;
    }

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
  } catch (error) {
    // Log only to console to keep activation resilient without hiding diagnostics.
    // Log the message only — the error object may carry settings context.
    console.debug(
      '[autoit] Failed to update tokenColorCustomizations defaults:',
      error?.message ?? error,
    );
  }
}

let initialized = false;

/**
 * Runs the token-color-customization migration, which writes global
 * workspace config. Kept out of module load so merely importing this file
 * (e.g. from a test) can't mutate the user's workspace settings — see F17
 * in docs/tech-debt-assessment.md. Call explicitly from `activate`.
 */
function init() {
  if (initialized) return;
  initialized = true;
  migrateTokenColorDefaults();
}

export { init };
