/**
 * @file 路由配置中心
 */
import actions from '../actions';

export default [
  {
    url: '',
    action: actions.action,
    method: 'get',
  },
  {
    url: '',
    action: [actions.action, actions.action1],
    method: 'get',
  },
];
