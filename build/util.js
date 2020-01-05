/** * @file webpack的工具文件 */

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const compilerEnv = require('../config/compile').client;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  // 处理样式加载器
  handleStyleLoader: function() {
    let styleLoader = {
      test: /\.css$/,
      use: [
        compilerEnv.env === 'production'
          ? MiniCssExtractPlugin.loader
          : 'style-loader',
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
  registerLoader: function() {
    const StyleLoader = this.handleStyleLoader();
    return [StyleLoader];
  },

  // 注册插件
  registerPlugins: function() {
    return [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new MiniCssExtractPlugin({
        filename: 'style/[name].[hash].css',
        chunkFilename: 'style/[id].[hash].css',
      }),
    ];
  },

  // 生产模式
  getClientProdWebpackConfig: function(tpl) {
    tpl.mode = 'production';

    tpl.output = Object.assign({}, tpl.output, {
      filename: 'main.min.js',
      chunkFilename: 'chunk/[name].chunk.min.js?_t=[chunkhash]',
    });

    tpl.resolve.alias.vue = 'vue/dist/vue.runtime.min.js';

    // loader
    const ProdLoaders = this.registerLoader();
    ProdLoaders.forEach(loaders => {
      tpl.module.rules.push(loaders);
    });

    // plugins
    const ProdPlugins = this.registerPlugins();
    ProdPlugins.forEach(plugins => {
      tpl.plugins.push(plugins);
    });

    // optimization
    tpl.optimization.minimizer = [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ];

    return tpl;
  },

  // 开发模式
  getClientDevWebpackConfig: function(tpl) {
    tpl.mode = 'development';

    tpl.output = Object.assign({}, tpl.output, {
      filename: 'main.js',
      chunkFilename: 'chunk/[name].chunk.js?_t=[chunkhash]',
    });

    tpl.devtool = 'inline-source-map';

    // loader
    const DevLoaders = this.registerLoader();
    DevLoaders.forEach(loaders => {
      tpl.module.rules.push(loaders);
    });

    return tpl;
  },

  // ssr模式
  getSSRWebpackConfig: function(tpl) {
    tpl.mode = compilerEnv.env || 'production';
    let styleLoader = {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    };
    if (compilerEnv.sass) {
      styleLoader.test = /\.(sa|sc|c)ss$/;
      styleLoader.use.push('sass-loader');
    } else if (compilerEnv.less) {
      styleLoader.test = /\.(le|c)ss$/;
      styleLoader.use.push('less-loader');
    }
    tpl.module.rules.push(styleLoader);
    // const styleLoader = this.handleStyleLoader();
    // tpl.module.rules.push(styleLoader);
    // if (compilerEnv.env === 'production') {
    //   tpl.plugins.push(
    //     new MiniCssExtractPlugin({
    //       filename: 'style/[name].[hash].css',
    //       chunkFilename: 'style/[id].[hash].css',
    //     }),
    //   );
    // }
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
