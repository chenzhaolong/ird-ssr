/**
 * @file 连接mysql和操作mysql
 */

import Mysql from 'mysql';
import SqlService from './SqlService';
import { isFunction, isString, isArray, isObject } from 'lodash';

const mysqlConfig = require('../../../config/env').mysql;
const Logger = require('../../utils/loggerUtils');

export default class DBService {
  constructor(instance) {
    const { host, user, password, database } = mysqlConfig;
    this.host = host;
    this.user = user;
    this.password = password;
    this.database = database;
    this.instance = instance || null;
    this.sql = new SqlService();
    this.isPoolConnect = instance && true;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.instance = Mysql.createConnection({
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database,
      });
      if (!mysqlConfig.open) {
        return reject('mysql is close.');
      }
      this.instance.connect(err => {
        if (err) {
          reject(err);
        } else {
          Logger.info('mysql is success connect.');
          resolve();
        }
      });
    });
  }

  hasTables(table, options) {
    if (!isString(table)) {
      return Promise.reject();
    }
    const sql = this.sql.fillConfig(SqlService.Types.HasTable).getSql();
    return this.executeSqlWithConnection(sql, null, options)
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

  end() {
    if (this.isPoolConnect) {
      this.instance.release();
      Logger.info('connection is release');
    } else {
      this.instance.end(err => {
        if (err) {
          Logger.error(`mysql error: ${err.message}`);
        } else {
          Logger.info('connection is end');
        }
      });
    }
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
  createTable(config, options, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.Table, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
    return this.executeSqlWithConnection(realSql, null, options);
  }

  /**
   * {
   *     table: string,
   *     values: array<object>
   * }
   */
  insert(config, options, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.Insert, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
    return this.executeSqlWithConnection(realSql, null, options);
  }

  /**
   * {
   *     table: string,
   *     where: string | function
   * }
   */
  remove(config, options, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.Remove, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
    return this.executeSqlWithConnection(realSql, null, options);
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
  update(config, options, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.Update, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
    return this.executeSqlWithConnection(realSql, null, options);
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
  select(config, options, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.Query, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
    return this.executeSqlWithConnection(realSql, null, options);
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
  changeTable(config, options, callback) {
    const sql = this.sql.fillConfig(SqlService.Types.ALTER, config);
    let realSql = sql.getSql();
    if (isFunction(callback)) {
      realSql = callback(realSql) || realSql;
    }
    return this.executeSqlWithConnection(realSql, null, options);
  }

  async executeSqlWithConnection(sql, params, options) {
    try {
      if (!this.isPoolConnect) {
        await this.connect();
      }
      return this.executeSql(sql, params, options);
    } catch (e) {
      Logger.error({ msg: e });
      return Promise.reject(e);
    }
  }

  /**
   * @param {string} sql sql语句
   * @param {object} params sql参数
   * @param {object} options 额外配置参数 {keepConnection: boolean 是否继续保持连接}
   */
  executeSql(sql, params, options = { keepConnection: false }) {
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
        if (!options.keepConnection) {
          this.end();
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
