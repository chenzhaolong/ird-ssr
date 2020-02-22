/**
 * @file api代理层
 */
import ProxyFetch from './fetch';
import { get, isFunction } from 'lodash';
import moment from 'moment';
import colors from 'colors';

const env = require('../../config/env');
const defaultHost = env.server.proxy.host;

async function proxy(ctx, item) {
  const { to, host = defaultHost, actions = {} } = item;
  const method = get(ctx, 'method', 'get');
  const header = get(ctx, 'request.header', {});
  let body = get(ctx, `request.${method === 'get' ? 'query' : 'body'}`, {});
  let [proxyHeader, proxyBody] = [{}, {}];
  try {
    [proxyHeader, proxyBody] = isFunction(actions.extraHandle)
      ? actions.extraHandle(ctx, header, body)
      : [header, body];
    const response = await ProxyFetch.fetch({
      host,
      url: to,
      method,
      body: proxyBody,
      header: proxyHeader,
    });

    ctx.logger.api({
      type: 'success',
      msg: `host ${host} url ${to} body ${JSON.stringify(
        proxyBody,
      )} header ${JSON.stringify(proxyHeader)}`,
      startTime: ctx.statistics.requestTime,
      endTime: Date.now(),
      proxy: true,
    });

    return response;
  } catch (err) {
    ctx.logger.api({
      type: 'error',
      msg: `host ${host} url ${to} body ${JSON.stringify(
        proxyBody,
      )} header ${JSON.stringify(proxyHeader)}`,
      startTime: ctx.statistics.requestTime,
      endTime: Date.now(),
      error: err,
      proxy: true,
    });

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
