const path = require('path');

/** @type {import('webpack').Configuration} */
const config = {
  target: 'node',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/extension.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    library: { type: 'commonjs2' },
    devtoolModuleFilenameTemplate: '../[resource-path]',
    clean: true,
  },
  // Use inline source maps in development (best for VS Code extension debugging),
  // and external source maps in production.
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
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
    minimize: process.env.NODE_ENV === 'production',
    usedExports: true,
    sideEffects: false,
    splitChunks: false,
    concatenateModules: true,
  },
  performance: { hints: false },
  stats: { errorDetails: true, colors: true },
  infrastructureLogging: { level: 'warn' },
};

module.exports = config;
