require('dotenv').config();
const express = require("express");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const swaggerOptions = require('./swaggeroptions');

// routes
const trainerRouter = require('./routes/trainer-router');
const pokemonRouter = require('./routes/pokemon-router');
const activePokemonRouter = require('./routes/active-pokemon-router');

const moveRouter = require('./routes/move-router');

const app = express();
app.use(express.json()); // for parsing application/json
const port = process.env.PORT || 1434;


    const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use trainerRouter middleware
app.use('/api/trainer', trainerRouter);
app.use('/api/pokemon', pokemonRouter);
app.use('/api/active-pokemon', activePokemonRouter);
app.use('/api/move', moveRouter);

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log(err));
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


