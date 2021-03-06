/**
 * @file webpack的前端编译配置信息-开发
 **/
const BaseWebpack = require('./webpack.base');
const merge = require('webpack-merge');
const utils = require('./util');
const path = require('path');

const StyleLoader = utils.registerLoader('development');

module.exports = merge(BaseWebpack, {
  mode: 'development',

  entry: [
    'webpack-hot-client/client',
    path.resolve(__dirname, '../entry/app.client.js'),
  ],

  output: {
    filename: 'main.js',
    chunkFilename: 'chunk/[name].chunk.js?_t=[chunkhash]',
  },

  devtool: 'inline-source-map',

  module: {
    rules: StyleLoader,
  },
});
