/**
 * @file 后端应用聚合层
 */
import { beforeBizMW, afterBizMW } from './middleware/base';
import staticServer from 'koa-static';

const path = require('path');
const Koa = require('koa2');
const app = new Koa();

// 静态资源
const staticPath = path.resolve(__dirname, '../output/static/');
const resource = staticServer(staticPath);
app.use(resource);

// 业务中间件注册之前
beforeBizMW(app);

/*** 业务中间件逻辑 *****/

/*** 业务中间件逻辑 *****/

// 业务中间件注册之后
afterBizMW(app);

export default app;
