/**
 * @file 设置通用数据
 */
import { get } from 'lodash';

export default async (ctx, next) => {
  ctx.statistics = {
    url: get(ctx, 'request.url', ''),
    requestTime: Date.now(),
  };
  await next();
};
