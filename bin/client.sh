#!/bin/sh

clean() {
  cd ./output
  dir="static"
  if [ -e $dir ];then
    files=$(ls ./$dir)
    for f1 in $files
    do
      if [ $f1 != "dll" ];then
        rm -rf "./static/$f1"
      fi
    done
  fi
}

client() {
  clean
  cd ../
  if [ "$1" == "prod" ];then
    cross-env NODE_ENV=production webpack --progress --hide-modules --config ./build/webpack.client.prod.js
  else
    cross-env NODE_ENV=development webpack --progress --hide-modules --config ./build/webpack.client.dev.js
  fi
}

client $1
