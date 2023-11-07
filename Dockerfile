# FROM node:lts-alpine
# ENV NODE_ENV=production
# WORKDIR /usr/src/app
# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production --silent && mv node_modules ../
# COPY . .
# EXPOSE 5000
# RUN chown -R node /usr/src/app
# USER node
# CMD ["npm", "start"]
FROM bitnami/node:latest as builder
ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .
# RUN apk add python3 make gcc g++
RUN npm ci --omit-dev