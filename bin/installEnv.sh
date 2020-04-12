#!/bin/sh

# 下载依赖
installNpm() {
  if [ ! \( -d ./node_modules \) ];then
    npm i
  fi
}

# 判断jq是否存在
isExist() {
    isExist=""
    if [ "$1" == "jq" ];then
       isExist=$(command -v jq)
    fi
    if [ "$1" == "brew" ];then
        isExist=$(command -v brew)
    fi
    if [ "$1" == "apt" ];then
        isExist=$(command -v apt-get)
    fi
    echo $isExist
}

# 安装jq指令
installJq() {
  result=$(isExist jq)
  if [ "$result" == "" ];then
     existBrew=$(isExist brew)
     existApt=$(isExist apt)

     if [ "$existApt" != "" ];then
       apt-get install jq
     else
       if ["existBrew" != ""];then
         brew install jq
       fi
     fi
  fi
}

