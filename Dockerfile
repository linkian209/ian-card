FROM node:12.21.0-alpine3.12 AS client-builder
WORKDIR /app
COPY ./client .
RUN npm install --only-production && npm run build

FROM node:12.21.0-alpine3.12 AS swagger-builder
WORKDIR /app
COPY ./package.json ./
COPY ./cli ./cli
COPY ./server ./server
RUN npm run build-swagger

FROM node:12.21.0-alpine3.12
WORKDIR /app
EXPOSE 3001
COPY ./package.json ./
COPY ./server ./server
COPY ./.env ./
COPY --from=client-builder /app/build ./client/build
COPY --from=swagger-builder /app/swagger.json ./
RUN npm install
CMD ["npm", "start"]