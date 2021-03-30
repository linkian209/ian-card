FROM node:lts-alpine3.13 AS client-builder
WORKDIR /app
COPY ./client .
RUN npm install
RUN npm run build

FROM node:lts-alpine3.13 AS swagger-builder
WORKDIR /app
COPY ./package.json ./
COPY ./cli ./cli
COPY ./server ./server
RUN npm run build-swagger

FROM node:lts-alpine3.13
WORKDIR /app
EXPOSE 3001
COPY ./package.json ./
COPY ./server ./server
COPY ./.env ./
COPY --from=client-builder /app/client/build ./client/build
COPY --from=swagger-builder /app/swagger.json ./
RUN npm install
CMD ["npm", "start"]