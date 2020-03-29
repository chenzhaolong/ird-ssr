/**
 * @file mysql连接池
 */

import Mysql from 'mysql';
import TransactionService from './TransactionService';
import DBService from './DBService';

const mysqlConfig = require('../../../config/env').mysql;
const Logger = require('../../utils/loggerUtils');

export default class DBPoolService {
  constructor() {
    const { host, user, password, database, poolNumbers } = mysqlConfig;
    this.instancePool = Mysql.createPool({
      connectionLimit: poolNumbers, //连接池连接数
      host: host, //数据库地址，这里用的是本地
      database: database, //数据库名称
      user: user, // username
      password: password, // password
    });
  }

  getTransactionConnection() {
    return new Promise((resolve, reject) => {
      this.instancePool.getConnection((err, connection) => {
        if (err) {
          Logger.error(`getTransactionConnection error: ${err.message}`);
          reject(err);
        } else {
          Logger.info('pool connect success');
          resolve(new TransactionService(connection));
        }
      });
    });
  }

  getDBConnection() {
    return new Promise((resolve, reject) => {
      this.instancePool.getConnection((err, connection) => {
        if (err) {
          Logger.error(`getDBConnection error: ${err.message}`);
          reject(err);
        } else {
          Logger.info('pool connect success');
          resolve(new DBService(connection));
        }
      });
    });
  }
}
