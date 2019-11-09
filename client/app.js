/**
 * @file 应用前端入口
 */

import Vue from 'vue';
import App from './app.vue';
import router from './routes/router';
import store from './store/store';

// 创建一个app应用
export function createApp() {
  const app = new Vue({
    ...App,
    store,
    router,
  });
  return { app, router, store };
}
