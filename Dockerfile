FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm config set @buf:registry https://buf.build/gen/npm/v1/
RUN npm install
COPY . .
RUN npm run build
EXPOSE 9012

CMD [ "npm", "start" ]