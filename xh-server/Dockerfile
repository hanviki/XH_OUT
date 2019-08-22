FROM gzhcfed/node-runtime-alpine:latest

RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      chromium@edge \
      nss@edge

# 准备代码
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY ./app/resources/fonts/* /usr/share/fonts/

COPY ./package.json /usr/src/app/

# RUN npm i --production --registry=https://registry.npm.taobao.org
RUN npm i --production

COPY . /usr/src/app

# 数据库迁移
COPY ./migrations/*.sql /flyway/sql/

# RUN flyway -url=jdbc:mysql://db -schemas=share -user=root -password=bkQ72RII0IlZLcPk migrate

# 覆盖 jar 文件，解决依赖问题
COPY ./app/resources/jars/pdfmerger.jar /usr/src/app/node_modules/pdfmerger/jar/pdfmerger.jar

EXPOSE 6605

# CMD npm run docker
