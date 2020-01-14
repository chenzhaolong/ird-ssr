/**
 * @生产环境下log4的封装
 */

const log4js = require('log4js');
const logConfig = require('../../config/log4.config');
log4js.configure(logConfig);

export default {
  info() {},

  error() {},

  warn() {},

  ssr() {},

  api() {},
};
