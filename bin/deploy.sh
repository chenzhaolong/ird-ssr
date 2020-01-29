#!/bin/sh

#当前环境是否存在node环境
existNode() {
  echo 'node'
}

#是否存在依赖包
existDependencies() {
  if [ ! \( -d ./node_modules \) -a ! \( -d ../node_modules \) ];then
     npm i --production
  fi
}

#获取应用名称
getName() {
 a=$(awk 'NR==8{print}' ./output/ecosystem.config.js)
 b=$(echo $a | awk '{print $2}')
 c=$(echo $b | awk -F"," '{print $1}')
 echo $c | sed $'s/\'//g'
}

#判断是否存在pm2
existPm2() {
  isExist=$(command -v pm2)
  if [ "$isExist" == "" ];then
    npm i pm2
    pm2 install pm2-intercom
  fi
}

run() {
  existPm2

  cmd="start"
  if [ "$1" != "" ];then
     cmd="$1"
  fi
  case $cmd in
    start)
        pm2 start ./output/ecosystem.config.js --env production;;
    restart)
        app=$(getName)
        pm2 restart $app;;
    reload)
        app=$(getName)
        pm2 reload $app;;
    stop)
        app=$(getName)
        pm2 stop $app;;
    delete)
        app=$(getName)
        pm2 delete $app;;
    *);;
   esac
}

run $1