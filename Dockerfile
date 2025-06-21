FROM node:22.9.0-alpine3.19

WORKDIR /app

RUN apk add --update --no-cache \
    bash

RUN npm install -g firebase-tools