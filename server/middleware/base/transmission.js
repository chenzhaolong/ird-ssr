/**
 * @file api透传层
 */
import { get } from 'lodash';
import proxy from '../../utils/proxy';
const env = require('../../../config/env');

function chooseProxyHost(ctx, path) {
  return env.server.proxy.host;
}

export default async (ctx, next) => {
  const apiPrefix = env.server.proxy.apiPrefix;
  // const apiProxyPrefix = env.server.apiPrefix;
  const path = get(ctx, 'request.url', '');
  // 透传层的前缀不能和代理层的前缀相同
  // if (apiPrefix && apiProxyPrefix && apiPrefix === apiProxyPrefix) {
  //   next();
  // }
  if (path && apiPrefix && path.indexOf(apiPrefix)) {
    proxy(ctx, {
      to: path,
      host: chooseProxyHost(ctx, path),
    })
      .then(res => {
        ctx.body = res;
      })
      .catch(err => {
        ctx.body = err;
      });
  } else {
    await next();
  }
};
