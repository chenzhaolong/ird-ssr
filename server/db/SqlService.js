/**
 * @file sql语句服务类
 */
import { isArray } from 'lodash';

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

  /**
   * {
   *     table: xxx,
   *     fields: [xx,xx,xx],
   *     values: [[xx,xx,xx], [xx,xx,xx], ......]
   * }
   */
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
    console.log('insert sql', sql);
    return sql;
  }

  getSql() {
    switch (this.sqlType) {
      case 'table':
        break;
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
