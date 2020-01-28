/**
 * @file 错误处理中间件
 */
import { get } from 'lodash';
const config = require('../../config/env').server;
const defaultErrorPage = require('../errorTpl/defaultTpl');

export default class ErrorHandle {
  static errorData = {
    errorHandleFn: '',
    continueFn: '',
    replaceErrorHandleFn: '',
  };

  static registerErrorFn(fn) {
    ErrorHandle.errorData.errorHandleFn = fn;
  }

  static registerContinue(fn) {
    ErrorHandle.errorData.continueFn = fn;
  }

  // 代替默认的错误处理函数
  static replace(fn) {
    ErrorHandle.errorData.replaceErrorHandleFn = fn;
  }

  // 错误处理
  static handle() {
    const {
      errorHandleFn,
      continueFn,
      replaceErrorHandleFn,
    } = ErrorHandle.errorData;
    if (replaceErrorHandleFn) {
      return replaceErrorHandleFn;
    }
    return async (ctx, next) => {
      try {
        await next();
        continueFn && continueFn(ctx);
      } catch (e) {
        ctx.logger.error(
          `${ctx.request.url} ${e.message ? e.message : JSON.stringify(e)}`,
        );
        if (errorHandleFn) {
          errorHandleFn(e, ctx);
        } else {
          const { apiPrefix, proxy } = config;
          const path = get(ctx, 'request.url', '');
          // api
          if (
            (apiPrefix && path.indexOf(apiPrefix) !== -1) ||
            (proxy.apiPrefix && path.indexOf(proxy.apiPrefix) !== -1)
          ) {
            ctx.type = 'json';
            ctx.body = { error: e };
          } else {
            // ssr
            ctx.body = defaultErrorPage();
          }
        }
      }
    };
  }
}
