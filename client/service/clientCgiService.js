/**
 * @file 异步服务上层封装
 * cgi = {
 *     url: '',
 *     domain?: ''
 *     headers: {},
 *     body: {},
 *     interceptors: request | response | both
 * }
 */
import axios from 'axios';
import { get, set, isObject, omit } from 'lodash';

const clientEnv = require('../../config/env').client;

class ClientCgi {
  constructor() {
    this.validCode = clientEnv.validCode;
  }

  /**
   * 获取域名
   * @return {string}
   */
  getDomain() {
    if (process.env.NODE_ENV === 'production') {
      return clientEnv.domain.prod;
    } else {
      return clientEnv.domain.test;
    }
  }

  /**
   * 设置全局的请求头--包括自定义请求头
   */
  setCommonHeader(headers) {
    return headers;
  }

  /**
   * get请求的方式
   * @param {object} cgi
   * @param {object} extra
   * @return {Promise}
   */
  get(cgi, extra = {}) {
    const { url, domain, headers, body } = cgi;
    if (!url) {
      return Promise.reject('请输入正确的url');
    }
    let config = {
      method: 'get',
      url: url,
    };
    config.baseURL = domain ? domain : this.getDomain();
    config.timeout = clientEnv.timeout;
    config.responseType = 'json';

    if (body && isObject(body) && Object.keys(body).length > 0) {
      config.params = body;
    }

    if (headers && isObject(headers) && Object.keys(headers).length > 0) {
      config.headers = headers;
    }
    config.headers = this.setCommonHeader(config.headers);

    if (extra && isObject(extra) && Object.keys(extra).length > 0) {
      config = { ...config, ...extra };
    }

    return this.request(config);
  }

  /**
   * post请求的方式
   * @param {object} cgi
   * @param {object} extra
   * @return {Promise}
   */
  post(cgi, extra) {
    const { url, domain, headers, body } = cgi;
    if (!url) {
      return Promise.reject('请输入正确的url');
    }
    let config = {
      method: 'post',
      url: url,
    };
    config.baseURL = domain ? domain : this.getDomain();
    config.timeout = clientEnv.timeout;
    config.responseType = 'json';

    if (body && isObject(body) && Object.keys(body).length > 0) {
      config.data = body;
    }

    if (headers && isObject(headers) && Object.keys(headers).length > 0) {
      config.headers = headers;
    }
    config.headers = this.setCommonHeader(config.headers);

    if (extra && isObject(extra) && Object.keys(extra).length > 0) {
      config = { ...config, ...extra };
    }

    return this.request(config);
  }

  /**
   * 发起请求
   * @param {object} config
   * @return {Promise}
   */
  request(config) {
    return new Promise((resolve, reject) => {
      axios(config)
        .then(response => {
          const data = get(response, clientEnv.respond.main, {});
          const code = get(response, clientEnv.respond.code);
          if (code && this.validCode.indexOf(code) !== -1) {
            resolve(data);
          } else {
            reject({
              code,
              msg: get(response, clientEnv.respond.msg),
            });
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  /**
   * 安装到vue中
   */
  static installVue() {
    return {
      install(Vue) {
        if (!Vue.prototype.$request) {
          Vue.prototype.$request = new ClientCgi();
        }
      },
    };
  }
}

export default new ClientCgi();
