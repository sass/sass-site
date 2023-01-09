FROM node:16

WORKDIR /app

COPY . /app
RUN yarn install
