/**
 * @file 用户行为日志展示-自动打印
 */
import moment from 'moment';
import { get, isString } from 'lodash';

let logger;
if (process.env.NODE_ENV === 'production') {
  logger = async (ctx, next) => {
    const url = get(ctx, 'request.url');
    const method = get(ctx, 'method', 'get');
    let body = get(ctx, `request.${method === 'get' ? 'query' : 'body'}`, {});
    const header = get(ctx, 'request.header', {});
    try {
      // 请求日志
      ctx.logger.api({
        type: 'wait',
        msg: `url ${url} body ${JSON.stringify(body)} header ${JSON.stringify(header)}`,
        startTime: ctx.statistics.requestTime,
        endTime: Date.now(),
      });
      await next();
      // 响应日志
      let response = get(ctx, 'response.body');
      if (isString(response) && response.indexOf('DOCTYPE') !== -1) {
        response = '';
      }
      ctx.logger.api({
        type: 'success',
        msg: `url ${url} body ${JSON.stringify(body)} header ${JSON.stringify(header)} response ${JSON.stringify(response)}`,
        startTime: ctx.statistics.requestTime,
        endTime: Date.now(),
      });
    } catch (err) {
      // 错误日志
      ctx.logger.api({
        type: 'error',
        msg: `url ${url} body ${JSON.stringify(body)} header ${JSON.stringify(header)}`,
        startTime: ctx.statistics.requestTime,
        endTime: Date.now(),
        error: err,
      });
    }
  };
} else {
  const KoaLogger = require('koa-logger');
  // dev环境的日志输出
  const loggerFormatForDev = (str, args) => {
    const date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    console.log(date + str);
  };
  logger = KoaLogger(loggerFormatForDev);
}

export const Logger = logger;
