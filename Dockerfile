FROM node:22.17.0-alpine

WORKDIR /app

RUN apk add --no-cache git openssl openssl-dev libc6-compat

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

RUN npm install -g vite

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
# Problem is that the migration tries to happen when postgress isn't initialized yet