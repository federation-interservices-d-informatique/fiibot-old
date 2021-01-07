FROM keymetrics/pm2:latest-alpine
WORKDIR /app/bot
RUN apk add --no-cache gcc musl-dev linux-headers git python make g++
EXPOSE 3000
COPY . .
RUN ["npm", "install"]
RUN ["npx", "tsc"]
RUN ["chmod", "+x", "./docker-run.sh"]
CMD ["./docker-run.sh"]
