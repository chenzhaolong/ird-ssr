/**
 * @file 编译配置
 */

module.exports = {
  sass: false,
  less: false,
  htmlPath: '../index.template.html',
  logger: {
    basePath: '../../logs',
    path: {
      default: './access/info',
      ssr: './ssr/ssr',
      http: './http/http',
      error: './error/error',
    },
    interval: 'yyyy-MM-dd.log', // 时间间隔
    keepDays: 30, // 保持30天，30天后删除
    keepFileExt: true, // pettern模式是放在文件的后面还是前面
    encoding: 'utf-8',
    mergeName: true,
  },
};
