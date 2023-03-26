FROM node:16-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                             
COPY . .
ENV NODE_ENV=production                
RUN npm run build

FROM nginx:alpine                    
COPY --from=build /app/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf