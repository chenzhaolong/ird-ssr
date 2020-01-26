/**
 *  @file 生产环境下log4js的配置文件
 **/

const path = require('path');
const loggerConfig = require('./compile').logger;

const defaultPath = path.resolve(
  __dirname,
  loggerConfig.basePath,
  loggerConfig.path.default,
);

const ssrPath = path.resolve(
  __dirname,
  loggerConfig.basePath,
  loggerConfig.path.ssr,
);

const errorPath = path.resolve(
  __dirname,
  loggerConfig.basePath,
  loggerConfig.path.error,
);

const httpPath = path.resolve(
  __dirname,
  loggerConfig.basePath,
  loggerConfig.path.http,
);

module.exports = {
  appenders: {
    // 默认日志(给info和warn用)
    default: {
      type: 'dateFile',
      filename: defaultPath,
      pattern: loggerConfig.interval, // 日志后缀名
      encoding: loggerConfig.encoding,
      daysToKeep: loggerConfig.keepDays,
      keepFileExt: loggerConfig.keepFileExt,
      alwaysIncludePattern: loggerConfig.mergeName,
    },

    // http请求日志(给logger和api用)
    http: {
      type: 'dateFile',
      filename: httpPath,
      pattern: loggerConfig.interval, // 日志后缀名
      encoding: loggerConfig.encoding,
      keepFileExt: loggerConfig.keepFileExt,
      alwaysIncludePattern: loggerConfig.mergeName,
    },

    // 给ssr用
    ssr: {
      type: 'dateFile',
      filename: ssrPath,
      pattern: loggerConfig.interval, // 日志后缀名
      encoding: loggerConfig.encoding,
      daysToKeep: loggerConfig.keepDays,
      keepFileExt: loggerConfig.keepFileExt,
      alwaysIncludePattern: loggerConfig.mergeName,
    },

    // 错误日志
    error: {
      type: 'dateFile',
      filename: errorPath,
      pattern: loggerConfig.interval, // 日志后缀名
      encoding: loggerConfig.encoding,
      daysToKeep: loggerConfig.keepDays,
      keepFileExt: loggerConfig.keepFileExt,
      alwaysIncludePattern: loggerConfig.mergeName,
    },
  },
  categories: {
    default: {
      appenders: ['default'],
      level: 'info',
    },

    http: {
      appenders: ['http'],
      level: 'info',
    },

    ssr: {
      appenders: ['ssr'],
      level: 'info',
    },

    error: {
      appenders: ['error'],
      level: 'error',
    },
  },
  pm2: true,
  pm2InstanceVar: 'INSTANCE_ID',
};
