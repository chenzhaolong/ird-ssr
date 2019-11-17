/**
 * @file 异步服务上层封装
 * cgi = {
 *     url: ''
 *     baseUrl?: ''
 *     headers: {},
 *     body: {}
 * }
 */

import BaseCgi from '../../tools/baseCgi';

class ClientCgi {
  constructor(baseCgi) {
    this.baseCgi = baseCgi;
  }

  /**
   * get请求的方式
   * @param {object} cgi
   * @return {Promise}
   */
  get(cgi) {}

  /**
   * post请求的方式
   * @param {object} cgi
   * @return {Promise}
   */
  post(cgi) {}

  /**
   * 底层baseCgi的指针
   * @param {url} url
   * @param {string} method
   * @return {Promise}
   */
  request(url, method) {}

  /**
   * 在请求后将数据同步到store
   * @param {any} state 数据
   * @return {Promise}
   */
  commit(state) {}
}

export default new ClientCgi(new BaseCgi());
