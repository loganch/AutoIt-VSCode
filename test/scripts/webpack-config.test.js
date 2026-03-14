describe('webpack.config.js', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }
    jest.resetModules();
  });

  function loadConfigWithEnv(nodeEnv) {
    if (nodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = nodeEnv;
    }
    jest.resetModules();
    return require('../../webpack.config.js');
  }

  it('uses development mode and inline source maps by default', () => {
    const config = loadConfigWithEnv(undefined);

    expect(config.mode).toBe('development');
    expect(config.devtool).toBe('inline-source-map');
    expect(config.target).toBe('node');
  });

  it('uses production mode and source-map when NODE_ENV=production', () => {
    const config = loadConfigWithEnv('production');

    expect(config.mode).toBe('production');
    expect(config.devtool).toBe('source-map');
    expect(config.optimization.minimize).toBe(true);
  });

  it('defines expected externals and babel-loader configuration', () => {
    const config = loadConfigWithEnv('development');

    expect(config.externals).toMatchObject({
      vscode: 'commonjs vscode',
      'jsonc-parser': 'commonjs jsonc-parser',
    });

    const [rule] = config.module.rules;
    expect(rule.use.loader).toBe('babel-loader');
    expect(rule.use.options.configFile).toMatch(/babel\.config\.json$/);
  });
});