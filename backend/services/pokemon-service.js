const GenericService = require('../services/generic-service');
const Pokemon = require('../models/pokemon');
const validTypes = require('../constants/pokemon-types');

class PokemonService extends GenericService {
    constructor() {
        super(Pokemon);
    }

    async getPokemonByName(name) {
        try {
            const pokemon = await this.getDocumentByField({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
            if (!pokemon) {
                throw new Error(`Pokemon with name ${name} not found`);
            }
            return pokemon;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deletePokemonByName(name) {
        try {
            const deletedPokemon = await this.deleteDocumentByField({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
            if (!deletedPokemon) {
                throw new Error(`Pokemon with name ${name} not found`);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updatePokemonByName(name, pokemonData) {
        try {
            if (pokemonData.type){
                // Check if all types are valid
                const invalidTypes = pokemonData.type.filter(type => !validTypes.includes(type));
                if (invalidTypes.length > 0) {
                    throw new Error(`Invalid Pokemon type(s): ${invalidTypes.join(', ')}`);
                }
            }
            const updatedPokemon = await this.updateDocumentByField({ name: { $regex: new RegExp(`^${name}$`, 'i') } }, pokemonData);
            return updatedPokemon;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createPokemon(pokemonData){
        try {
            const newPokemon = await this.createDocument(pokemonData);
            return newPokemon;
        } catch (error) {
            throw new Error(error.message);
        }
    };
}

module.exports = new PokemonService();
