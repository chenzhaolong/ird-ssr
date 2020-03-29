/**
 * @file 日志工具
 * info：普通
 * error：错误
 * warn：警告
 * ssr：服务端渲染
 * api：api层
 * todo:后续进一步优化日志，支持更多的扩展
 */
import moment from 'moment';
import colors from 'colors';
import prodLogger from './proLogger';

const isProd = process.env.NODE_ENV === 'production';

const { red, green, yellow, blue, magenta, cyan } = colors;

const formatTime = time => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss.SSS');
};

const getMessage = msg => {
  return typeof msg === 'string' ? msg : JSON.stringify(msg);
};

module.exports = {
  info(options) {
    const { msg, time = Date.now(), prodDisable = false } = typeof options === 'string' ? { msg: options } : options;
    const timeStr = formatTime(time);
    const message = getMessage(msg);
    const logStr = `info: ${timeStr} ${message}`;
    if (isProd) {
      !prodDisable && prodLogger.info(logStr);
    } else {
      console.log(blue(logStr));
    }
  },

  warn(options) {
    const { msg, time = Date.now(), prodDisable = false } = typeof options === 'string' ? { msg: options } : options;
    const timeStr = formatTime(time);
    const message = getMessage(msg);
    const logStr = `warning: ${timeStr} ${message}`;
    if (isProd) {
      !prodDisable && prodLogger.warn(logStr);
    } else {
      console.log(yellow(logStr));
    }
  },

  error(options) {
    const { msg, time = Date.now(), prodDisable = false } = typeof options === 'string' ? { msg: options } : options;
    const timeStr = formatTime(time);
    const message = getMessage(msg);
    const logStr = `error: ${timeStr} ${message}`;
    if (isProd) {
      !prodDisable && prodLogger.error(logStr);
    } else {
      console.log(red(logStr));
    }
  },

  ssr(options) {
    const { msg, type, time = Date.now(), prodDisable = false } = options;
    const timeStr = formatTime(time);
    const logStr = `${timeStr}: ssr ${type} ${msg}`;
    if (isProd) {
      !prodDisable && prodLogger.ssr(logStr, type);
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
    const { msg, type, startTime, endTime, error, proxy = false, prodDisable = false } = options;
    const startTimeStr = formatTime(startTime);
    const endTimeStr = formatTime(endTime);
    const duringTime = endTime - startTime;
    let logStr = `${endTimeStr} ${
      proxy ? 'proxy' : ''
    } status ${type} ${msg} startTime ${startTimeStr} endTime ${endTimeStr}`;
    if (type === 'success') {
      logStr = `${logStr} duringTime ${duringTime} ms`;
    } else if (type === 'error') {
      logStr = `${logStr} error ${getMessage(error)}`;
    }
    if (isProd) {
      !prodDisable && prodLogger.api(logStr, type);
    } else {
      const render = type === 'success' ? cyan : magenta;
      console.log(render(logStr));
    }
  },
};
