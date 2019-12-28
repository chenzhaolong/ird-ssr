/**
 * @file 代理层
 */
import ProxyFetch from './fetch';
import { get, isFunction } from 'lodash';

const env = require('../../config/env');
const defaultHost = env.server.proxy.host;

async function proxy(ctx, item) {
  const { to, host = defaultHost, extraAction, extraHandle } = item;
  try {
    const method = get(ctx, 'method', 'get');
    const header = get(ctx, 'request.header', {});
    let body = get(ctx, `request.${method === 'get' ? 'query' : 'body'}`, {});
    const [proxyHeader, proxyBody] = isFunction(extraHandle)
      ? extraHandle(ctx, header, body)
      : [header, body];
    const response = await ProxyFetch.fetch({
      host,
      url: to,
      method,
      body: proxyBody,
      header: proxyHeader,
    });
    return isFunction(extraAction) ? extraAction(response) : response;
  } catch (err) {
    ctx.status = 500;
    if (err instanceof Error && 'not found' === err.message) {
      ctx.status = 404;
      return {
        data: {},
        msg: 'node got a error of not found',
        code: 404,
      };
    }
    return err;
  }
}

export default proxy;
