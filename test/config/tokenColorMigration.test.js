jest.mock('../../package.json', () => ({
  contributes: {
    configurationDefaults: {
      'editor.tokenColorCustomizations': {
        textMateRules: [
          { scope: 'autoit-scope-a', settings: { foreground: '#111111' } },
          { scope: 'autoit-scope-b', settings: { foreground: '#222222' } },
        ],
      },
    },
  },
}));

const makeConfig = tokenColorCustomizations => ({
  get: jest.fn(key => (key === 'tokenColorCustomizations' ? tokenColorCustomizations : undefined)),
  update: jest.fn(),
});

describe('migrateTokenColorDefaults (via init)', () => {
  let mockGetConfiguration;

  beforeEach(() => {
    jest.resetModules();
    mockGetConfiguration = jest.fn();
    jest.doMock('vscode', () => ({
      workspace: { getConfiguration: (...args) => mockGetConfiguration(...args) },
    }));
  });

  const loadInit = () => require('../../src/config/tokenColorMigration').init;

  test('adds all default rules when tokenColorCustomizations is empty', () => {
    const cConfig = makeConfig({});
    mockGetConfiguration.mockReturnValue(cConfig);

    loadInit()();

    expect(mockGetConfiguration).toHaveBeenCalledWith('editor');
    expect(cConfig.update).toHaveBeenCalledWith(
      'tokenColorCustomizations',
      {
        textMateRules: [
          { scope: 'autoit-scope-a', settings: { foreground: '#111111' } },
          { scope: 'autoit-scope-b', settings: { foreground: '#222222' } },
        ],
      },
      true,
    );
  });

  test('leaves a user rule that already overrides a default scope untouched, but adds the missing one', () => {
    const cConfig = makeConfig({
      textMateRules: [{ scope: 'autoit-scope-a', settings: { foreground: '#custom' } }],
    });
    mockGetConfiguration.mockReturnValue(cConfig);

    loadInit()();

    expect(cConfig.update).toHaveBeenCalledWith(
      'tokenColorCustomizations',
      {
        textMateRules: [
          { scope: 'autoit-scope-a', settings: { foreground: '#custom' } },
          { scope: 'autoit-scope-b', settings: { foreground: '#222222' } },
        ],
      },
      true,
    );
  });

  test('does not write when every default rule already has a user override', () => {
    const cConfig = makeConfig({
      textMateRules: [
        { scope: 'autoit-scope-a', settings: { foreground: '#custom-a' } },
        { scope: 'autoit-scope-b', settings: { foreground: '#custom-b' } },
      ],
    });
    mockGetConfiguration.mockReturnValue(cConfig);

    loadInit()();

    expect(cConfig.update).not.toHaveBeenCalled();
  });

  test('only runs the migration once per activation (initialized guard)', () => {
    const cConfig = makeConfig({});
    mockGetConfiguration.mockReturnValue(cConfig);

    const init = loadInit();
    init();
    init();

    expect(cConfig.update).toHaveBeenCalledTimes(1);
  });

  test('does not throw when workspace.getConfiguration itself throws', () => {
    mockGetConfiguration.mockImplementation(() => {
      throw new Error('no workspace');
    });

    expect(() => loadInit()()).not.toThrow();
  });
});
