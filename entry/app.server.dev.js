/** * @file app的后端入口 */
// 提供转化成es5的语法
require('babel-polyfill');

// 对于node的错误跟钟映射表
require('source-map-support').install();

// require注册hook
require('babel-register')();

const app = require('../server/app').default;
const clientWebpack = require('../build/webpack.client');
const webpack = require('webpack');
const koaWebpack = require('koa-webpack');
const server = require('../config/env').server;

// client HMR
async function clientHMR() {
  const config = {
    compiler: webpack(clientWebpack),
    devMiddleware: {
      // serverSideRender: server.ssr,
      noInfo: false,
      publicPath: clientWebpack.output.publicPath,
      stats: 'minimal',
    },
  };
  const middleWare = await koaWebpack(config);
  app.use(middleWare);
}

clientHMR();
