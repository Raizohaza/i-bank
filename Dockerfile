FROM bitnami/node:latest as builder
ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app
COPY . .
# RUN apk add python3 make gcc g++
RUN npm ci --omit-dev