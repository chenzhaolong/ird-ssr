#!/bin/sh

clean() {
  cd ../output
  dir="static"
  if [ -e $dir ];then
    files=$(ls ./$dir)
    for f1 in $files
    do
      if [ $f1 != "dll" ];then
        rm -rf $f1
      fi
    done
  fi
}

clean