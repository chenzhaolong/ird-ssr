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
  const hasAsset = assertSuffix.some(suffix => {
    return ctx.request.url.indexOf(suffix) !== -1;
  });
  if (hasAsset) {
    ctx.statistics.isAsset = true;
    await next();
  } else if (!config.server.ssr) {
    ctx.statistics.isPage = true;
    await next();
  } else {
    const context = {
      request: ctx.request,
      logger: ctx.logger,
      state: {},
    };
    try {
      const html = await ctx.render.renderToString(context);
      if (html) {
        ctx.body = html;
      } else {
        ctx.statistics.isPage = true;
        await next();
      }
    } catch (e) {
      if (e) {
        ctx.statistics.isPage = true;
        await next();
      } else {
        throw new Error();
      }
    }
  }
};
