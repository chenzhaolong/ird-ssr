/**
 * @file 编译配置
 * todo:后续决定是否和配置文件合并
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
