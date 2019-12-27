/**
 * @file api透传层
 */
import { get } from 'lodash';
import proxy from '../../utils/proxy';
const env = require('../../config/env');

function chooseProxyHost(ctx, path) {
  return env.server.proxy.host;
}

export default async (ctx, next) => {
  const apiPrefix = env.server.proxy.apiPrefix;
  const path = get(ctx, 'request.url', '');
  if (path && path.indexOf(apiPrefix)) {
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
    next();
  }
};
