/**
 * Migrates the legacy array-based `smartHelp` setting to the current
 * object-keyed-by-prefix shape, preserving the setting's original scope
 * (workspace folder / workspace / global / default).
 * @param {object} confData - the `autoit` configuration object (workspace.getConfiguration('autoit'))
 */
export function upgradeSmartHelpConfig(confData) {
  const data = confData.smartHelp;
  const inspect = confData.inspect('smartHelp');
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

  confData.update('smartHelp', ret, ConfigurationTarget, overrideInLanguage);
}
