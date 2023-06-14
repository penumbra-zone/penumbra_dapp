FROM node:16 AS builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm config set @buf:registry https://buf.build/gen/npm/v1/
RUN npm install

COPY . /usr/src/app
RUN npm run build

EXPOSE 8080

# Not using a  custom "prod" script from package.json,
# due to routing problems.
# CMD [ "npm", "run", "start:prod" ]
CMD [ "npm", "start" ]
