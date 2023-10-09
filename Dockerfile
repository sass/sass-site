FROM node:20

WORKDIR /app

COPY . /app
RUN npm install

CMD npm run serve
