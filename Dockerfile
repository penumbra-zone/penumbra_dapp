# # FROM node:16 AS builder

# # # Install python3 for simple static webserver
# # RUN apt-get update && apt-get install -y python3
# # RUN mkdir -p /usr/src/app
# # WORKDIR /usr/src/app
# # COPY package*.json /usr/src/app/
# # RUN npm config set @buf:registry https://buf.build/gen/npm/v1/
# # RUN npm install

# # COPY . /usr/src/app
# # RUN npm run build

# # EXPOSE 9012
# # CMD [ "python3", "-m", "http.server", "--directory", "/usr/src/app/docroot", "9012"]

# FROM node:16

# ENV PORT 9012

# # Create app directory
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# # Installing dependencies
# COPY package*.json /usr/src/app/
# RUN npm config set @buf:registry https://buf.build/gen/npm/v1/
# RUN npm install

# # Copying source files
# COPY . /usr/src/app

# # Building app
# RUN npm run build
# EXPOSE 9012

# # Running the app
# CMD "npm" "run" "start"

FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm config set @buf:registry https://buf.build/gen/npm/v1/
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .
COPY tailwind.config.js .
COPY postcss.config.js .

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
# ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

# Start Next.js in development mode based on the preferred package manager
CMD \
  if [ -f yarn.lock ]; then yarn dev; \
  elif [ -f package-lock.json ]; then npm run dev; \
  elif [ -f pnpm-lock.yaml ]; then pnpm dev; \
  else yarn dev; \
  fi