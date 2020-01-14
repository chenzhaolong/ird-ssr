#!/bin/sh

# param -d:重新编译vendor.dll.js和vendor-manifest.json，默认是不开启
DLL="NO"

# param -m: 编译模式
# m=client: 只重新编译客户端代码
# m=ssr：只重新编译ssr的代码
# m=server：只重新编译服务端代码
# m=all：重新编译全部，默认值
MODE="all"

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
    client)
       npm run client prod;;
    ssr)
       npm run ssr;;
    server)
       npm run server:prod;;
    *)
      npm run client prod
      npm run ssr
      npm run server:prod;;
  esac
}

moveFile() {
    cp ./bin/deploy.sh ./output/
    cp ./config/pm2.config.js ./output/
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

   runDll
   compiler
   moveFile
}

publish $1 $2 $3