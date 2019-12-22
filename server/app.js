/**
 * @file 后端应用聚合层
 */

import bodyParse from 'koa-bodyparser';
import compress from 'koa-compress';
import staticServer from 'koa-static';
import statistics from './middleware/base/statistics';
import Logger from './middleware/base/logger';
import Router from './middleware/base/router';
import SSRRender from './middleware/base/serverRender';

const path = require('path');
const Koa = require('koa2');
const app = new Koa();

// 静态资源
const staticPath = path.resolve(__dirname, '../output/static/');
const resource = staticServer(staticPath);

// 中间件注册
app.use(resource);
app.use(bodyParse);
app.use(compress);
app.use(statistics);
app.use(Logger);
app.use(Router.routes());
app.use(Router.allowedMethods());
app.use(SSRRender);

export default app;
