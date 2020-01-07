/**
 * @file 应用前端入口
 */

import Vue from 'vue';
import Vuex from 'vuex';
import App from './app.vue';
import router from './routes/router';
import storeConfig from './store/store';

// 创建一个app应用
Vue.use(Vuex);
export function createApp() {
  const store = new Vuex.Store({ ...storeConfig });
  const app = new Vue({
    ...App,
    store,
    router,
  });
  return { app, router, store };
}
