FROM node:lts-alpine
WORKDIR /app/bot
RUN apk add --no-cache gcc musl-dev linux-headers git python make g++
COPY . .
RUN ["npm", "install"]
RUN ["npx", "tsc"]
CMD ["node","dist/index.js"]