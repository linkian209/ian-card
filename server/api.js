var express = require("express");
var db = require("./db");

var api_router = express.Router();

function noRoute(req, res) {
    res.status(404);
}

/**
 * @swagger
 * /:
 *  get:
 *      description: Returns Hello World
 *      responses:
 *          200:
 *              description: Hello World   
 */
api_router.get("/", (req, res) => {
    res.json({message: "Hello World!"});
});

/* User Routes */
/**
 * @swagger
 * tags:
 *  name: User
 *  description: User management
 */
/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *              type: string
 *              description: Uniquely created ID
 *          username:
 *              type: string
 *              description: Username
 *          last_seen_ts:
 *              type: string
 *              description: Timestamp of last update
 */
/**
 * @swagger
 * /user/{id}:
 *  get:
 *      tags: [User]
 *      description: Get user info by id
 *      operationId: getUserById
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: The User information
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/User"
 */
/**
 * @swagger
 * /user/name/{username}:
 *  get:
 *      tags: [User]
 *      description: Get user info by username
 *      operationId: getUserByName
 *      parameters:
 *          - name: username
 *            in: path
 *            description: Username
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/User"
 */
/**
 * @swagger
 * /user/{id}:
 *  put:
 *      tags: [User]
 *      description: Update User info
 *      operationId: updateUser
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *      requestBody:
 *          description: Updated user object
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/User"
 *      responses:
 *          201:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: string
 *                                  description: User ID
 *                              username:
 *                                  type: string
 *                                  description: Username
 */
/**
 * @swagger
 * /user/new:
 *  post:
 *      tags: [User]
 *      description: Add new user
 *      operationId: addUser
 *      requestBody:
 *          description: The user's id and optionally name
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          id:
 *                              type: string
 *                              description: User ID
 *                          username:
 *                              type: string
 *                              description: Username
 *      responses:
 *          201:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: string
 *                                  description: User ID
 *                              username:
 *                                  type: string
 *                                  description: Username
 */
/**
 * @swagger
 * /user/{id}:
 *  delete:
 *      tags: [User]
 *      description: Delete User
 *      operationId: deleteUser
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *      responses:
 *          201:
 *              description: Success
 *              content: {}
 */
api_router.get('/user/:id', db.getUserById);
api_router.get('/user/name/:username', db.getUserByName);
api_router.post('/user/new', db.newUser);
api_router.put('/user/:id', db.updateUser);
api_router.delete('/user/:id', db.deleteUser);

/* Collection Routes */
/**
 * @swagger
 * tags:
 *  name: Collection
 *  description: User's Card Collections
 */
/**
 * @swagger
 * components:
 *  schemas:
 *      Collection:
 *          type: object
 *          properties:
 *              user_id:
 *                  type: string
 *                  description: User's ID
 *              card_id:
 *                  type: string
 *                  description: UUID of the card
 *              quantity:
 *                  type: integer
 *                  format: int64
 *                  description: Number of copies of this card owned
 *              acquire_ts:
 *                  type: string
 *                  description: Timestamp of when the user acquired the card
 */
/**
 * @swagger
 * /collection/{id}:
 *  get:
 *      tags: [Collection]
 *      description: Get Collection By User
 *      operationId: getCollectionByUser
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: The User information
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Collection"
 */
/**
 * @swagger
 * /collection/{id}/{card}:
 *  get:
 *      tags: [Collection]
 *      description: Get collection info for card in 
 *      operationId: getCollectionByUserCard
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *          - name: card
 *            in: path
 *            description: Card ID
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: The Collection
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Collection"
 */
/**
 * @swagger
 * /collection/{id}/update:
 *  post:
 *      tags: [Collection]
 *      description: Add or update card in collection
 *      operationId: addOrUpdateCardInCollection
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *      requestBody:
 *          description: Card UUID and quantity to add
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          card_id:
 *                              type: string
 *                              description: Card UUID
 *                          quantity:
 *                              type: integer
 *                              format: int64
 *                              description: Quantity owned
 *      responses:
 *          201:
 *              description: Sucess
 *              content: {}
 */
/**
 * @swagger
 * /collection/{id}:
 *  post:
 *      tags: [Collection]
 *      description: Add card to collection
 *      operationId: addToCollection
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *      requestBody:
 *          description: Card UUID and quantity to add
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          card_id:
 *                              type: string
 *                              description: Card UUID
 *                          quantity:
 *                              type: integer
 *                              format: int64
 *                              description: Quantity owned
 *      responses:
 *          201:
 *              description: Sucess
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Collection"
 */
/**
 * @swagger
 * /collection/{id}/{card}:
 *  put:
 *      tags: [Collection]
 *      description: Update owned quantity of a card
 *      operationId: updateCollection
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *          - name: card
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *      requestBody:
 *          description: New Quantity Owned
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          quantity:
 *                              type: integer
 *                              format: int64
 *                              description: Quantity owned
 *      responses:
 *          201:
 *              description: Sucess
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Collection"
 */
