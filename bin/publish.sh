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
VERSION="patch"

# param：是否采用命令行输入的参数为主
CLOSE_JSON="no"

PUBLISH_FILE="./publish.json"

source ./bin/installEnv.sh

# 生成dll文件
runDll() {
  if [ $DLL = "yes" ];then
    npm run dll
  else
   if [ ! \( -f ./output/static/dll/vendor-manifest.json \) ];then
     npm run dll
   fi
  fi
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

# 执行发布
publish() {
   isParseParams="no"

   # 安装依赖
   installNpm
   installJq
   isExistJq=$(isExist jq)

   # 解析publish.json文件
   if [ "$isExistJq" != "" ]&&[ "$CLOSE_JSON" == "no" ];then
     if [ -f $PUBLISH_FILE ];then
        DLL=$(jq .dll $PUBLISH_FILE | sed 's/\"//g')
        MODE=$(jq .mode $PUBLISH_FILE | sed 's/\"//g')
        VERSION=$(jq .version $PUBLISH_FILE | sed 's/\"//g')
        IsPack=$(jq .pack $PUBLISH_FILE | sed 's/\"//g')
     else
        isParseParams="yes"
     fi
   else
     isParseParams="yes"
   fi

   # 解析命令行传入的参数
   if [ $isParseParams == "yes" ];then
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
          *) shift;;
        esac
      done
   fi

   echo MODE:$MODE
   echo DLL:$DLL
   echo VERSION:$VERSION
   updateVersion

   if [ ! \( -d ./output \) ];then
     mkdir ./output
   fi

   runDll
   compiler
   moveFile
   if [ $IsPack == "yes" ];then
      makePack
   fi
}

publish $1 $2 $3 $4 $5