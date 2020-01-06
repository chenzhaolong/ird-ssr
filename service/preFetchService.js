/**
 * @file 预取数据服务
 * todo: 优化健壮这里的代码
 */
import { get, isFunction } from 'lodash';

export class PrefetchService {
  /**
   * 获取客户端要渲染的组件列表
   * @param {object} router 路由对象
   * @param {object} to 路由信息
   * @return {Promise}
   */
  static getClientMatchedComponents(router, to) {
    const matchEdComponents = router.getMatchedComponents(to);
    return Promise.all(
      matchEdComponents.map(component => {
        return typeof component === 'function' ? component() : component;
      }),
    );
  }

  /**
   * 客户端预取数据
   * @param {object} router 路由对象
   * @param {object} to 路由信息
   * @param {object} globalStore 状态对象
   * @return {Promise}
   */
  static clientPrefetch(router, to, globalStore) {
    const promise = PrefetchService.getClientMatchedComponents(router, to);
    return promise.then(matchComponents => {
      return Promise.all(
        matchComponents.map(component => {
          const { dynamicStore, preFetch } = component;
          // 是否动态注册store
          if (dynamicStore && Object.keys(dynamicStore).length > 0) {
            const { name, preserveState = false, store } = dynamicStore;
            globalStore.registerModule(name, { ...store }, { preserveState });
          }
          // 预取数据
          if (typeof preFetch == 'function') {
            return preFetch(globalStore, to.query);
          }
          return Promise.resolve();
        }),
      );
    });
  }

  /**
   * 服务端预取数据
   * @param {array} asyncComponents 解析出来的异步组件
   * @param {object} globalStore store对象
   * @param {object} query 查询字符串对象
   * @return {Promise}
   */
  static serverPrefetch(asyncComponents, globalStore, query) {
    return Promise.all(
      asyncComponents.map(component => {
        const preFetch = get(component, 'preFetch');
        const dynamicStore = get(component, 'dynamicStore', {});
        // 是否动态注册store
        if (dynamicStore && Object.keys(dynamicStore).length > 0) {
          const { name, preserveState = false, store } = dynamicStore;
          globalStore.registerModule(name, { ...store }, { preserveState });
        }
        // 预取数据
        if (preFetch && isFunction(preFetch)) {
          return preFetch(globalStore, query);
        } else {
          return Promise.reject();
        }
      }),
    );
  }
}
