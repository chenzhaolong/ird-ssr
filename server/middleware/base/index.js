/**
 * @file 中间件护航
 */
import bodyParse from 'koa-bodyparser';
import compress from 'koa-compress';
import statistics from './statistics';
import Logger from './logger';
import Router from './router';
import transmission from './transmission';
import SSRRender from './serverRender';
import { isObject, isBoolean, isFunction } from 'lodash';

export function beforeBizMW(app, options) {
  const defaultBeforeMWConfig = {
    bodyParse: true,
    compress: true,
    statistics: true,
    Logger: true,
  };
  const baseMWConfig = isObject(options)
    ? { ...defaultBeforeMWConfig, ...options }
    : defaultBeforeMWConfig;
  Object.keys(baseMWConfig).forEach(key => {
    const value = baseMWConfig[key];
    if (isBoolean(value) && value) {
      const mw = matchMiddleWare(key);
      app.use(mw);
    } else if (isFunction(value)) {
      app.use(value);
    }
  });
}

export function afterBizMW(app, options) {
  const defaultAfterMWConfig = {
    Router: true,
    transmission: true,
    SSRRender: true,
  };
  const baseMWConfig = isObject(options)
    ? { ...options, ...defaultAfterMWConfig }
    : defaultAfterMWConfig;
  Object.keys(baseMWConfig).forEach(key => {
    const value = baseMWConfig[key];
    if (isBoolean(value) && value) {
      const mw = matchMiddleWare(key);
      app.use(mw);
    } else if (isFunction(value)) {
      app.use(value);
    }
  });
}

function matchMiddleWare(key) {
  switch (key) {
    case 'bodyParse':
      return bodyParse;
    case 'compress':
      return compress;
    case 'statistics':
      return statistics;
    case 'Logger':
      return Logger;
    case 'Router':
      return Router;
    case 'transmission':
      return transmission;
    case 'SSRRender':
      return SSRRender;
    default:
      return (ctx, next) => next();
  }
}
