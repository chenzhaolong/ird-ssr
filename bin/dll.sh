#!/bin/sh

copyDll() {
  if [ ! \( -d ./output \) ];then
    mkdir ./output
  fi
  if [ ! \( -d ./output/static \) ];then
    mkdir ./output/static
  fi
  if [ ! \( -d ./output/static/dll \) ];then
    mkdir ./output/static/dll
  fi

  cp -rf ./config/dll/ ./output/static/dll/
  echo "\033[32m dll编译完成 \033[0m"
}

dll() {
   if [ "$1" == "yes" ];then
      cross-env NODE_ENV=production webpack --progress --hide-modules --config ./build/webpack.dll.js
      copyDll
   elif [ "$1" == "local" ];then
      cross-env NODE_ENV=production webpack --progress --hide-modules --config ./build/webpack.dll.js
      echo "\033[32m dll本地编译完成 \033[0m"
   else
     if [ ! \( -f ./config/dll/vendor-manifest.json \) ];then
        cross-env NODE_ENV=production webpack --progress --hide-modules --config ./build/webpack.dll.js
     fi
     copyDll
   fi
}

dll $1