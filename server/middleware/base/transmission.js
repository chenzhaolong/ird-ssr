/**
 * @file api透传层
 */
import { get } from 'lodash';
import proxy from '../../utils/proxy';
const env = require('../../config/env');

export default async (ctx, next) => {
  const apiPrefix = env.server.proxy.apiPrefix;
  const path = get(ctx, 'request.url', '');
  if (path && path.indexOf(apiPrefix)) {
    proxy(ctx, {
      to: path,
      host: env.server.proxy.host,
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
