/**
 * @file mysql代理层
 */
import DBService from './utils/DBService';

export const DBInstance = (function() {
  let instance = null;
  return function() {
    if (instance) {
      return instance;
    } else {
      return (instance = new DBService());
    }
  };
})();
