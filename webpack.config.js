const path = require('path');

/** @type {(env: unknown, argv: { mode?: string }) => import('webpack').Configuration} */
module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    target: 'node',
    mode: isProd ? 'production' : 'development',
    entry: './src/extension.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'extension.js',
      library: { type: 'commonjs2' },
      devtoolModuleFilenameTemplate: '../[resource-path]',
      clean: true,
    },
    // Inline source maps for development (best for VS Code extension debugging);
    // external .map file for production so the shipped .vsix stays small.
    devtool: isProd ? 'source-map' : 'inline-source-map',
    externals: {
      vscode: 'commonjs vscode',
      'jsonc-parser': 'commonjs jsonc-parser',
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      mainFields: ['main', 'module'],
    },
    module: {
      rules: [
        {
          test: /.(js|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(__dirname, 'babel.config.json'),
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        },
      ],
    },
    optimization: {
      minimize: isProd,
      usedExports: true,
      sideEffects: false,
      splitChunks: false,
      concatenateModules: true,
    },
    performance: { hints: false },
    stats: { errorDetails: true, colors: true },
    infrastructureLogging: { level: 'warn' },
  };
};
