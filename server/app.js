/**
 * @file 后端应用聚合层
 */

import bodyParse from 'koa-bodyparser';
import compress from 'koa-compress';
import staticServer from 'koa-static';
import SSRRender from './middleware/serverRender';

const path = require('path');
const Koa = require('koa2');
const app = new Koa();

// 静态资源
const staticPath = path.resolve(__dirname, '../');
const resource = staticServer(staticPath);

// 中间件注册
app.use(bodyParse);
app.use(compress);
app.use(resource);
app.use(SSRRender);

export default app;
