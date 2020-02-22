/**
 * @file api代理层
 */
import ProxyFetch from './fetch';
import { get, isFunction } from 'lodash';

const env = require('../../config/env');
const defaultHost = env.server.proxy.host;

function proxy(ctx, item) {
  const { to, host = defaultHost, actions = {} } = item;
  const method = get(ctx, 'method', 'get');
  const header = get(ctx, 'request.header', {});
  const body = method.toLowerCase() === 'get' ? ctx.query : ctx.request.body;

  let [proxyHeader, proxyBody] = isFunction(actions.extraHandle)
    ? actions.extraHandle(ctx, header, body)
    : [header, body];

  const options = {
    host,
    url: to,
    method,
    body: proxyBody,
    header: proxyHeader,
  };
  ctx.logger.api({
    type: 'wait',
    msg: `host ${host} url ${to} body ${JSON.stringify(
      proxyBody,
    )} header ${JSON.stringify(proxyHeader)}`,
    startTime: ctx.statistics.requestTime,
    endTime: Date.now(),
    proxy: true,
  });

  return ProxyFetch.fetch(options)
    .then(response => {
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
    })
    .catch(err => {
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
    });
}

export default proxy;
