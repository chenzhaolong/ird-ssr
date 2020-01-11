/**
 * @file 日志工具
 * info：普通
 * error：错误
 * warn：警告
 * ssr：服务端渲染
 * api：api层
 * todo: log4js还没开发
 */
import moment from 'moment';
import colors from 'colors';

const isProd = process.env.NODE_ENV === 'production';

const { red, green, yellow, blue, magenta, cyan } = colors;

const formatTime = time => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss.SSS');
};

const message = msg => {
  return typeof msg === 'string' ? msg : JSON.stringify(msg);
};

module.exports = {
  info(options) {
    const { msg, time = Date.now() } = options;
    const timeStr = formatTime(time);
    const message = message(msg);
    const logStr = `info: ${timeStr} ${message}`;
    if (isProd) {
    } else {
      console.log(blue(logStr));
    }
  },

  error(options) {
    const { msg, time = Date.now() } = options;
    const timeStr = formatTime(time);
    const message = message(msg);
    const logStr = `error: ${timeStr} ${message}`;
    if (isProd) {
    } else {
      console.log(red(logStr));
    }
  },

  warn(options) {
    const { msg, time = Date.now() } = options;
    const timeStr = formatTime(time);
    const message = message(msg);
    const logStr = `warning: ${timeStr} ${message}`;
    if (isProd) {
    } else {
      console.log(yellow(logStr));
    }
  },

  ssr(options) {
    const { msg, type, time = Date.now() } = options;
    const timeStr = formatTime(time);
    const logStr = `${timeStr}: ssr ${type} ${msg}`;
    if (isProd) {
    } else {
      let render;
      switch (type) {
        case 'success':
          render = green;
          break;
        case 'start':
          render = blue;
          break;
        case 'error':
          render = red;
          break;
        default:
          break;
      }
      console.log(render(logStr));
    }
  },

  api(options) {
    const { msg, type, startTime, endTime, error } = options;
    const startTimeStr = formatTime(startTime);
    const endTimeStr = formatTime(endTime);
    const duringTime = endTime - startTime;
    let logStr = `${endTimeStr}: proxy ${type} ${msg} startTime ${startTimeStr} endTime ${endTimeStr}`;
    if (type === 'success') {
      logStr = `${logStr} duringTime ${duringTime} ms`;
    } else {
      logStr = `${logStr} error ${message(error)}`;
    }
    if (isProd) {
    } else {
      const render = type === 'success' ? cyan : magenta;
      console.log(render(logStr));
    }
  },
};
