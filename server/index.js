const session = require("express-session");
const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const api_router = require("./api");
const swaggerDef = require('../swagger.json');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

var app = express();

app.use(session({
  cookie: {
    maxAge: 100000000000,
    httpOnly: false
  },
  secret: process.env.SESSION_SECRET,
  rolling: true,
  saveUninitialized: false,
  resave: true
}));

app.use(express.json());

/* Swagger Setup */
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDef));

app.use('/api', api_router);

// All other GET requests not handled before will return our React app
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build','index.html'));
});
app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});