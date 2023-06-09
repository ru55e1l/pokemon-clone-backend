require('dotenv').config();
const express = require("express");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const swaggerOptions = require('./swaggeroptions');
const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// routes
const trainerRouter = require('./routes/trainer-router');
const pokemonRouter = require('./routes/pokemon-router');
const activePokemonRouter = require('./routes/active-pokemon-router');
const shopRouter = require('./routes/shop-router');
const battleRouter = require('./routes/battle-router');
const moveRouter = require('./routes/move-router');

const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };


const app = express();
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}))
app.use(cookieParser(process.env.SECRET))
app.use(express.json()); // for parsing application/json
const port = process.env.PORT || 1434;


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use trainerRouter middleware
app.use('/api/trainer', trainerRouter);
app.use('/api/pokemon', pokemonRouter);
app.use('/api/active-pokemon', activePokemonRouter);
app.use('/api/move', moveRouter);
app.use('/api/shop', shopRouter);
app.use('/api/battle', battleRouter);

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log(err));

const httpsServer = https.createServer(credentials, app);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});