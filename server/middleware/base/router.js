/**
 * @file 路由中间件
 */
import routes from '../../routes';
import KoaRouter from 'koa-router';
import { get, isArray } from 'lodash';
import proxy from '../../utils/proxy';
import proxyApis from '../../routes/proxyApi';

const config = require('../../../config/env');
const router = KoaRouter({ prefix: config.server.apiPrefix });

function registerRoute() {
  routes.forEach(routeConfig => {
    const { url, action, method, from, to, code } = routeConfig;
    // 重定向
    if (from && to && code) {
      router.redirect(from, to, code);
    } else {
      const methodKey = method ? method.toLowerCase() : 'get';
      const controller = router[methodKey];
      if (isArray(action)) {
        controller(url, ...action);
      } else {
        controller(url, action);
      }
    }
  });
}

function registerProxyRoute() {
  proxyApis.forEach(item => {
    const path = get(item, 'from', '');
    if (path) {
      const method = get(item, 'method', 'get').toLowerCase();
      const controller = router[method];
      controller(path, async (ctx, next) => {
        proxy(ctx, item)
          .then(res => {
            ctx.body = res;
          })
          .catch(err => {
            ctx.body = err;
          });
      });
    }
  });
}

registerRoute();
registerProxyRoute();
export default router;
