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
import staticServer from 'koa-static';

/*** 静态资源 *****/
const path = require('path');
const staticPath = path.resolve(__dirname, '../../../');
const resource = staticServer(staticPath);

export function beforeBizMW(app) {
  app.use(bodyParser());
  app.use(compress());
  app.use(statistics);
  app.use(Logger);
  app.use(resource);
  app.use(ErrorHandle.handle());
}

export function afterBizMW(app) {
  app.use(Router.routes());
  app.use(Router.allowedMethods());
  app.use(transmission);
  app.use(SSRRender);
  app.use(ssrDemotion);
}
