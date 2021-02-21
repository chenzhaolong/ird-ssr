# ird-ssr

一套基于vue搭建的ssr项目骨架，该套骨架具备完整的项目开发能力，大部分底层都封装完备，ird-ssr主要由以下特点：
1. 开箱即用，不用再考虑ssr封装的事情；
2. 基于log4js封装了一套日志库，拿来即用；
3. 基于axios封装的异步请求库，可用于客户端和服务端发起请求；
4. 基于pm2进程守护，不需要额外再配置；
5. 打包部署脚本已经开发好，只需关心业务层的开发，其他事情无序关心；
6. 该套骨架可以再ssr运行出错时自动降级到csr，或者配置csr白名单；

## Node 版本

```
node 8.x 以上
```

## 本地运行

```
npm run server:dev
```

## 打包项目

```
// dll
npm run dll
// 客户端资源
npm run client
// ssr资源
npm run ssr
// 服务端资源
server:prod
```


```
// 全部资源打包编译
npm run publish

// 参数
# param -m: 编译模式
# m=asset：只编译静态资源
# m=all：重新编译全部，默认值

# param -v: 更新版本号
# v=patch：迭代和修复类型，只修改package.json中version的最后一位，默认
# v=minor：大需求类型，只修改package.json中version的中间位
# v=major：大版本改造类型，只修改package.json中version的中间位
# v=""：不执行版本更新

# param -pi: 是否本地打包完后预先下载相关依赖
# pi=no: 不需要，在执行deploy脚本是npm i
# pi=yes：需要，在编译完后下载npm i，执行deploy时不需要下载

# param -pa: 是否需要压缩
# pa=no 不需要
# pa=yes 需要
```
为了更方便编译打包，项目钟有一个publish.json，该json文件的作用就是配置上述参数的参数值，最后直接运行npm run publish就可以

## 部署：

```
sh deploy.sh 

// 后面可选参数
#start     启动  默认
#restart   重启
#reload    重新加载
#stop      暂停
#delete    删除
```

## 目录介绍：

client/ 客户端代码

server/ 服务端代码
- actions：api逻辑层，处理本地逻辑
- proxyActions：api代理逻辑层，处理其他服务返回的逻辑
- errorTpl：默认的错误页面
- middleware/base：本项目的中间件
- routes：api绑定层
- utils：工具层
- db：mysql层，后续会单独抽离成一个plugins，放在另一个仓库

mock/  用来提供给server层造脏数据用；

service/ 全局服务层

config/配置层，主要时log4和pm2的配置

enrty/ 入口层

build/ webpacl配置层

bin/ 脚本

## 后续规划：

- 另一个仓库node-plugins作为本项目的插件库，从而可以提供更多基于ssr或者node的好用插件；
- 该项目暂时对element-ui支持不太友好，后续会完备这一块；

想要知道本项目更多的设计理念：可看http://note.youdao.com/s/DskxabDC