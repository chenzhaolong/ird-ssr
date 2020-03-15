/**
 * @file sql语句服务类
 */
import { isArray, isObject, isString, isFunction, isNumber } from 'lodash';

export default class SqlService {
  constructor(type, config) {
    this.sqlType = '';
    this.options = {};
  }

  static Types = {
    Table: 'table',
    Insert: 'insert',
    Remove: 'remove',
    Query: 'select',
    Update: 'update',
    ALTER: 'alter',
    Other: 'other',
  };

  static AlterTypes = {
    Add: 'add',
    Modify: 'modify',
    Change: 'change',
    Rename: 'rename',
    Drop: 'drop',
  };

  fillConfig(type, config) {
    this.sqlType = type;
    this.options = config;
    return this;
  }

  clean() {
    this.sqlType = '';
    this.options = {};
  }

  formatSelectSql() {
    const { table, columns, where, limit, order } = this.options;
    if (!table) {
      return '';
    }
    let sql = `select`;
    if (isArray(columns) && columns.length > 0) {
      sql = `${sql} ${columns.join()}`;
    } else if (isString(columns)) {
      sql = `${sql} ${columns}`;
    } else {
      sql = `${sql} *`;
    }
    sql = `${sql} from ${table}`;
    if (isString(where)) {
      sql = `${sql} where ${where}`;
    } else if (isFunction(where)) {
      sql = `${sql} where ${where()}`;
    }
    if (isNumber(limit)) {
      sql = `${sql} limit ${limit}`;
    }
    if (isArray(order)) {
      sql = `${sql} order by`;
      order.forEach((item, index) => {
        sql = `${sql} ${item.name}`;
        sql = item.isDesc ? `${sql} desc` : `${sql} asc`;
        sql = index === order.length - 1 ? sql : `${sql},`;
      });
    }
    sql = `${sql};`;
    console.log('select sql:', sql);
    this.clean();
    return sql;
  }

  formatInsertSql() {
    const { table, values } = this.options;
    if (!table) {
      return '';
    }
    let sql = `insert into ${table}`;
    let insertData = isArray(values) ? values : isObject(values) ? [values] : [];
    let keys = Object.keys(insertData[0]);
    if (insertData.some(item => Object.keys(item).length !== keys.length)) {
      console.log('insert sql error:', insertData);
      return '';
    }
    sql = `${sql} (${keys.join()})`;
    sql = `${sql} values`;
    insertData.forEach(item => {
      const data = keys.map(key => {
        if (isString(item[key])) {
          return `"${item[key]}"`;
        } else {
          return item[key];
        }
      });
      console.log('data', data);
      sql = `${sql} (${data.join()})`;
    });
    sql = `${sql};`;
    console.log('insert sql:', sql);
    this.clean();
    return sql;
  }

  formatCreateTable() {
    const { table, scheme, primaryKey, foreignKey, engine = 'InnoDB', charset = 'utf8' } = this.options;
    if (!table) {
      return '';
    }
    if (!isObject(scheme) && Object.keys(scheme).length === 0) {
      return '';
    }
    let sql = `create table if not exists ${table} (`;
    Object.keys(scheme).forEach(key => {
      let { type, defaultValue, isNotNull, isAutoIncrement, isUnique } = scheme[key];
      sql = `${sql}
            ${key} ${type} ${defaultValue || ''} ${isNotNull ? 'NOT NULL' : ''} ${
        isAutoIncrement ? 'AUTO_INCREMENT' : ''
      } ${isUnique ? 'unique' : ''},`;
    });
    if (primaryKey) {
      sql = `${sql}
       primary key (${primaryKey})
      `;
    }
    if (foreignKey) {
      const { fields, foreignTable, foreignTableKey } = foreignKey;
      sql = `${sql}
             foreign key (${fields.join()}) references ${foreignTable} (${foreignTableKey.join()}))`;
    }
    sql = `${sql} )`;
    if (engine) {
      sql = `${sql} engine=${engine}`;
    }
    if (charset) {
      sql = `${sql} charset=${charset}`;
    }
    sql = `${sql};`;
    console.log('create table sql:', sql);
    this.clean();
    return sql;
  }

  formatRemoveSql() {
    const { table, where } = this.options;
    let sql = `delete from ${table}`;
    if (isString(where)) {
      sql = `${sql} where ${where}`;
    } else if (isFunction(where)) {
      sql = `${sql} where ${where()}`;
    }
    sql = `${sql};`;
    console.log('remove sql:', sql);
    this.clean();
    return sql;
  }

  formatUpdateSql() {
    let { table, data, where } = this.options;
    if (isObject(data)) {
      data = [{ ...data }];
    }
    if (isArray(data) && data.length > 0) {
      let sql = `update ${table} set`;
      data.forEach((item, index) => {
        if (isString(item.value)) {
          sql = `${sql} ${item.key}="${item.value}"`;
        } else {
          sql = `${sql} ${item.key}=${item.value}`;
        }
        sql = index === data.length - 1 ? sql : `${sql},`;
      });
      if (isString(where)) {
        sql = `${sql} where ${where}`;
      } else if (isFunction(where)) {
        sql = `${sql} where ${where()}`;
      }
      sql = `${sql};`;
      console.log('update sql:', sql);
      this.clean();
      return sql;
    } else {
      return '';
    }
  }

  formatAlterSql() {
    const { table, type, drop = {}, add = {}, rename = {}, modify = {}, change = {} } = this.options;
    let sql = `alter table ${table}`;
    switch (type) {
      case 'drop':
        sql = `${sql} drop ${drop.field};`;
        break;
      case 'add':
        sql = `${sql} add ${add.field} ${add.type};`;
        break;
      case 'rename':
        sql = `${sql} rename ${rename.tableName};`;
        break;
      case 'modify':
        sql = `${sql} modify ${modify.field} ${modify.type};`;
        break;
      case 'change':
        sql = `${sql} change ${change.oldField} ${change.newField} ${change.type};`;
        break;
      default:
        sql = '';
        break;
    }
    console.log('alter sql:', sql);
    this.clean();
    return sql;
  }

  getSql() {
    switch (this.sqlType) {
      case 'table':
        return this.formatCreateTable();
      case 'insert':
        return this.formatInsertSql();
      case 'remove':
        return this.formatRemoveSql();
      case 'select':
        return this.formatSelectSql();
      case 'update':
        return this.formatUpdateSql();
      case 'alter':
        return this.formatAlterSql();
      default:
        return '';
    }
  }
}
