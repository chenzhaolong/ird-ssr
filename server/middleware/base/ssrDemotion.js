/**
 * @file ssr平滑降级层
 */
export default async (ctx, next) => {
  try {
    if (ctx.statistics.isPage) {
      if (ctx.statistics.tempMsg) {
        const { msg, type } = ctx.statistics.tempMsg;
        ctx.logger[type](msg);
      }
      const htmlArr = [];
      const originHtmlArr = ctx.originHtml.split('<!--vue-ssr-outlet-->');

      htmlArr.push(originHtmlArr[0]);
      htmlArr.push('<div id="app"></div>');
      htmlArr.push(
        `<script type="text/javascript">window.ssrDemotion = 'yes'</script>`,
      );
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
