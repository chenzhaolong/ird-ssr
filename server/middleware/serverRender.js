/**
 * @file 服务端渲染中间件
 * 支持二次扩展
 */

export default async (ctx, next) => {
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
