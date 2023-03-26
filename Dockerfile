FROM node:alpine AS build
WORKDIR /
COPY package.json .
RUN npm config set @buf:registry https://buf.build/gen/npm/v1/
RUN npm install
COPY . .
EXPOSE 9012
RUN npm run build

FROM nginx
COPY --from=build /build /usr/share/nginx/html