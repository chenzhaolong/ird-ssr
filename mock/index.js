/**
 * @file mock层
 */
class MockServer {
  static mapping = {};

  static send(ctx, next) {
    const url = ctx.request.url;
    const response = MockServer.mapping[url] || {};
    ctx.logger.info(`${url} return mock data`);
    ctx.body = {
      code: 200,
      data: response,
      msg: '',
    };
  }
}

module.exports = MockServer;
