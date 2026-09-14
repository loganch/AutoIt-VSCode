jest.mock('vscode', () => ({}));

import { migrateSmartHelpConfig } from '../../src/config/smartHelpMigrator';

const makeConf = (smartHelp, inspectResult = {}) => ({
  smartHelp,
  inspect: jest.fn(() => inspectResult),
  update: jest.fn(),
});

describe('migrateSmartHelpConfig', () => {
  test('migrates array entries to the object-keyed-by-prefix shape', () => {
    const conf = makeConf([
      ['_ArrayDisplay', 'C:\\help\\array.chm', 'C:\\udf\\array.au3'],
      ['_GUICtrl', 'C:\\help\\gui.chm', 'C:\\udf\\gui.au3|C:\\udf\\gui2.au3'],
    ]);

    migrateSmartHelpConfig(conf);

    expect(conf.update).toHaveBeenCalledWith(
      'smartHelp',
      {
        _ArrayDisplay: { chmPath: 'C:\\help\\array.chm', udfPath: ['C:\\udf\\array.au3'] },
        _GUICtrl: {
          chmPath: 'C:\\help\\gui.chm',
          udfPath: ['C:\\udf\\gui.au3', 'C:\\udf\\gui2.au3'],
        },
      },
      undefined,
      undefined,
    );
  });

  test('clears the setting when the migrated result is empty', () => {
    const conf = makeConf([]);

    migrateSmartHelpConfig(conf);

    expect(conf.update).toHaveBeenCalledWith('smartHelp', undefined, undefined, undefined);
  });

  test('clears the setting when smartHelp is a legacy string', () => {
    const conf = makeConf('some-legacy-string');

    migrateSmartHelpConfig(conf);

    expect(conf.update).toHaveBeenCalledWith('smartHelp', undefined, undefined, undefined);
  });

  test('preserves the scope from inspect() using the props priority order', () => {
    const conf = makeConf([['_X', 'a.chm', 'b.au3']], {
      workspaceValue: { keys: [] },
    });

    migrateSmartHelpConfig(conf);

    expect(conf.update).toHaveBeenCalledWith(
      'smartHelp',
      { _X: { chmPath: 'a.chm', udfPath: ['b.au3'] } },
      false,
      undefined,
    );
  });

  test('passes overrideInLanguage for language-scoped settings', () => {
    const conf = makeConf([['_X', 'a.chm', 'b.au3']], {
      globalLanguageValue: { keys: [] },
    });

    migrateSmartHelpConfig(conf);

    expect(conf.update).toHaveBeenCalledWith(
      'smartHelp',
      { _X: { chmPath: 'a.chm', udfPath: ['b.au3'] } },
      true,
      true,
    );
  });

  test('leaves object-shaped settings untouched but still updates', () => {
    const conf = makeConf({ _X: { chmPath: 'a.chm', udfPath: ['b.au3'] } });

    migrateSmartHelpConfig(conf);

    expect(conf.update).toHaveBeenCalledWith('smartHelp', undefined, undefined, undefined);
  });
});
