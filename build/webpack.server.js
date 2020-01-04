/** * @file webpack的后端编译配置信息 */

const path = require('path');
const webpackUtils = require('./util');

const webpackTpl = {
  context: path.resolve(__dirname, '../'),
  mode: 'production',
  target: 'node',
  devtool: false,
  entry: ['babel-polyfill', './entry/app.server.prod.js'],
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, '../output'),
    libraryTarget: 'commonjs2',
  },
  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
};

module.exports = webpackUtils.getServerProdWebpackConfig(webpackTpl);
