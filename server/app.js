/**
 * @file 后端应用聚合层
 */
import { beforeBizMW, afterBizMW } from './middleware/base';
import rTracer from 'cls-rtracer';
import ErrorHandle from './utils/errorHandle';
import staticServer from 'koa-static';

const path = require('path');
const Koa = require('koa');
const LoggerUtils = require('./utils/loggerUtils');
const config = require('../config/env').server;
const port = process.env.NODE_ENV === 'production' ? config.port.production : config.port.development;

const app = new Koa();

/*** 日志能力注入 *****/
app.context.logger = LoggerUtils;

/*** 定义接口返回结构 ***/
app.context.makeBody = function(response, code, msg) {
  return {
    code: code || 200,
    data: response,
    msg: msg || 'success',
  };
};

/*** 错误处理注入 *****/
// ErrorHandle.replace(async (ctx, next) => {
//   await next();
//   ctx.logger.info({msg: 'here'});
// });

/*** 静态资源 *****/
const staticPath = path.resolve(__dirname, '../');
const resource = staticServer(staticPath);
app.use(resource);

/**** 跟踪id注入 ****/
app.use(
  rTracer.koaMiddleware({
    useHeader: true,
    headerName: config.requestID,
  }),
);

/*** 业务中间件注册之前 *****/
beforeBizMW(app);

/*** 业务中间件逻辑 *****/

/*** 业务中间件逻辑 *****/

/*** 业务中间件注册之后 *****/
afterBizMW(app);

app.listen(port, () => {
  console.log(`Server startup, listen at ${port}.`);
});

export default app;
