/**
 * @file 连接mysql和操作mysql
 */

import Mysql from 'mysql';
import SqlService from 'server/db/utils/SqlService';
import Emitter from 'events';
const mysqlConfig = require('../../../config/env').mysql;
import { isFunction, isString, isArray, isObject } from 'lodash';

export default class DBService extends Emitter {
  constructor(instance) {
    super();
    const { host, user, password, database } = mysqlConfig;
    this.host = host;
    this.user = user;
    this.password = password;
    this.database = database;
    this.instance = instance || null;
    this.sql = instance ? new SqlService() : null;
    this.status = instance ? 'success' : 'unConnect';
    this.isPoolConnect = instance && true;
    // this.DBEvents = {
    //     FAIL: 'fail',
    //     CONNECT: 'success',
    //     TABLE: 'table',
    //     END: 'end'
    // }
  }

  connect() {
    if (this.isConnect()) {
      return Promise.resolve();
    }
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

  end(fn) {
    this.status = 'unConnect';
    return new Promise((resolve, reject) => {
      this.instance.end(err => {
        if (err) {
          reject(err);
        } else {
          isFunction(fn) && fn();
          resolve();
        }
      });
    });
  }

  hasTables(table) {
    if (!isString(table)) {
      return Promise.reject();
    }
    return this.executeSql('show tables;')
      .then(data => {
        if (isArray(data)) {
          return data.some(item => {
            return item[`Tables_in_${mysqlConfig.database}`] === table;
          });
        } else if (isObject(data)) {
          return data[`Tables_in_${mysqlConfig.database}`] === table;
        } else {
          return false;
        }
      })
      .catch(err => {
        throw err;
      });
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
   *     values: array<object>
   * }
   */
  insert(config, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.Insert, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
    return this.executeSql(realSql);
  }

  /**
   * {
   *     table: string,
   *     where: string | function
   * }
   */
  remove(config, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.Remove, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
    return this.executeSql(realSql);
  }

  /**
   * {
   *     table: string,
   *     data: [
   *         {
   *             name: string,
   *             value: any
   *         }
   *     ],
   *     where: string | function
   * }
   */
  update(config, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.Update, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
    return this.executeSql(realSql);
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
    return this.executeSql(realSql);
  }

  /**
   * {
   *     table: string,
   *     type: string, enum=['add', 'modify', 'rename', 'drop', 'change']
   *     // 下面只有一种配置
   *     drop: {
   *         field: string
   *     },
   *     add: {
   *         field: string,
   *         type: enum=Types
   *     },
   *     rename: {
   *         tableName: string
   *     },
   *     modify: {
   *         filed: string,
   *         type: enum=Types,
   *     },
   *     change: {
   *         oldField: string,
   *         newField: string,
   *         type: enum=Types
   *     }
   * }
   */
  changeTable(config, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.ALTER, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
    return this.executeSql(realSql);
  }

  executeSql(sql, params) {
    return new Promise((resolve, reject) => {
      if (!sql) {
        reject('sql is error');
      }
      const cb = (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
        if (this.isPoolConnect) {
          this.instance.release();
        }
      };
      if (params) {
        this.instance.query(sql, params, cb);
      } else {
        this.instance.query(sql, cb);
      }
    });
  }
}
