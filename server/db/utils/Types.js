/**
 * @file mysql的数据类型
 */
import { isNumber, isArray } from 'lodash';

function createInter(type, options = {}) {
  if (!type) {
    return '';
  }
  let str = `${type}`;
  const { width, isUNSIGNED = false, isZEROFILL = false } = options;
  if (width) {
    str = `${str}(width)`;
  }
  if (isUNSIGNED) {
    str = `${str} UNSIGNED`;
  }
  if (isZEROFILL) {
    str = isUNSIGNED ? `${str} ZEROFILL` : `${str} UNSIGNED ZEROFILL`;
  }
  return str;
}

function createFloat(type, options) {
  if (!type) {
    return '';
  }
  const { total = 10, decimals = 3, isUNSIGNED = false, isZEROFILL = false } = options;
  let str = `${type}(${total}, ${decimals})`;
  if (isUNSIGNED) {
    str = `${str} UNSIGNED`;
  }
  if (isZEROFILL) {
    str = isUNSIGNED ? `${str} ZEROFILL` : `${str} UNSIGNED ZEROFILL`;
  }
  return str;
}

export default {
  // 整型
  INTEGER: {
    // 范围非常小的整数，有符号的范围是 -128到127，无符号的范围是0到 255
    TINYINT: options => {
      return createInter('TINYINT', options);
    },
    // 范围较小的整数，有符号的范围是 -32768到32767，无符号的范围是0到 65535
    SMALLINT: options => {
      return createInter('SMALLINT', options);
    },
    // 中等大小的整数，有符号的范围是 -8388608到8388607，无符号的范围是0到 16777215。
    MEDIUMINT: options => {
      return createInter('MEDIUMINT', options);
    },
    // 正常大小的整数，有符号的范围是 -2147483648到 2147483647。无符号的范围是 0到4294967295。
    INT: options => {
      return createInter('INT', options);
    },
    // 大整数，有符号的范围是 -9223372036854775808到 9223372036854775807，无符号的范围是0到 18446744073709551615。
    BIGINT: options => {
      return createInter('BIGINT', options);
    },
  },

  // 浮点型
  FLOAT: {
    // 一个小的（单精度）浮点数。允许值是-3.402823466E+38 到-1.175494351E-38， 0以及1.175494351E-38 到3.402823466E+38,M是总位数，D是小数点后面的位数。
    FLOAT: options => {
      return createFloat('FLOAT', options);
    },
    // 正常大小（双精度）浮点数。允许值是 -1.7976931348623157E+308到-2.2250738585072014E-308，0以及 2.2250738585072014E-308到 1.7976931348623157E+308。M是总位数，D是小数点后面的位数
    DOUBLE: options => {
      return createFloat('DOUBLE', options);
    },
  },

  // 日期时间型
  DATE: {
    // 范围是’-838:59:59.000000’ 到’838:59:59.000000’
    TIME: 'TIME',
    // 支持的范围是 ‘1000-01-01’到 ‘9999-12-31’
    DATE: 'DATE',
    // 日期和时间组合。支持的范围是 ‘1000-01-01 00:00:00.000000’到 ‘9999-12-31 23:59:59.999999’。
    DATETIME: 'DATETIME',
    // 范围是’1970-01-01 00:00:01.000000’UTC到’2038-01-19 03:14:07.999999’UTC。
    TIMESTAMP: 'TIMESTAMP',
    // 范围是 1901到2155
    YEAR: 'YEAR',
  },

  // 字符型
  STRING: {
    // 一个固定长度的字符串，在存储时始终用空格填充指定长度。 M表示以字符为单位的列长度。
    CHAR: M => {
      if (!isNumber(M)) {
        return '';
      }
      return `CHAR(${M})`;
    },
    // 可变长度的字符串，M 表示字符的最大列长度，M的范围是0到65535
    VARCHAR: M => {
      if (!isNumber(M)) {
        return '';
      }
      return `VARCHAR(${M})`;
    },
    // L<2^8
    TINYTEXT: M => {
      if (!isNumber(M)) {
        return '';
      }
      return `TINYTEXT(${M})`;
    },
    // L<2^16
    TEXT: M => {
      if (!isNumber(M)) {
        return '';
      }
      return `TEXT(${M})`;
    },
    // L<2^24
    MEDIUMTEXT: M => {
      if (!isNumber(M)) {
        return '';
      }
      return `MEDIUMTEXT(${M})`;
    },
    // L<2^32
    LONGTEXT: M => {
      if (!isNumber(M)) {
        return '';
      }
      return `LONGTEXT(${M})`;
    },
    ENUM: M => {
      if (!isArray(M)) {
        return '';
      }
      return `ENUM(${M.join()})`;
    },
    SET: M => {
      if (!isArray(M)) {
        return '';
      }
      return `SET(${M.join()})`;
    },
  },
};
