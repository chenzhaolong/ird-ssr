/**
 * @file mysql连接池
 */

import Mysql from 'mysql';
import Emitter from 'events';
import TransactionService from './TransactionService';
import DBService from './DBService';

const mysqlConfig = require('../../../config/env').mysql;

export default class DBPoolService extends Emitter {
  constructor() {
    super();
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
          console.log(err);
          reject(false);
        } else {
          resolve(new TransactionService(connection));
        }
      });
    });
  }

  getDBConnection() {
    return new Promise((resolve, reject) => {
      this.instancePool.getConnection((err, connection) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(new DBService(connection));
        }
      });
    });
  }
}
