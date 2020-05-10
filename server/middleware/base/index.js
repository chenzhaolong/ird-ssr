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
import ErrorHandle from '../../utils/errorHandle';
import ssrDemotion from './ssrDemotion';
import csrWhiteList from './csrWhiteList';

export function beforeBizMW(app) {
  app.use(bodyParser());
  app.use(compress());
  app.use(statistics);
  app.use(Logger);
  app.use(ErrorHandle.handle());
}

export function afterBizMW(app) {
  app.use(Router.routes());
  app.use(Router.allowedMethods());
  app.use(transmission);
  app.use(csrWhiteList);
  app.use(SSRRender);
  app.use(ssrDemotion);
}
