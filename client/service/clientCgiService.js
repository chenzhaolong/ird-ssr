/**
 * @file 异步服务上层封装
 * cgi = {
 *     url: '',
 *     domain?: ''
 *     headers?: {},
 *     body: {},
 *     ejectType?: request | response | both
 * }
 * clientCgi.get({url: '', body: {}}).then()
 * clientCgi.interceptors(() => {}).get({url: '', body: '', ejectType: 'request'})
 */
import axios from 'axios';
import { get, set, isObject, omit, isFunction } from 'lodash';

const clientEnv = require('../../config/env').client;

class ClientCgi {
  constructor() {
    this.validCode = clientEnv.validCode;
    this.axios = axios.create();
    this.requestCallback = null;
    this.responseCallback = null;
  }

  /**
   * 获取域名
   * @return {string}
   */
  _getDomain() {
    if (process.env.NODE_ENV === 'production') {
      return clientEnv.domain.prod;
    } else {
      return clientEnv.domain.test;
    }
  }

  /**
   * 设置全局的请求头--包括自定义请求头
   */
  _setCommonHeader(headers) {
    return headers;
  }

  /**
   * get请求的方式
   * @param {object} cgi
   * @param {object} extra
   * @return {Promise}
   */
  get(cgi, extra = {}) {
    const { url, domain, headers, body, ejectType } = cgi;
    if (!url) {
      return Promise.reject('请输入正确的url');
    }
    let config = {
      method: 'get',
      url: url,
    };
    config.baseURL = domain ? domain : this._getDomain();
    config.timeout = clientEnv.timeout;
    config.responseType = 'json';

    if (body && isObject(body) && Object.keys(body).length > 0) {
      config.params = body;
    }

    if (headers && isObject(headers) && Object.keys(headers).length > 0) {
      config.headers = headers;
    }
    config.headers = this._setCommonHeader(config.headers);

    if (extra && isObject(extra) && Object.keys(extra).length > 0) {
      config = { ...config, ...extra };
    }

    if (ejectType) {
      return this._requestWithInterceptors(config, ejectType);
    }
    return this._request(config);
  }

  /**
   * post请求的方式
   * @param {object} cgi
   * @param {object} extra
   * @return {Promise}
   */
  post(cgi, extra) {
    const { url, domain, headers, body, ejectType } = cgi;
    if (!url) {
      return Promise.reject('请输入正确的url');
    }
    let config = {
      method: 'post',
      url: url,
    };
    config.baseURL = domain ? domain : this._getDomain();
    config.timeout = clientEnv.timeout;
    config.responseType = 'json';

    if (body && isObject(body) && Object.keys(body).length > 0) {
      config.data = body;
    }

    if (headers && isObject(headers) && Object.keys(headers).length > 0) {
      config.headers = headers;
    }
    config.headers = this._setCommonHeader(config.headers);

    if (extra && isObject(extra) && Object.keys(extra).length > 0) {
      config = { ...config, ...extra };
    }

    if (ejectType) {
      return this._requestWithInterceptors(config, ejectType);
    }
    return this._request(config);
  }

  /**
   * 发起请求
   * @param {object} config
   * @return {Promise}
   */
  _request(config) {
    return new Promise((resolve, reject) => {
      this.axios(config)
        .then(response => {
          const data = get(response.data, clientEnv.respond.body, {});
          const code = get(response.data, clientEnv.respond.code);
          if (code && this.validCode.indexOf(code) !== -1) {
            resolve(data);
          } else {
            reject(response.data);
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  /**
   * 请求后销毁拦截器
   * @param {object} config
   * @param {string} ejectType
   * @return {Promise}
   */
  _requestWithInterceptors(config, ejectType) {
    const cancelInterceptors = () => {
      switch (ejectType) {
        case 'request':
          this.axios.interceptors.request.eject(this.requestCallback);
          this.requestCallback = null;
          break;
        case 'response':
          this.axios.interceptors.request.eject(this.responseCallback);
          this.responseCallback = null;
          break;
        case 'both':
          this.axios.interceptors.request.eject(this.requestCallback);
          this.axios.interceptors.request.eject(this.responseCallback);
          this.requestCallback = null;
          this.responseCallback = null;
          break;
        default:
          break;
      }
    };

    return this._request(config)
      .then(data => {
        cancelInterceptors();
        return data;
      })
      .catch(e => {
        cancelInterceptors();
        throw new Error(e);
      });
  }

  /**
   * 拦截器
   * @param {Function} requestCallback
   * @param {Function} responseCallback
   * @return {Object}
   */
  interceptors(requestCallback = null, responseCallback = null) {
    const rejectCallback = error => {
      return Promise.reject(error);
    };

    if (requestCallback) {
      this.requestCallback = requestCallback;
      this.axios.interceptors.request.use(requestCallback, rejectCallback);
    }

    if (responseCallback) {
      this.responseCallback = responseCallback;
      this.axios.interceptors.response.use(responseCallback, rejectCallback);
    }

    return this;
  }

  /**
   * 常量
   */
  static Constant = {
    REQUEST: 'request',
    RESPONSE: 'response',
    BOTH: 'both',
  };

  /**
   * 安装到vue中,this.$request({})
   * @param {Function} callback
   */
  static installVue(callback) {
    return {
      install(Vue) {
        if (!Vue.prototype.$request) {
          if (callback && isFunction(callback)) {
            // 给axios实例添加拦截器登格外操作
            Vue.prototype.$request = callback(new ClientCgi());
          } else {
            Vue.prototype.$request = new ClientCgi();
          }
        }
      },
    };
  }
}

export const CgiService = new ClientCgi();

export const ClientService = ClientCgi;
