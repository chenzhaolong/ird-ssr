/**
 * @file 异步服务上层封装
 * cgi = {
 *     url: '',
 *     domain?: ''
 *     headers: {},
 *     body: {},
 *     mutation: string
 * }
 */

import BaseCgi from '../../tools/baseCgi';
import { get } from 'lodash';

const Env = require('../../config/env');

const validCode = [200];

class ClientCgi {
  constructor(baseCgi) {
    this.baseCgi = baseCgi;
    this.baseCgi.validCode = validCode;
    this.baseCgi.domain = this.getDomain();
    this.baseCgi.headers = {};
  }

  /**
   * 获取域名
   * @return {string}
   */
  getDomain() {
    if (process.env.NODE_ENV === 'production') {
      return Env.client.domain.prod;
    } else {
      return Env.client.domain.test;
    }
  }

  /**
   * get请求的方式
   * @param {object} cgi
   * @return {Promise}
   */
  get(cgi) {
    const { url, domain, headers, body, mutation } = cgi;
    if (!url) {
      return Promise.reject('请输入正确的url');
    }
    if (domain) {
      this.baseCgi.domain = domain;
    }
    const request = this.baseCgi.get(url).query(body);

    if (headers && Object.keys(headers).length > 0) {
      request.setHeader(headers);
    }
    return request
      .then(result => {
        let data = get(result, Env.client.respondKey, {});
        if (mutation) {
          this.commit(mutation, data);
        }
        return data;
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  /**
   * post请求的方式
   * @param {object} cgi
   * @return {Promise}
   */
  post(cgi) {
    const { url, domain, headers, body, mutation } = cgi;
    if (!url) {
      return Promise.reject('请输入正确的url');
    }
    if (domain) {
      this.baseCgi.domain = domain;
    }
    const request = this.baseCgi.post(url).body(body);

    if (headers && Object.keys(headers).length > 0) {
      request.setHeader(headers);
    }
    return request
      .then(result => {
        let data = get(result, Env.client.respondKey, {});
        if (mutation) {
          this.commit(mutation, data);
        }
        return data;
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  /**
   * 底层baseCgi的指针
   * @param {url} url
   * @param {string} method
   * @return {Promise}
   */
  request(url, method) {}

  /**
   * 在请求后将数据同步到store
   * @param {string} mutation mutation的名称
   * @param {any} state 数据
   * @return void
   */
  commit(mutation, state) {}
}

export default new ClientCgi(new BaseCgi());
