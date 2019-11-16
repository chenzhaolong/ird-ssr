/**
 * @file 预取数据服务
 */

export class PrefetchService {
  /**
   * 获取客户端要渲染的组件列表
   * @param {object} router 路由对象
   * @param {object} to 路由信息
   * @return {Promise}
   */
  static getClientMatchedComponents(router, to) {
    return new Promise((resolve, reject) => {
      const matchEdComponents = router.getMatchedComponents(to);
      if (matchEdComponents.length > 0) {
        resolve(
          matchEdComponents.map(component => {
            return typeof component === 'function' ? component() : component;
          }),
        );
      } else {
        reject();
      }
    });
  }

  /**
   * 客户端预取数据
   * @param {object} router 路由对象
   * @param {object} to 路由信息
   * @param {object} globalStore 状态对象
   * @return {Promise}
   */
  static clientPrefetch(router, to, globalStore) {
    const matchComponents = PrefetchService.getClientMatchedComponents(
      router,
      to,
    );
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
  }
}
