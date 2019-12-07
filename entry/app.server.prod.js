/**
 * @file 生产环境的server文件
 */
const serverRender = require('vue-server-renderer');
const fs = require('fs');
const path = require('path');
const app = require('./app');

// 注入到全局
function registerGlobal(app) {
  const ssrPath = path.resolve(
    __dirname,
    '../output/vue-ssr-server-bundle.json',
  );
  const htmlPath = path.resolve(
    __dirname,
    '../output/static/index.template.html',
  );
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const clientJson = require('../static/dist/vue-ssr-client-manifest');
  app.context.render = serverRender.createBundleRenderer(ssrPath, {
    template: html,
    runInNewContext: false,
    clientManifest: clientJson,
  });
}

registerGlobal(app);
