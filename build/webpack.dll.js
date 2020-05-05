/**
 * @file webpack的dll编译配置信息
 **/
const path = require('path');
const webpack = require('webpack');
const colors = require('colors');

console.log('env:', colors.green(process.env.NODE_ENV));

module.exports = {
  mode: process.env.NODE_ENV,

  entry: {
    vendor: ['vue', 'vue-router', 'vuex', 'axios', 'moment'],
  },

  output: {
    path: path.resolve(__dirname, '../output/static/dll/'),
    filename: '[name].dll.js',
    library: '[name]_library',
  },

  plugins: [
    new webpack.DllPlugin({
      name: '[name]_library',
      path: path.join(__dirname, '../output/static/dll', '[name]-manifest.json'),
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
};
