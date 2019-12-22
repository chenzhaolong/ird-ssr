/**
 * @file 服务端渲染中间件
 * 支持二次扩展
 */
const config = require('../../../config/env');

export default async (ctx, next) => {
  if (!config.server.ssr) {
    next();
  }
  const context = {
    request: ctx.request,
    state: {},
  };
  ctx.render
    .renderToString(context)
    .then(html => {
      ctx.body = html;
    })
    .catch(e => {
      next();
    });
};
