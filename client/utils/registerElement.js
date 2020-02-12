/**
 * @file 注册Element-ui组件
 * */
import Vue from 'vue';

/**
 * @param {Object} eleArr 组件数组
 * @return null
 * */
export function registerToVue(eleArr) {
  Vue.prototype.$ELEMENT = { size: 'small' };
  eleArr.forEach(component => {
    Vue.use(component);
  });
}
