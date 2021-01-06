FROM node:lts-alpine
WORKDIR /app/bot
RUN apk add --no-cache gcc musl-dev linux-headers git python make g++
COPY . .
RUN ["npm", "install"]
RUN ["npx", "tsc"]
RUN ["node", "dist/index.js"]