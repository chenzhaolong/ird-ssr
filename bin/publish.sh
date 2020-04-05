#!/bin/sh

# param -d:重新编译vendor.dll.js和vendor-manifest.json，默认是不开启
DLL="NO"

# param -m: 编译模式
# m=asset：只编译静态资源
# m=all：重新编译全部，默认值
MODE="all"

installNpm() {
  if [ ! \( -d ./node_modules \) ];then
    npm i
  fi
}

runDll() {
  if [ $DLL = "YES" ];then
    npm run dll
  else
   if [ ! \( -f ./output/static/dll/vendor-manifest.json \) ];then
     npm run dll
   fi
  fi
}

compiler() {
  case $MODE in
    asset)
       npm run client prod;;
       npm run ssr;;
    *)
      npm run client prod
      npm run ssr
      npm run server:prod;;
  esac
}

moveFile() {
    cp ./bin/deploy.sh ./output/
    cp ./config/ecosystem.config.js ./output/
    cp ./package.json ./output/
}

makePack() {
   tar -czvf output.`date +%Y-%m-%d-%H-%M-%S`.tar.gz ./output
   rm -rf ./output
}

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
     *) shift;;
    esac
   done

   if [ ! \( -d ./output \) ];then
     mkdir ./output
   fi

   installNpm
   runDll
   compiler
   moveFile
   makePack
}

publish $1 $2 $3