/**
 * @file dev环境日志中心
 */
import moment from 'moment';
import KoaLogger from 'koa-logger';

function loggerFormat(str, args) {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  const date = moment().format('YYYY-MM-DD HH:mm:ss');
  console.log(date + str);
}

export default KoaLogger(loggerFormat);
