FROM node:16

ENV PORT 9012

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm config set @buf:registry https://buf.build/gen/npm/v1/
RUN npm install

COPY . /usr/src/app
RUN npm run build
EXPOSE 9012

CMD [ "npm", "start" ]
