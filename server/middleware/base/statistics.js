/**
 * @file 设置通用数据
 */
import { get } from 'lodash';

export default async (ctx, next) => {
  ctx.statistics = {
    url: get(ctx, 'request.url', ''),
    requestTime: Date.now(),
    isAsset: false, // 静态资源
    isApi: false, // 请求
    isPage: false, // 页面
  };
  await next();
};
