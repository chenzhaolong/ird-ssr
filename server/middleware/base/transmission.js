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
  const path = get(ctx, 'request.url', '');
  if (path && apiPrefix && path.indexOf(apiPrefix) !== -1) {
    try {
      const response = await proxy(ctx, { to: path, host: chooseProxyHost(ctx, path) }, {});
      ctx.body = ctx.makeBody(response);
    } catch (err) {
      ctx.body = err;
    }
  } else {
    await next();
  }
};