/**
 * @swagger
 * /collection/{id}/{card}:
 *  delete:
 *      tags: [Collection]
 *      description: Remove card from collection
 *      operationId: removeCardFromCollection
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *          - name: card
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *      responses:
 *          201:
 *              description: Sucess
 *              content: {}
 */
/**
 * @swagger
 * /collection/{id}:
 *  delete:
 *      tags: [Collection]
 *      description: Delete user's collection
 *      operationId: deleteCollection
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *      responses:
 *          201:
 *              description: Sucess
 *              content: {}
 */
/**
 * @swagger
 * /collection/{id}/cards:
 *  get:
 *      tags: [Collection]
 *      description: Get Cards and quantities owned by user
 *      operationId: getAllCardsByUser
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User ID
 *            required: true
 *            type: string
 *      responses:
 *          201:
 *              description: Sucess
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              properties:
 *                                  card:
 *                                      $ref: "#/components/schemas/Card"
 *                                      description: The card
 *                                  quantity:
 *                                      type: integer
 *                                      format: int64
 *                                      description: Quantity owned
 *                                  acquire_ts:
 *                                      type: string
 *                                      description: Timestamp of when the user acquired the card
 */
api_router.get('/collection/:id', db.getCollectionByUser);
api_router.post('/collection/:id', db.addToCollection);
api_router.delete('/collection/:id', db.deleteCollection);
api_router.post('/collection/:id/update', db.addOrUpdateCardInCollection);
api_router.get('/collection/:id/cards', db.getAllCardsByUser);
api_router.get('/collection/:id/:card', db.getCollectionByUserCard);
api_router.put('/collection/:id/:card', db.updateCollection);
api_router.delete('/collection/:id/:card', db.removeCardFromCollection);

/* Card Routes */
/**
 * @swagger
 * tags:
 *  name: Card
 *  description: Card Management
 */
/**
 * @swagger
 * components:
 *  schemas:
 *      Card:
 *        type: object
 *        properties:
 *          id:
 *              type: string
 *              description: Uniquely created ID
 *          name:
 *              type: string
 *              description: Card Name
 *          description:
 *              type: string
 *              description: Text that appears on card
 *          img:
 *              type: string
 *              description: Path of card image
 *          rarity:
 *              type: integer
 *              format: int64
 *              description: Rarity of the card
 *          artist:
 *              type: string
 *              description: Artist of card image
 *          shiny:
 *              type: boolean
 *              description: Is the card shiny or not
 *          series:
 *              type: integer
 *              format: int64
 *              description: Series the card is a part of
 */
/**
 * @swagger
 * /card:
 *  get:
 *      tags: [Card]
 *      description: Gets all cards
 *      operationId: getAllCards
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Card"
 */
/**
 * @swagger
 * /card/random:
 *  get:
 *      tags: [Card]
 *      description: Gets a random card
 *      operationId: getRandomCard
 *      responses:
 *          200:
 *              description: Sucess
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Card"
 */
/**
 * @swagger
 * /card/{id}:
 *  get:
 *      tags: [Card]
 *      description: Gets card by id
 *      operationId: getCard
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Card ID
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: Sucess
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Card"
 */
/**
 * @swagger
 * /card/new:
 *  post:
 *      tags: [Card]
 *      description: Creates new card
 *      operationId: newCard
 *      requestBody:
 *          description: New user card
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Card"
 *      responses:
 *          201:
 *              description: Sucess
 *              content: {}
 */
api_router.get('/card', db.getAllCards);
api_router.get('/card/random', db.getRandomCard);
api_router.get('/card/:id', db.getCard);
api_router.post('/card/new', db.newCard);
//api_router.put('/card/:id', db.updateCard);
//api_router.delete('/card/:id', db.deleteCard);

/* Series Routes */
/**
 * @swagger
 * tags:
 *  name: Series
 *  description: Series Management
 */
/**
 * @swagger
 * components:
 *  schemas:
 *      Series:
 *        type: object
 *        properties:
 *          id:
 *              type: integer
 *              format: int64
 *              description: Uniquely created ID
 *          name:
 *              type: string
 *              description: Series Name
 *          create_ts:
 *              type: string
 *              description: Series creation timestamp
 */
/**
 * @swagger
 * /series:
 *  get:
 *      tags: [Series]
 *      description: Gets all series
 *      operationId: getAllSeries
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Series"
 */
/**
 * @swagger
 * /series/new:
 *  post:
 *      tags: [Series]
 *      description: Create New Series
 *      operationId: newSeries
 *      requestBody:
 *          description: New Series
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: New Series
 *      responses:
 *          201:
 *              description: Success
 *              content: {}
 */
/**
 * @swagger
 * /series/{id}:
 *  get:
 *      tags: [Series]
 *      description: Gets series by id
 *      operationId: getSeriesById
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Series ID
 *            required: true
 *            type: integer
 *            format: int64
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Series"
 */
api_router.get('/series', db.getAllSeries);
api_router.post('/series/new', db.newSeries);
api_router.get('/series/:id', db.getSeriesById);


/* 404 */
api_router.get('*', noRoute);
api_router.post('*', noRoute);
api_router.delete('*', noRoute);
api_router.put('*', noRoute);

module.exports = api_router;