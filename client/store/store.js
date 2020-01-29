/** * @file 状态管理器入口文件 */

import Vue from 'vue';
import Vuex from 'vuex';
import globalState from './global';

Vue.use(Vuex);
export function createStore() {
  const config = {
    ...globalState,
    modules: {
      demo: {
        state() {
          return { b: 1 };
        },
        actions: {
          changeDemoA({ commit }, pl) {
            return new Promise((res, rej) => {
              commit('changeDemo', pl || 'yes');
              rej();
            });
          },
        },
        mutations: {
          changeDemo(st, playload) {
            return (st.b = playload);
          },
        },
        getters: {},
      },
    },
  };

  return new Vuex.Store({ ...config });
}
