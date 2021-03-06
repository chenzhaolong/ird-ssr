/**
 * @file 服务端请求底层
 * tips: 尽量保持该文件的简洁性
 */
import axios from 'axios';
const proxyConfig = require('../../config/env').server.proxy;

class ProxyFetch {
  createAxios(host, header) {
    return axios.create({
      // baseURL: host,
      timeout: proxyConfig.timeout,
      headers: header,
    });
  }

  getOptions(options) {
    const { method, body, url, host } = options;
    const params = { method, url: host + url };
    const key = method === 'get' ? 'params' : 'data';
    params[key] = body;
    return params;
  }

  fetch(options) {
    const { url, host, header } = options;
    if (!url || !host) {
      return Promise.reject('url or host is undefined');
    }
    const instance = this.createAxios(host, header);
    const requestOptions = this.getOptions(options);
    return instance
      .request(requestOptions)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  }
}

export default new ProxyFetch();
