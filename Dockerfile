FROM node:15.12.0-alpine3.13
WORKDIR /app
COPY ./client .
RUN npm update
RUN npm run build

FROM node:15.12.0-alpine3.13 AS swagger-builder
WORKDIR /app
COPY ./package.json ./
COPY ./cli ./cli
COPY ./server ./server
RUN npm run build-swagger

FROM node:15.12.0-alpine3.13
WORKDIR /app
EXPOSE 3001
COPY ./package.json ./
COPY ./server ./server
COPY ./.env ./
COPY --from=client-builder /app/build ./client/build
COPY --from=swagger-builder /app/swagger.json ./
RUN npm install
CMD ["npm", "start"]