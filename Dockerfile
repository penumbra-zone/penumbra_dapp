FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm config set @buf:registry https://buf.build/gen/npm/v1/
RUN npm install
COPY . .
RUN npm run build
EXPOSE 7073

CMD [ "npm", "start" ]