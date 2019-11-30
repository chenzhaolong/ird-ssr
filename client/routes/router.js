/** * @file 路由入口文件 */
import Vue from 'vue';
import Router from 'vue-router';

const Demo = () =>
  require.ensure([], require => require('../views/demo/index.vue'), 'demo');
const Demo1 = () =>
  require.ensure([], require => require('../views/demo1/index.vue'), 'demo1');

Vue.use(Router);
export default new Router({
  mode: 'history',
  routes: [
    { path: '/demo/app', component: Demo },
    { path: '/demo/app1', component: Demo1 },
  ],
});
