/**
 * @file mysql代理层
 */
import DBService from './utils/DBService';
const mysqlConfig = require('../config/env').mysql;

export const DBInstance = (function() {
  let instance = null;
  return function() {
    if (instance) {
      return instance;
    } else {
      return (instance = new DBService());
    }
  };
})();

export const ConnectMysql = async (ctx, next) => {
  if (mysqlConfig.open) {
    const db = new DBInstance();
    try {
      if (!db.isConnect()) {
        await db.connect();
      }
      ctx.db = db;
      await next();
    } catch (e) {
      console.log('err', e);
      await next();
    }
  } else {
    await next();
  }
};
