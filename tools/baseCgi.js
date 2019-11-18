/**
 * @file 异步服务基类-使用在client和server
 */

import axios from 'axios/index';

export default class BaseCgi {
  constructor() {
    this.method = '';
    this.domain = '';
    this.headers = {};
    this.body = {};
    this.query = {};
    this.validCode = [];
  }

  /**
   * get请求
   * @param {string} url 请求的地址
   * @return {object}
   */
  get(url) {}

  /**
   * post请求
   * @param {string} url 请求的地址
   * @return {object}
   */
  post(url) {}

  /**
   * 并行处理
   * @param {Array} cgiArr 请求数组
   * @return {Promise}
   */
  all(cgiArr) {}

  /**
   * 拦截器
   * @param {string} type 拦截的类型，目前只有request和response
   * @return {Promise}
   */
  interceptors(type) {}

  /**
   * 取消拦截器
   * @param {string} type 拦截的类型，目前只有request和response
   * @param {object} instance axios实例
   * @return {Promise}
   */
  eject(type, instance) {}

  /**
   * 发起请求
   * @param {string} method 方式
   * @param {string} url 请求的路径
   * @return {Promise}
   */
  then(method, url) {}

  /**
   * post请求体
   * @param {object} params 请求体
   * @return {object}
   */
  body(params) {}

  /**
   * get请求体
   * @param {object} params 请求体
   * @return {object}
   */
  query(params) {}

  /**
   * 请求头
   * @param {object} params 头部信息
   * @return {object}
   */
  setHeaders(params) {}
}
