/**
 * @file sql语句服务类
 */
import { isArray, isObject } from 'lodash';

export default class SqlService {
  constructor(type, config) {
    this.sqlType = type;
    this.options = config;
  }

  static Types = {
    Table: 'table',
    Insert: 'insert',
    Remove: 'remove',
    Query: 'select',
    Update: 'update',
    Other: 'other',
  };

  formatInsertSql() {
    const { table, values, fields } = this.options;
    if (!table) {
      return '';
    }
    let sql = `insert into ${table}`;
    if (isArray(fields)) {
      sql = `${sql} (${fields.join(',')})`;
    }
    sql = `${sql} values`;
    const insertData = isArray(values) ? values : [{ ...values }];
    insertData.forEach(item => {
      sql = `${sql} (${item.join(',')})`;
    });
    sql = `${sql};`;
    console.log('insert sql', sql);
    this.options = {};
    return sql;
  }

  formatCreateTable() {
    const {
      table,
      scheme,
      primaryKey,
      foreignKey,
      engine,
      charset,
    } = this.options;
    if (!table) {
      return '';
    }
    if (!isObject(scheme) && Object.keys(scheme).length === 0) {
      return '';
    }
    let sql = `create table is no exists ${table} (`;
    Object.keys(scheme).forEach(key => {
      let { type, defaultValue, isNotNull, isAutoIncrement, isUnique } = scheme[
        key
      ];
      sql = `${sql} 
       ${key} ${type} ${defaultValue || ''} ${isNotNull ? 'NOT NULL' : ''} ${
        isAutoIncrement ? 'AUTO_INCREMENT' : ''
      } ${isUnique ? 'unique' : ''},
      `;
    });
    if (primaryKey) {
      sql = `${sql}
       primary key (${primaryKey})
      `;
    }
    if (foreignKey) {
      const { fields, foreignTable, foreignTableKey } = foreignKey;
      sql = `${sql}
       foreign key (${fields.join(
         ',',
       )}) references ${foreignTable} (${foreignTableKey.join(',')})
       )
      `;
    }
    if (engine) {
      sql = `${sql} engine=${engine}`;
    }
    if (charset) {
      sql = `${sql} charset=${charset}`;
    }
    sql = `${sql};`;
    console.log('create table sql', sql);
    this.options = {};
    return sql;
  }

  getSql() {
    switch (this.sqlType) {
      case 'table':
        return this.formatCreateTable();
      case 'insert':
        return this.formatInsertSql();
      case 'remove':
        break;
      case 'select':
        break;
      case 'update':
        break;
      default:
        break;
    }
  }
}
