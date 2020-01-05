/**
 * @file app的ssr封装入口
 * todo: ssr的耗时时间
 **/

import { createApp } from '../client/app';
import { get } from 'lodash';
import { PrefetchService } from '../service/preFetchService';

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();
    const path = get(context, 'request.url', '');
    const query = get(context, 'request.query', {});
    if (!path) {
      return reject();
    }
    router.push(path);
    router.onReady(
      () => {
        const asyncComponents = router.getMatchedComponents();
        if (asyncComponents.length === 0) {
          return reject();
        }
        PrefetchService.serverPrefetch(asyncComponents, store, query)
          .then(() => {
            context.state = { ...context.state, ...store.state };
            return resolve(app);
          })
          .catch(e => {
            return reject(e);
          });
      },
      e => {
        return reject(e);
      },
    );
  });
};
