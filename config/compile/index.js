/**
 * @file 编译配置
 */

module.exports = {
  client: {
    env: 'production',
    sass: false,
    less: false,
    htmlPath: '../index.template.html',
  },
  server: {
    env: 'production',
    port: 8011,
  },
};
