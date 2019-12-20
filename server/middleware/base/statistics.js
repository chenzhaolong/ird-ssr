/**
 * @file 设置埋点数据
 */
import { get } from 'lodash';

export default async (ctx, next) => {
  ctx.statistics = {
    url: get(ctx, 'request.url', ''),
    requestTime: Date.now(),
    responseTime: 0,
  };
  next();
};
