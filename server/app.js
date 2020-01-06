/**
 * @file 后端应用聚合层
 */
import { beforeBizMW, afterBizMW } from './middleware/base';
import staticServer from 'koa-static';

const path = require('path');
const Koa = require('koa');
const app = new Koa();
const config = require('../config/env').server;
const port =
  process.env.NODE_ENV === 'production'
    ? config.port.production
    : config.port.development;

// 静态资源
const staticPath = path.resolve(__dirname, '../');
const resource = staticServer(staticPath);
app.use(resource);

// 业务中间件注册之前
beforeBizMW(app);

/*** 业务中间件逻辑 *****/

/*** 业务中间件逻辑 *****/

// 业务中间件注册之后
afterBizMW(app);

app.listen(port, () => {
  console.log(`Server startup, listen at ${port}.`);
});

export default app;
