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
  '.jpg',
  '.jpeg',
  config.server.apiPrefix, // 没有匹配到的api接口
  config.server.proxy.apiPrefix,
];

export default async (ctx, next) => {
  const hasAsset = assertSuffix
    .filter(val => val && true)
    .some(suffix => {
      return ctx.request.url.indexOf(suffix) !== -1;
    });
  if (hasAsset) {
    ctx.statistics.isAsset = true;
    await next();
  } else if (!config.server.ssr) {
    ctx.statistics.isPage = true;
    ctx.statistics.tempMsg = {
      msg: `${ctx.request.url} ssr is close, adopting csr render.`,
      type: 'info',
    };
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
        ctx.statistics.tempMsg = {
          msg: 'ssr is open, but html is not exist, adopting csr render.',
          type: 'error',
        };
        await next();
      }
    } catch (e) {
      if (e) {
        ctx.statistics.tempMsg = {
          msg: `ssr is open, but error ${e.message || e}`,
          type: 'error',
        };
        ctx.statistics.isPage = true;
        await next();
      } else {
        throw new Error('undefined reason');
      }
    }
  }
};
