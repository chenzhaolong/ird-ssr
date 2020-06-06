#基础镜像
FROM node:10.15.3

LABEL maintainer="dragonchen"

RUN mkdir work

WORKDIR work

COPY ./package.json ./

# 处理source指令
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# 设置淘宝镜像
RUN npm config set registry https://registry.npm.taobao.org

RUN npm install

# 安装node-sass
RUN npm install --unsafe-perm node-sass@4.13.1 --sass-binary-site=https://npm.taobao.org/mirrors/node-sass/

RUN npm install sass-loader@8.0.0 -d

COPY . .

RUN sh ./bin/publish.sh -oj yes

RUN rm -rf node_modules

RUN cd ./output && npm i --production

EXPOSE 8011

ENTRYPOINT cd ./output && sh ./deploy.sh