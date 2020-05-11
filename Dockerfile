FROM node:erbium-alpine3.11

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
  && apk update \
  && apk add --no-cache tzdata \
  && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

RUN mkdir -p /app

WORKDIR /app

ADD package.json /app/
ADD yarn.lock /app/
RUN yarn install --prod --registry=https://registry.npm.taobao.org

ADD src /app/src
ENV NODE_ENV production
ENV APP_CONFIG /app/config.json

EXPOSE 3030

ENTRYPOINT ["yarn"]

CMD ["start"]