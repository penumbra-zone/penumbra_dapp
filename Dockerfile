FROM node:alpine as build

ENV PORT 9012

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm i

# Copying source files
COPY . /usr/src/app

# Expose port
RUN  npm run build
EXPOSE 9012

FROM nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# # Running the app
# CMD ["npm", "start"]