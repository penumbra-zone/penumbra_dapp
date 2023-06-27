FROM node:16 AS builder

# Install python3 for simple static webserver
RUN apt-get update && apt-get install -y python3
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm config set @buf:registry https://buf.build/gen/npm/v1/
RUN npm install

COPY . /usr/src/app
RUN npm run build

EXPOSE 9012
CMD [ "python3", "-m", "http.server", "--directory", "/usr/src/app/docroot", "9012"]
