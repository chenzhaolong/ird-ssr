/**
 * @file dev环境日志中心
 * todo：优化开发环境中的日志展示
 */
import moment from 'moment';
import KoaLogger from 'koa-logger';

function loggerFormat(str, args) {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  const date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  console.log(date + str);
}

export default KoaLogger(loggerFormat);
