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

const cache = {
  clientContent: '',
  serverContent: '',
};

// 客户端webpack配置实例
const clientWebpackIns = webpack(clientConfig);

// 服务端webpack配置实例
ssrConfig.mode = 'development';
const serverWebpackIns = webpack(ssrConfig);

// 热更新
function hotModuleReplace() {
  // 生成对应的中间件
  koaWebpack({
    compiler: clientWebpackIns,
    devMiddleware: {
      publicPath: clientConfig.output.publicPath,
      serverSideRender: true,
    },
  })
    .then(hotReloadMW => {
      // 热更新组件，内部可以读取静态资源
      app.use(hotReloadMW);

      listenClientDone(hotReloadMW);

      serverWatch();
    })
    .catch(e => {
      console.log('error', e);
    });
}

// 客户端监听完成
function listenClientDone(hotReloadMW) {
  // 监听client配置编译完成
  clientWebpackIns.hooks.done.tap('BuildStatsPlugin', () => {
    const fileSystem = hotReloadMW.devMiddleware.fileSystem;
    const clientPath = path.resolve(
      __dirname,
      '../output/static/vue-ssr-client-manifest.json',
    );
    cache.clientContent = fileSystem.readFileSync(clientPath, 'utf-8');
    if (cache.serverContent) {
      renderContent();
    }
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
    cache.serverContent = mfs.readFileSync(
      path.resolve(__dirname, '../output/vue-ssr-server-bundle.json'),
      'utf-8',
    );
    if (cache.clientContent) {
      renderContent();
    }
  });
}

// 重新定义html
function getDevHtml() {
  const html = fs.readFileSync(
    path.resolve(__dirname, '../index.template.html'),
    'utf-8',
  );
  const htmlArr = [];
  const htmlStart = html.split('<!--prod-env-start-->')[0];
  const htmlEnd = html.split('<!--prod-env-end-->')[1];
  htmlArr.push(htmlStart);
  htmlArr.push(htmlEnd);
  return htmlArr.join('\n');
}

// 重新定义render方法
function renderContent() {
  const { clientContent, serverContent } = cache;
  const html = getDevHtml();
  app.context.originHtml = html;
  app.context.render = ssr.createBundleRenderer(JSON.parse(serverContent), {
    runInNewContext: false,
    template: html,
    clientManifest: JSON.parse(clientContent),
  });
}

hotModuleReplace();
