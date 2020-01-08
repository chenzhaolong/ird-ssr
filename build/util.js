/** *
 * @file webpack的工具文件
 * */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const compilerEnv = require('../config/compile');

module.exports = {
  // 处理样式加载器
  handleStyleLoader: function(env) {
    let styleLoader = {
      test: /\.css$/,
      use: [
        env === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        'css-loader',
      ],
    };
    if (compilerEnv.sass) {
      styleLoader.test = /\.(sa|sc|c)ss$/;
      styleLoader.use.push('sass-loader');
    } else if (compilerEnv.less) {
      styleLoader.test = /\.(le|c)ss$/;
      styleLoader.use.push('less-loader');
    }

    return styleLoader;
  },

  // 注册加载器
  registerLoader: function(env) {
    const StyleLoader = this.handleStyleLoader(env);
    return [StyleLoader];
  },

  // ssr模式
  getSSRWebpackConfig: function(tpl) {
    tpl.mode = 'production';
    let styleLoader = {
      test: /\.css$/,
      use: ['vue-style-loader', 'css-loader'],
    };
    if (compilerEnv.sass) {
      styleLoader.test = /\.(sa|sc|c)ss$/;
      styleLoader.use.push('sass-loader');
    } else if (compilerEnv.less) {
      styleLoader.test = /\.(le|c)ss$/;
      styleLoader.use.push('less-loader');
    }
    tpl.module.rules.push(styleLoader);
    return tpl;
  },

  // server-prod模式
  getServerProdWebpackConfig: function(tpl) {
    const pkg = require('../package.json');
    const externals = Object.keys(pkg.dependencies).concat(
      Object.keys(pkg.devDependencies),
    );
    if (!tpl.externals) {
      tpl.externals = externals;
    }
    return tpl;
  },
};
