FROM node:16

ENV PORT 9012

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install

# Copying source files
COPY . /usr/src/app

# Expose port
RUN  npm run build
EXPOSE 9012

# Running the app
CMD "npm" "run" "start"