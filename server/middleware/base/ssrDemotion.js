/**
 * @file ssr平滑降级层
 */
export default async (ctx, next) => {
  try {
    if (ctx.statistics.isPage) {
      const htmlArr = [];
      const originHtmlArr = ctx.originHtml.split('<!--vue-ssr-outlet-->');

      htmlArr.push(originHtmlArr[0]);
      htmlArr.push('<div id="app"></div>');
      if (process.env.NODE_ENV === 'development') {
        htmlArr.push(
          '<script type="text/javascript" src="/output/static/main.js"></script>',
        );
      }
      htmlArr.push(originHtmlArr[1]);

      ctx.body = htmlArr.join('\n');
    } else {
      await next();
    }
  } catch (e) {
    throw e;
  }
};
