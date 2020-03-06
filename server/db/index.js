/**
 * @file mysql代理层
 */
import DBService from './DBService';

export const DBInstance = (function() {
  let instance = null;
  Function.prototype.before = function(fn) {
    const self = this;
    return function() {
      const sqlExist = fn(this, arguments);
      if (sqlExist) {
        return self.apply(this, arguments);
      }
    };
  };
  return function() {
    if (instance) {
      return instance;
    } else {
      instance = new DBService();
      ['createTable', 'insert', 'remove', 'update', 'select'].forEach(
        method => {
          instance[method] = instance[method].before(context => {
            return context.sql && true;
          });
        },
      );
      return instance;
    }
  };
})();
