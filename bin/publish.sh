#!/bin/sh

# param -d:重新编译vendor.dll.js和vendor-manifest.json，默认是不开启
DLL="NO"

# param -m: 编译模式
# m=asset：只编译静态资源
# m=all：重新编译全部，默认值
MODE="all"

# param -v: 更新版本号
# v=patch：迭代和修复类型，只修改package.json中version的最后一位，默认
# v=minor：大需求类型，只修改package.json中version的中间位
# v=major：大版本改造类型，只修改package.json中version的中间位
VERSION="patch"

# 下载依赖
installNpm() {
  if [ ! \( -d ./node_modules \) ];then
    npm i
  fi
}

# 生成dll文件
runDll() {
  if [ $DLL = "YES" ];then
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
   npm version $VERSION
}

// 执行发布
publish() {
   while [ -n "$1" ]
   do
     case "$1" in
     -d)
        DLL="YES"
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

   if [ ! \( -d ./output \) ];then
     mkdir ./output
   fi

   installNpm
   runDll
   compiler
   updateVersion
   moveFile
   makePack
}

publish $1 $2 $3 $4 $5