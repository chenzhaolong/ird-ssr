/**
 * @file 连接mysql和操作mysql
 */

import Mysql from 'mysql';
import SqlService from 'SqlService';
import Emitter from 'events';
const mysqlCOnfig = require('../../config/env').mysql;
import { isFunction } from 'lodash';

export default class DBService extends Emitter {
  constructor() {
    super();
    const { host, user, password, database } = mysqlCOnfig;
    this.host = host;
    this.user = user;
    this.password = password;
    this.database = database;
    this.instance = null;
    this.sql = null;
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
          this.sql = new SqlService();
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

  /**
   * {
   *     table: string,
   *     scheme: {
   *         field: {type: string, defaultValue: string, isNotNull: boolean, isAutoIncrement: boolean, isUnique: boolean},
   *         ...
   *     },
   *     primaryKey: string,
   *     foreignKey: { fields: array, foreignTable: string,foreignTableKey: array }
   *     engine: string,
   *     charset: string,
   *
   * }
   */
  createTable(config, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.Table, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
    return this.executeSql(realSql);
  }

  /**
   * {
   *     table: string,
   *     fields: array,
   *     values: [array<string>, ......]
   * }
   */
  insert(config, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.Insert, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
    return this.instance.executeSql(realSql);
  }

  remove(config) {
    const sql = this.sql.fillConfig(SqlService.Types.Remove, config);
    const realSql = sql.getSql();
    return this.instance.executeSql(realSql);
  }

  update() {
    const sql = this.sql.fillConfig(SqlService.Types.Update, config);
    const realSql = sql.getSql();
    return this.instance.executeSql(realSql);
  }

  /**
   * {
   *     table: string,
   *     columns: string | array<string>,
   *     where: string | function,
   *     limit: number,
   *     order: [
   *         {
   *             name: string,
   *             isDesc: boolean, defaultValue = true
   *         }
   *     ]
   * }
   */
  select(config, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.Query, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
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
