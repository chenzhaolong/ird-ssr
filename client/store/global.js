/**
 * @file 全局注册的state
 */

export default {
  state() {
    return { a: 1 };
  },
  actions: {},
  mutations: {
    change(st, playload) {
      return (st.a = playload);
    },
  },
  getters: {},
};
