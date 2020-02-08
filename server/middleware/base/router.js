/**
 * @file 路由中间件
 */
import routes from '../../routes';
import KoaRouter from 'koa-router';
import { get, isArray } from 'lodash';
import proxy from '../../utils/proxy';
import proxyApis from '../../routes/proxyApi';

const MockServer =
  process.env.NODE_ENV === 'production' ? {} : require('../../../mock');
const config = require('../../../config/env');
const router = new KoaRouter({ prefix: config.server.apiPrefix });

function registerRoute() {
  routes.forEach(routeConfig => {
    const {
      url,
      action,
      method,
      from,
      to,
      code,
      mockable = false,
    } = routeConfig;
    // 重定向
    if (from && to && code) {
      router.redirect(from, to, code);
    } else {
      const methodKey = method ? method.toLowerCase() : 'get';
      // mock层
      if (process.env.NODE_ENV === 'development' && mockable) {
        router[methodKey](url, MockServer.send);
      } else if (isArray(action)) {
        router[methodKey](url, ...action);
      } else {
        router[methodKey](url, action);
      }
    }
  });
}

function registerProxyRoute() {
  proxyApis.forEach(item => {
    const path = get(item, 'from', '');
    if (path) {
      const method = get(item, 'method', 'get').toLowerCase();
      // mock层
      if (process.env.NODE_ENV === 'development' && item.mockable) {
        router[method](path, MockServer.send);
      } else {
        router[method](path, async (ctx, next) => {
          proxy(ctx, item)
            .then(res => {
              ctx.body = res;
            })
            .catch(err => {
              ctx.body = err;
            });
        });
      }
    }
  });
}

registerRoute();
registerProxyRoute();

export default router;
