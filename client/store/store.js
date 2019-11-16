/** * @file 状态管理器入口文件 */

import Vue from 'vue';
import Vuex from 'vuex';
import globalState from './global';

Vue.use(Vuex);

export default new Vuex.Store({
  ...globalState,
  modules: {},
});
