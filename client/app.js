/**
 * @file 应用前端入口
 */

import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './routes/router';
import { createStore } from './store/store';
import { ClientService } from './service/clientCgiService';

// 全局注入请求调用, 组件可直接调用this.$request
Vue.use(ClientService.installVue());

// 创建一个app应用
export function createApp() {
  const store = createStore();
  const router = createRouter();
  const app = new Vue({
    ...App,
    store,
    router,
  });
  return { app, router, store };
}
