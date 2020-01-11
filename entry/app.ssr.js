/**
 * @file app的ssr封装入口
 **/

import { createApp } from '../client/app';
import { get } from 'lodash';
import { PrefetchService } from '../service/preFetchService';
import colors from 'colors';
import moment from 'moment';

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();
    const path = get(context, 'request.url', '');
    const query = get(context, 'request.query', {});
    if (!path) {
      return reject();
    }
    const startTime = Date.now();

    context.logger.ssr({ msg: path, type: 'start', time: startTime });

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

            const endTime = Date.now();
            context.logger.ssr({
              msg: `${path} 耗时：${endTime - startTime}ms`,
              type: 'success',
              time: endTime,
            });

            return resolve(app);
          })
          .catch(e => {
            context.logger.ssr({
              msg: `${path} 预取失败 ${e.message}`,
              type: 'error',
            });
            return reject(e);
          });
      },
      e => {
        context.logger.ssr({
          desc: `${path} onReady失败 ${e.message}`,
          type: 'error',
        });
        return reject(e);
      },
    );
  });
};
