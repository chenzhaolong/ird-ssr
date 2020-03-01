/**
 * @file 连接mysql和操作mysql
 */

import Mysql from 'mysql';
import SqlService from 'SqlService';
import Emitter from 'events';
const mysqlCOnfig = require('../../config/env').mysql;

export default class DBService extends Emitter {
  constructor() {
    super();
    const { host, user, password, database } = mysqlCOnfig;
    this.host = host;
    this.user = user;
    this.password = password;
    this.database = database;
    this.instance = null;
    this.status = 'unconnect';
    // this.DBEvents = {
    //     FAIL: 'fail',
    //     CONNECT: 'success',
    //     TABLE: 'table',
    //     END: 'end'
    // }
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.instance = Mysql.createConnection({
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database,
      });
      this.instance.connect(err => {
        if (err) {
          this.status = 'fail';
          // this.emit(this.DBEvents.FAIL, err);
          resolve(err);
        } else {
          this.status = 'success';
          // this.emit(this.DBEvents.CONNECT);
          resolve();
        }
      });
    });
  }

  isConnect() {
    return this.status === 'success';
  }

  end() {
    // this.emit('end');
    this.instance.end();
  }

  createTable(config) {
    const sql = new SqlService(SqlService.Types.Table, config);
    const realSql = sql.getSql();
    return this.executeSql(realSql);
  }

  insert(config) {
    const sql = new SqlService(SqlService.Types.Insert, config);
    const realSql = sql.getSql();
    return this.instance.executeSql(realSql);
  }

  remove(config) {
    const sql = new SqlService(SqlService.Types.Remove, config);
    const realSql = sql.getSql();
    return this.instance.executeSql(realSql);
  }

  update() {
    const sql = new SqlService(SqlService.Types.Update, config);
    const realSql = sql.getSql();
    return this.instance.executeSql(realSql);
  }

  executeSql(sql) {
    return new Promise((resolve, reject) => {
      if (!sql) {
        reject('sql is error');
      }
      this.instance.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
