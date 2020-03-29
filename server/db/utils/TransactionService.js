/**
 * @file Mysql的事务
 */

import { isFunction, isString, isArray, isObject } from 'lodash';
import SqlService from './SqlService';

const Logger = require('../../utils/loggerUtils');
const TransactionStatus = {
  START: 'start',
  UNSTART: 'unStart',
  STARTFAIL: 'startFail',
  RELEASE: 'release',
};

export default class TransactionService {
  constructor(connect) {
    this.transaction = connect;
    this.sql = new SqlService();
    this.status = TransactionStatus.UNSTART;
    this.result = {};
  }

  canNotExecute() {
    const { STARTFAIL, UNSTART } = TransactionStatus;
    return [STARTFAIL, UNSTART].indexOf(this.status) !== -1;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.transaction.beginTransaction(err => {
        if (err) {
          Logger.error(`transaction start fail ${err.message}.`);
          this.status = TransactionStatus.STARTFAIL;
          reject(err);
        } else {
          Logger.info('transaction start.');
          this.status = TransactionStatus.START;
          resolve();
        }
      });
    });
  }

  rollback() {
    return new Promise((resolve, reject) => {
      this.transaction.rollback(err => {
        if (err) {
          Logger.error(`transaction rollback fail ${err.message}.`);
          reject(err);
        } else {
          Logger.info('transaction rollback.');
          resolve();
        }
        this.release();
      });
    });
  }

  release() {
    Logger.info('transaction release.');
    this.status = TransactionStatus.RELEASE;
    this.transaction.release();
  }

  commit() {
    return new Promise((resolve, reject) => {
      this.transaction.commit(err => {
        if (err) {
          Logger.error(`transaction commit fail ${err.message}.`);
          this.release();
          reject(err);
        } else {
          Logger.info('transaction commit.');
          this.release();
          resolve(this.result);
        }
      });
    });
  }

  makeSqlConfig(fn) {
    return fn(this.result);
  }

  /**
   * {
   *     table: string,
   *     scheme: {
   *         fieldName: {type: string, defaultValue: string, isNotNull: boolean, isAutoIncrement: boolean, isUnique: boolean},
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
    if (this.canNotExecute()) {
      return Promise.resolve(false);
    }
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
    if (this.canNotExecute()) {
      return Promise.resolve(false);
    }
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
    if (this.canNotExecute()) {
      return Promise.resolve(false);
    }
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
    if (this.canNotExecute()) {
      return Promise.resolve(false);
    }
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
    if (this.canNotExecute()) {
      return Promise.resolve(false);
    }
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
    if (this.canNotExecute()) {
      return Promise.resolve(false);
    }
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
      if (this.canNotExecute()) {
        return resolve(false);
      }
      const cb = (err, result) => {
        if (err) {
          reject(err);
        } else {
          this.result = result;
          Logger.info('sql execute success.');
          resolve(true);
        }
      };
      if (params) {
        this.transaction.query(sql, params, cb);
      } else {
        this.transaction.query(sql, cb);
      }
    });
  }
}
