/**
 * @file webpack的前端编译配置信息
 **/
const path = require('path');
const webpack = require('webpack');
const compilerEnv = require('../config/compile').client.env;
const webpackUtils = require('./util');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

// webpack公共配置模板
const webpackTpl = {
  entry: {
    main: path.resolve(__dirname, '../entry/app.client.js'),
  },

  output: {
    path: path.resolve(__dirname, '../output/static/'),
    publicPath: '/output/static/',
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

  plugins: [
    new VueLoaderPlugin(),

    new VueSSRClientPlugin(),

    new FriendlyErrorsWebpackPlugin(),

    new webpack.DllReferencePlugin({
      manifest: require('../output/static/dll/vendor-manifest.json'),
    }),
  ],

  resolve: {
    alias: {
      components: path.resolve(__dirname, '../client/components'),
      tools: path.resolve(__dirname, '../client/utils'),
      service: path.resolve(__dirname, '../client/service'),
    },

    extensions: ['.js', '.css', '.vue'],
  },

  optimization: {},
};

let compiler = {};
if (compilerEnv === 'production') {
  compiler = webpackUtils.getProdWebpackConfig(webpackTpl);
} else {
  compiler = webpackUtils.getDevWebpackConfig(webpackTpl);
}

module.exports = compiler;
