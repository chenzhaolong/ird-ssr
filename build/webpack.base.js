/**
 * @file 客户端编译基础模板
 */
const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = {
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
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]',
          outputPath: 'images/',
          esModule: false,
        },
      },
    ],
  },

  plugins: [
    new VueLoaderPlugin(),

    new VueSSRClientPlugin(),

    new FriendlyErrorsWebpackPlugin(),
  ],

  resolve: {
    alias: {
      components: path.resolve(__dirname, '../client/components'),
      tools: path.resolve(__dirname, '../client/utils'),
      service: path.resolve(__dirname, '../client/service'),
    },

    extensions: ['.js', '.css', '.vue'],
  },
};
