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
    SSRLog({ desc: 'ssr start：', type: 'wait', time: startTime, data: path });
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
            SSRLog({
              desc: `ssr success，${path} 耗时：`,
              data: `${endTime - startTime}ms`,
              type: 'success',
              time: endTime,
            });
            return resolve(app);
          })
          .catch(e => {
            SSRLog({ desc: `ssr ${path} 预取失败`, data: e, type: 'error' });
            return reject(e);
          });
      },
      e => {
        SSRLog({ desc: `ssr ${path} onReady失败`, data: e, type: 'error' });
        return reject(e);
      },
    );
  });
};

function SSRLog(options) {
  // if (process.env.NODE_ENV === 'production') {
  //     return;
  // }
  const { desc, data = '', type, time } = options;
  const timeStr = moment(time).format('YYYY-MM-DD HH:mm:ss');
  let render;
  switch (type) {
    case 'success':
      render = colors.green;
      break;
    case 'wait':
      render = colors.blue;
      break;
    case 'error':
      render = colors.red;
      break;
    default:
      break;
  }
  console.log(`${render(timeStr)} ${render(desc)}`, data);
}
