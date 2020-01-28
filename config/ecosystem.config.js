/**
 * @file 生产环境下pm2的配置文件
 **/

module.exports = {
  apps: [
    {
      name: 'app1',
      script: './output/server.bundle.js',
      instances: 'max', // 应用启动实例个数，仅在cluster模式有效，默认为fork
      exec_mode: 'cluster',
      autorestart: true, // 自动重启
      min_uptime: '100s', // 最小运行时间，这里设置的是60s即如果应用程序在100s内退出，pm2会认为程序异常退出，此时触发重启max_restarts设置数量
      max_restarts: 10, // 设置应用程序异常退出重启的次数，默认15次（从0开始计数）
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
      },
      out_file: '../logs/pm2/stdout/blog-out.log', // 默认程序中标准输出的地方，除log4外
      error_file: '../logs/pm2/stderr/blog-err.log', // 默认程序中标准错误输出的地方，除log4外
      log_date_format: 'YYYY-MM-DD HH:mm Z', // 输出的日志时间格式
      merge_logs: false, // 将多个进程分开存放
      instance_var: 'INSTANCE_ID',
    },
  ],
};
