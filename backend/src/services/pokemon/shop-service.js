const pokemonService = require('./pokemon-service');
const trainerService = require('../trainer-service');
const activePokemonService = require('./active-pokemon-service');

class ShopService{
    constructor() {
    }

    async buyPokemon(trainerId, pokemonId){

        const trainer = await trainerService.getDocumentById(trainerId);
        const pokemon = await pokemonService.getDocumentById(pokemonId);

        if(!trainer) {
            throw new Error('Trainer not found')
        }

        if(!pokemon) {
            throw new Error('Pokemon not found');
        }

        if(trainer.coins < pokemon.cost) {
            throw new Error('Insufficient Credits');
        }
        const oldCoins = trainer.coins;
        try {
            trainer.coins = trainer.coins - pokemon.cost;
            await trainerService.updateDocumentById(trainerId, trainer);
            return await activePokemonService.createActivePokemon(trainerId, pokemonId);
        } catch(Error) {
            trainer.coins = oldCoins;
            await trainerService.updateDocumentById(trainerId, trainer);
            throw Error;
        }

    }
}

module.exports = new ShopService();