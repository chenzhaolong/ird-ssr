/**
 * @file 代理api层
 * 1对1：
 * { from：给client的api，to：目标api，host：目标域名，method：请求方式，actions: 行为层 }
 * 1对多(并列请求)
 * { from：给client的api，method：请求方式，actions: 行为层, group: 目标api数组 }
 * group: [{to, host, method}]
 */
import proxyActions from '../proxyActions';

export default [
  {
    from: '',
    to: '',
    host: '',
    method: '',
    actions: proxyActions,
  },
];
