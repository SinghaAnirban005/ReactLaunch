FROM node:20.17.0-alpine

WORKDIR /app

RUN apk add --no-cache git openssl openssl-dev libc6-compat python3 make g++

COPY package*.json ./
RUN npm install

COPY ./lib ./lib
COPY ./prisma ./prisma

RUN npx prisma generate

COPY ./tsconfig.builder.json ./tsconfig.json

RUN npm install -D ts-node typescript
CMD ["node", "--max-old-space-size=2096", "node_modules/.bin/ts-node", "lib/builder.ts"]
