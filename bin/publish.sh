#!/bin/sh

# param -d:重新编译vendor.dll.js和vendor-manifest.json，默认是不开启
DLL="no"

# param -m: 编译模式
# m=asset：只编译静态资源
# m=all：重新编译全部，默认值
MODE="all"

# param -v: 更新版本号
# v=patch：迭代和修复类型，只修改package.json中version的最后一位，默认
# v=minor：大需求类型，只修改package.json中version的中间位
# v=major：大版本改造类型，只修改package.json中version的中间位
# v=""：不执行版本更新
VERSION=""

# param -pi: 是否本地打包完后预先下载相关依赖
# pi=no: 不需要，在执行deploy脚本是npm i
# pi=yes：需要，在编译完后下载npm i，执行deploy时不需要下载
PRE_INSTALL="no"

# param -pa: 是否需要压缩
# pa=no 不需要
# pa=yes 需要
IsPack="no"

# param：是否采用命令行输入的参数为主
CLOSE_JSON="no"

PUBLISH_FILE="./publish.json"

source ./bin/installEnv.sh

# 生成dll文件
runDll() {
  #if [ $DLL = "yes" ];then
    #npm run dll
  #else
   #if [ ! \( -f ./output/static/dll/vendor-manifest.json \) ];then
     #npm run dll
   #fi
  #fi
  npm run dll $DLL
}

# 编译
compiler() {
  case $MODE in
    asset)
       npm run client prod
       npm run ssr;;
    *)
      npm run client prod
      npm run ssr
      npm run server:prod;;
  esac
}

# 迁移文件
moveFile() {
    cp ./bin/deploy.sh ./output/
    cp ./config/ecosystem.config.js ./output/
    cp ./package.json ./output/
}

# 打包
makePack() {
   tar -czvf output.`date +%Y-%m-%d-%H-%M-%S`.tar.gz ./output
   rm -rf ./output
}

# 更新版本号
updateVersion() {
   if [ "$VERSION" != "" ];then
     npm version $VERSION
   fi
}

# 预先下载资源
preInstallSource() {
  if [ "$PRE_INSTALL" == "yes" ];then
    cd ./output && npm i --production
  fi
  cd ../
}

# 执行发布
publish() {
   # 解析命令行传入的参数
   while [ -n "$1" ]
      do
        case "$1" in
        -d)
           DLL="yes"
           shift;;
        -m)
           if [ -n "$2" ];then
             MODE="$2"
             shift
           fi;;
        -v)
           if [ -n "$2" ];then
             VERSION="$2"
             shift
           fi;;
        -pi)
           if [ -n "$2" ];then
             PRE_INSTALL="$2"
             shift
           fi;;
        -pa)
           if [ -n "$2" ];then
             IsPack="$2"
             shift
           fi;;
        -oj)
           if [ -n "$2" ];then
             CLOSE_JSON="$2"
             shift
           fi;;
        *) shift;;
      esac
    done

   # 安装依赖
   installNpm
   if [ "$CLOSE_JSON" == "no" ];then
     installJq
   fi
   isExistJq=$(isExist jq)

   # 解析publish.json文件
   if [ "$isExistJq" != "" ]&&[ "$CLOSE_JSON" == "no" ];then
     if [ -f $PUBLISH_FILE ];then
        DLL=$(jq .dll $PUBLISH_FILE | sed 's/\"//g')
        MODE=$(jq .mode $PUBLISH_FILE | sed 's/\"//g')
        VERSION=$(jq .version $PUBLISH_FILE | sed 's/\"//g')
        IsPack=$(jq .pack $PUBLISH_FILE | sed 's/\"//g')
        PRE_INSTALL=$(jq .pi $PUBLISH_FILE | sed 's/\"//g')
     fi
   fi

   echo "\033[32m CLOSE_JSON:$CLOSE_JSON \033[0m"
   echo "\033[32m MODE:$MODE \033[0m"
   echo "\033[32m DLL:$DLL \033[0m"
   echo "\033[32m VERSION:$VERSION \033[0m"
   echo "\033[32m IsPack:$IsPack \033[0m"
   echo "\033[32m PRE_INSTALL:$PRE_INSTALL \033[0m"
   updateVersion

   if [ ! \( -d ./output \) ];then
     mkdir ./output
   fi

   runDll
   compiler
   moveFile
   preInstallSource
   if [ $IsPack == "yes" ];then
      makePack
   fi
}

publish $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11