# Pokemon Battle API

This is a RESTful API for a Pokemon battle application, built using Node.js, Express.js, and MongoDB. It provides endpoints for creating and managing trainers, Pokemon, moves, and battles.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository: `git clone https://github.com/ru55e1l/Pokemon-Battle-Clone.git`
2. Install the dependencies: `npm install`
3. Set up the environment variables by creating a `.env` file in the root directory and adding the following:

DB_CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
PORT=<port>

markdown
Copy code

4. Run the server: `npm start`

## Endpoints

This API provides the following endpoints:

### Trainers

- `GET /api/trainers`: Gets a list of all trainers.
- `GET /api/trainers/:id`: Gets a specific trainer by ID.
- `POST /api/trainers`: Creates a new trainer.
- `PUT /api/trainers/:id`: Updates an existing trainer by ID.
- `DELETE /api/trainers/:id`: Deletes an existing trainer by ID.

### Pokemon

- `GET /api/pokemon`: Gets a list of all Pokemon.
- `GET /api/pokemon/:id`: Gets a specific Pokemon by ID.
- `POST /api/pokemon`: Creates a new Pokemon.
- `PUT /api/pokemon/:id`: Updates an existing Pokemon by ID.
- `DELETE /api/pokemon/:id`: Deletes an existing Pokemon by ID.

### Moves

- `GET /api/moves`: Gets a list of all moves.
- `GET /api/moves/:id`: Gets a specific move by ID.
- `POST /api/moves`: Creates a new move.
- `PUT /api/moves/:id`: Updates an existing move by ID.
- `DELETE /api/moves/:id`: Deletes an existing move by ID.

### Battles

- `GET /api/battles`: Gets a list of all battles.
- `GET /api/battles/:id`: Gets a specific battle by ID.
- `POST /api/battles`: Creates a new battle.
- `PUT /api/battles/:id`: Updates an existing battle by ID.
- `DELETE /api/battles/:id`: Deletes an existing battle by ID.
