/**
 * @file webpack的前端编译配置信息-生产
 **/
const BaseWebpack = require('./webpack.base');
const merge = require('webpack-merge');
const utils = require('./util');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const compilerEnv = require('../config/compile');
const path = require('path');

const StyleLoader = utils.registerLoader('production');

module.exports = merge(BaseWebpack, {
  mode: 'production',

  output: {
    filename: 'main.min.js',
    chunkFilename: 'chunk/[name].chunk.min.js?_t=[chunkhash]',
  },

  module: {
    rules: StyleLoader,
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style/[name].[hash].css',
      chunkFilename: 'style/[id].[hash].css',
    }),
    new webpack.DllReferencePlugin({
      manifest: require('../output/static/dll/vendor-manifest.json'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.template.html',
      template: path.resolve(__dirname, compilerEnv.htmlPath),
    }),
  ],

  resolve: {
    alias: {
      vue: 'vue/dist/vue.runtime.min.js',
    },
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
});
