/**
 * @file: 生产环境下log4的封装
 */

const log4js = require('log4js');
const logConfig = require('../../config/log4.config');
log4js.configure(logConfig);

export default {
  info(str) {
    log4js.getLogger().info(`pid ${process.pid} ${str}`);
  },

  warn(str) {
    log4js.getLogger().warn(`pid ${process.pid} ${str}`);
  },

  error(str) {
    log4js.getLogger('error').error(`pid ${process.pid} ${str}`);
  },

  ssr(str, type) {
    if (type === 'error') {
      this.error(str);
    } else {
      log4js.getLogger('ssr').info(`pid ${process.pid} ${str}`);
    }
  },

  api(str, type) {
    if (type === 'error') {
      this.error(str);
    } else {
      log4js.getLogger('http').info(`pid ${process.pid} ${str}`);
    }
  },
};
