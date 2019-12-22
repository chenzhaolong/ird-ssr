/**
 * @file 环境配置文件
 */

module.exports = {
  client: {
    domain: {
      test: '',
      prod: '',
    },
    respond: {
      main: 'data.data',
      code: 'data.code',
      msg: 'data.message',
    },
    validCode: [200, 0],
    timeout: 3000,
  },

  server: {
    apiPrefix: '',
  },
};
