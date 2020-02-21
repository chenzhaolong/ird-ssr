/**
 * @file app的前端入口
 */

import { createApp } from '../client/app';
import { PrefetchService } from '../service/preFetchService';

const { app, store, router } = createApp();

// 获取路由信息
function getQuery() {
  const obj = {};
  if (window.location.search) {
    const str = window.location.search.split('?')[1];
    const array = str.split('&');
    array.forEach(item => {
      const kv = item.split('=');
      obj[kv[0]] = kv[1];
    });
  }
  return obj;
}

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

// 挂载，如果是csr或者是平滑降级的csr，执行preFetch
if (window._ssrDemotion && window._ssrDemotion === 'yes') {
  PrefetchService.clientPrefetch(
    router,
    {
      path: window.location.pathname,
      query: getQuery(),
      hash: window.location.hash,
    },
    store,
  )
    .then(d => {
      app.$mount('#app');
    })
    .catch(e => {
      app.$mount('#app');
    });
} else {
  app.$mount('#app', true);
}
