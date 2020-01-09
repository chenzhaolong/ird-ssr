/** *
 * @file app的后端入口
 * */

// 提供转化成es5的语法
require('babel-polyfill');

// 对于node的错误跟钟映射表
require('source-map-support').install();

// require注册hook
require('babel-register')();

const app = require('../server/app').default;
const clientConfig = require('../build/webpack.client.dev');
const ssrConfig = require('../build/webpack.ssr');
const webpack = require('webpack');
const koaWebpack = require('koa-webpack');
const fs = require('fs');
const memFs = require('memory-fs');
const path = require('path');
const ssr = require('vue-server-renderer');
const colors = require('colors');
const config = require('../config/compile');
const serverConfig = require('../config/env').server;

const cache = {
  clientContent: '',
};

// 客户端webpack配置实例
const clientWebpackIns = webpack(clientConfig);

// 服务端webpack配置实例
ssrConfig.mode = 'development';
const serverWebpackIns = webpack(ssrConfig);

// 热更新
async function hotModuleReplace() {
  // 生成对应的中间件
  const hotReloadMW = await koaWebpack({
    compiler: clientWebpackIns,
    devMiddleware: {
      publicPath: clientConfig.output.publicPath,
      serverSideRender: true,
    },
  });

  app.use(hotReloadMW);
  app.use((ctx, next) => {
    const stats = ctx.state.webpackStats.toJson();
    stats.warnings.forEach(warning => {
      console.log(colors.yellow(`warning: ${warning}`));
    });
    if (stats.errors.length) {
      stats.errors.forEach(error => {
        console.log(colors.red(`error: ${error}`));
      });
      return;
    }
    next();
  });

  // 监听client配置编译完成
  clientWebpackIns.hooks.done.tap('BuildStatsPlugin', () => {
    const fileSystem = hotReloadMW.devMiddleware.fileSystem;
    const clientPath = path.resolve(
      __dirname,
      '../output/static/vue-ssr-client-manifest.json',
    );
    cache.clientContent = fileSystem.readFileSync(clientPath, 'utf-8');
    serverWatch();
  });
}

// 服务端监听
function serverWatch() {
  const mfs = new memFs();
  serverWebpackIns.outputFileSystem = mfs;
  serverWebpackIns.watch({}, (err, stats) => {
    if (err) {
      throw err;
    }
    const statsJson = stats.toJson();
    if (statsJson.errors.length) {
      statsJson.errors.forEach(err => {
        console.log(colors.red(`error: ${err}`));
      });
      return;
    }
    let serverContent = mfs.readFileSync(
      path.resolve(__dirname, '../output/vue-ssr-server-bundle.json'),
      'utf-8',
    );
    const html = getDevHtml();
    app.context.originHtml = html;
    app.context.render = ssr.createBundleRenderer(JSON.parse(serverContent), {
      runInNewContext: false,
      template: html,
      clientManifest: JSON.parse(cache.clientContent),
    });
  });
}

// 重新定义html
function getDevHtml() {
  // const {dll} = config;
  const html = fs.readFileSync(
    path.resolve(__dirname, '../index.template.html'),
    'utf-8',
  );
  // const dllProdName = env.dll.prod.filter(item => item.name);
  // dllProdName.forEach(name => {
  //   html.replace(name, "");
  // });
  return html;
}

function run() {
  hotModuleReplace()
    .then(() => {
      console.log('success');
    })
    .catch(e => {
      console.log('error');
    });
}

run();
