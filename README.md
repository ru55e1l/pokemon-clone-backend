# Pokemon Battles Game Clone

This is a clone of the popular Pokemon battles game, currently in production. The game has a REST API for CRUD calls and WebSocket for the actual battling section. The frontend of the game will be a website using React or other JS frontend frameworks.

## Getting Started

To start the game, use the following command: 

npm run dev

javascript
Copy code

Please note that you need to create a `.ENV` file with the following environment variables: 

DB_CONNECTION_STRING=yourconnectionstring
SECRET=yoursecret

markdown
Copy code

## Documentation

We have Swagger documentation for all endpoints. You can access it via the `/api-docs` route.

## Contributing

If you want to contribute or work on the project, please contact me at toneyrl@mail.uc.edu. 

## Deployment

Eventually, the game will be deployed, and a small deployment will be available for free.

## Code Structure

The main file of the application is `app.js`, which sets up the server, the routes, and connects to the database. The routes are divided into three files: `trainer.js`, `pokemon.js`, and `active-pokemon.js`. 

## Technologies

- Node.js
- Express.js
- Mongoose (MongoDB)
- Swagger

## License

This project is licensed under the MIT License - see the LICENSE file for details.
