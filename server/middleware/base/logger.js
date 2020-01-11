/**
 * @file 用户行为日志展示-自动打印
 */
import moment from 'moment';
import KoaLogger from 'koa-logger';

// dev环境的日志输出
function loggerFormatForDev(str, args) {
  const date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  console.log(date + str);
}

let logger;
if (process.env.NODE_ENV === 'production') {
  // todo: 添加log4js
  logger = async (ctx, next) => {
    await next();
  };
} else {
  logger = KoaLogger(loggerFormatForDev);
}

export const Logger = logger;
