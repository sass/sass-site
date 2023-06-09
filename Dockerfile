FROM node:16

USER node
WORKDIR /app

COPY . /app
RUN yarn install

CMD yarn serve
