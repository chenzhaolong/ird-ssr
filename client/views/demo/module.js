/**
 * demo的局部store配置
 */

export const config = {
  name: 'demo',
  preserveState: false,
  store: {
    state() {
      return { a: 1 };
    },
    getters: {},
    mutations: {
      change(st, playload) {
        return (st.a = playload);
      },
    },
    actions: {},
  },
};
