/**
 * @file app的前端入口
 * todo: 处理这里的取消注册的逻辑
 */

import Vue from 'vue';
import { createApp } from '../client/app';
import { PrefetchService } from '../service/preFetchService';
import { isArray, get } from 'lodash';

const { app, store, router } = createApp();

// 服务端渲染的store替换客户端的store
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

// 路由钩子
router.beforeEach((to, from, next) => {
  PrefetchService.clientPrefetch(router, to, store)
    .then(d => {
      next();
    })
    .catch(e => {
      next();
    });
});

// 挂载
app.$mount('#app', true);
