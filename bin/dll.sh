#!/bin/sh

dll() {
  #env="production"
  #if [ "$1" == "dev" ];then
    #env="development"
   #fi

   cross-env NODE_ENV=production webpack --progress --hide-modules --config ./build/webpack.dll.js
}

dll $1