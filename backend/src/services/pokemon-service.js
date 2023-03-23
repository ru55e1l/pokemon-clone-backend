const GenericService = require('./generic-service');
const Pokemon = require('../models/pokemon');
const validTypes = require('../constants/validTypes');

class PokemonService extends GenericService {
    constructor() {
        super(Pokemon);
    }

    validatePokemonData(pokemonData) {
        const { type } = pokemonData;

        // Validate each type in the array
        for (const t of type) {
            if (!validTypes.includes(t)) {
                throw new Error(`Invalid type: ${t}`);
            }
        }
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
    async bulkCreatePokemon(pokemonList) {
        const newPokemonList = [];
        const errorMessages = [];

        for (const pokemonData of pokemonList) {
            try {
                // Validate each Pokemon in the list
                this.validatePokemonData(pokemonData);

                // Create and save each Pokemon
                const newPokemon = new Pokemon(pokemonData);
                await this.createDocument(newPokemon);
                newPokemonList.push(newPokemon);
            } catch (error) {
                // Store the error message for the failed Pokemon creation
                errorMessages.push({
                    name: pokemonData.name,
                    message: error.message,
                });
            }
        }

        return { newPokemonList, errorMessages };
    }


}

module.exports = new PokemonService();
