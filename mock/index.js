/**
 * @file mock层
 */
class MockServer {
  static mapping = {};

  static send(ctx, next) {
    const url = ctx.request.url;
    // 处理带有query的情况
    const target = Object.keys(MockServer.mapping).filter(value => url.indexOf(value) !== -1);
    const response = target.length > 0 ? MockServer.mapping[target[0]] : {};
    ctx.logger.info(`${url} return mock data ${JSON.stringify(response)}`);
    ctx.body = ctx.makeBody(response);
  }
}

module.exports = MockServer;
