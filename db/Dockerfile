FROM node:12.21.0-alpine3.12
WORKDIR /app
COPY ./package.json ./
RUN npm install --only-production
CMD ["npm", "run", "db-migrate", "--", "up"]