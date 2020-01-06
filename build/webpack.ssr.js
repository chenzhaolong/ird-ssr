/**
 * @file webpack的ssr编译配置信息
 * todo:css样式不能在ssr编译的时候加入
 **/

const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpackUtils = require('./util');

// webpack公共配置模板
const webpackTpl = {
  entry: './entry/app.ssr.js',
  target: 'node',
  devtool: 'source-map',
  output: {
    filename: 'ssr-bundle.js',
    path: path.resolve(__dirname, '../output/'),
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.(png|jpg|svg|gif|ttf|woff|woff2)$/,
        loader: 'file-loader',
        query: {
          name: 'img/[name].[ext]?[hash]',
        },
      },
    ],
  },
  externals: nodeExternals({
    whitelist: /\.css$/,
  }),
  plugins: [new VueLoaderPlugin(), new VueSSRServerPlugin()],
};

module.exports = webpackUtils.getSSRWebpackConfig(webpackTpl);
