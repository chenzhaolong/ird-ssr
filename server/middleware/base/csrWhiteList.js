/**
 * @file 在ssr模式，可以支持某些页面不采取ssr，改为采取csr模式
 * todo: 后续白名单匹配可以支持更多形式的匹配，目前是全匹配
 */
import { get, isArray } from 'lodash';
const config = require('../../../config/env');

export default async (ctx, next) => {
  const { csrWhiteList, server } = config;
  if (server.ssr) {
    const path = get(ctx, 'request.url', '');
    if (isArray(csrWhiteList) && csrWhiteList.length > 0 && csrWhiteList.indexOf(path) !== -1) {
      ctx.statistics.isWhiteList = true;
      await next();
    } else {
      await next();
    }
  } else {
    await next();
  }
};
