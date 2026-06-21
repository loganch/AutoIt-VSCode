describe('webpack.config.js', () => {
  afterEach(() => {
    jest.resetModules();
  });

  function loadConfig(mode = 'development') {
    jest.resetModules();
    const configFactory = require('../../webpack.config.js');
    return configFactory({}, { mode });
  }

  it('uses development mode and inline source maps by default', () => {
    const config = loadConfig('development');

    expect(config.mode).toBe('development');
    expect(config.devtool).toBe('inline-source-map');
    expect(config.target).toBe('node');
  });

  it('uses production mode and source-map when mode=production', () => {
    const config = loadConfig('production');

    expect(config.mode).toBe('production');
    expect(config.devtool).toBe('source-map');
    expect(config.optimization.minimize).toBe(true);
  });

  it('defines expected externals and babel-loader configuration', () => {
    const config = loadConfig('development');

    expect(config.externals).toMatchObject({
      vscode: 'commonjs vscode',
      'jsonc-parser': 'commonjs jsonc-parser',
    });

    const [rule] = config.module.rules;
    expect(rule.use.loader).toBe('babel-loader');
    expect(rule.use.options.configFile).toMatch(/babel\.config\.json$/);
  });
});
