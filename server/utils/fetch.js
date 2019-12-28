/**
 * @file 服务端请求底层
 */
import axios from 'axios';
const proxyConfig = require('../../config/env').server.proxy;

class ProxyFetch {
  createAxios(host, header) {
    return axios.create({
      baseURL: host,
      timeout: proxyConfig.timeout,
      headers: header,
    });
  }

  getOptions() {}

  requestSuccess() {}

  requestFail() {}

  fetch(options) {
    const { url, host, method, body, header } = options;
    if (!url || !host) {
      return Promise.reject('url or host is undefined');
    }
    const instance = this.createAxios(host, header);
    const requestOptions = this.getOptions(options);
    const success = this.requestSuccess;
    const fail = this.requestFail;
    return instance
      .request(requestOptions)
      .then(success)
      .catch(fail);
  }
}

export default new ProxyFetch();
