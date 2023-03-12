require('dotenv').config();
const express = require("express");

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const trainerRouter = require('./routes/trainer');
const pokemonRouter = require('./routes/pokemon');
const mongoose = require('mongoose');


const app = express();
app.use(express.json()); // for parsing application/json
const port = process.env.PORT || 1434;
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Pokemon Battle API',
            description: 'Pokemon battle information',
            version: '1.0.0',
            servers: ["http://localhost:1434"],
        },
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use trainerRouter middleware
app.use('/api/trainer', trainerRouter);
app.use('/api/pokemon', pokemonRouter);

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log(err));
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


