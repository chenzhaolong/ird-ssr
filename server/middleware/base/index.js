/**
 * @file 中间件护航
 */
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import statistics from './statistics';
import { Logger } from './logger';
import Router from './router';
import transmission from './transmission';
import SSRRender from './serverRender';

export function beforeBizMW(app) {
  app.use(bodyParser());
  app.use(compress());
  app.use(statistics);
  app.use(Logger);
}

export function afterBizMW(app) {
  app.use(Router.routes());
  app.use(Router.allowedMethods());
  app.use(transmission);
  app.use(SSRRender);
}
