/**
 * @file 路由中间件
 */
import routes from '../../controller';
import KoaRouter from 'koa-router';
import { isArray } from 'lodash';

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
      const handle = router[methodKey];
      if (isArray(action)) {
        handle(url, ...action);
      } else {
        handle(url, action);
      }
    }
  });
}

registerRoute();
export default router;
