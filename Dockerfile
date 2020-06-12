FROM node:erbium-alpine3.11

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
  && apk update \
  && apk add --no-cache tzdata \
  && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

RUN mkdir -p /app

WORKDIR /app

ADD package.json .
ADD yarn.lock .
RUN yarn install --prod --registry=https://registry.npm.taobao.org \
  && yarn cache clean

ADD src ./src
RUN echo '{}' > ./jsdkd.json

ENV DEBUG jssdk:*
ENV NODE_ENV production
ENV APP_CONFIG /app/jsdkd.json
ENV SERVER_PORT 3030

EXPOSE 3030

ENTRYPOINT ["yarn"]

CMD ["start"]