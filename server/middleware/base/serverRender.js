/**
 * @file 服务端渲染中间件
 * 支持二次扩展
 * todo：如何更好的支持扩展
 */
const config = require('../../../config/env');
const assertSuffix = [
  '.js',
  '.css',
  '.png',
  '.gif',
  '.svg',
  'ttf',
  'woff',
  'woff2',
  '.ico',
];

export default async (ctx, next) => {
  if (!config.server.ssr) {
    next();
  }
  const hasAsset = assertSuffix.some(suffix => {
    return ctx.request.url.indexOf(suffix) !== -1;
  });
  if (hasAsset) {
    next();
  } else {
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
  }
};
