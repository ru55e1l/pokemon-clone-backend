const GenericService = require('../generic-service');
const Pokemon = require('../../models/pokemon');
const validTypes = require('../../constants/validTypes');
const { getAsync, setAsync, client } = require('../../../redis');
class PokemonService extends GenericService {
    constructor() {
        super(Pokemon);
    }

    async getAllPokemon() {
        try {
            const cacheKey = 'all_pokemon';
            const cachedData = await getAsync(cacheKey);

            if (cachedData) {
                console.log('Returning cached data');
                return JSON.parse(cachedData);
            } else {
                console.log('Fetching data from database');
                const pokemonList = await this.getAllDocuments();
                await setAsync(cacheKey, JSON.stringify(pokemonList), 'EX', 60 * 60); // Cache for 1 hour
                return pokemonList;
            }
        } catch (error) {
            throw new Error(error.message);
        }
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
            // Try to get the Pokemon from the cache
            const cacheKey = 'all_pokemon';
            const cachedData = await getAsync(cacheKey);

            if (cachedData) {
                console.log('Using cached data');
                const pokemonList = JSON.parse(cachedData);
                const pokemon = pokemonList.find((p) => p.name.toLowerCase() === name.toLowerCase());

                if (pokemon) {
                    return pokemon;
                }
            }

            // If not found in cache, query the database
            console.log('Fetching Pokemon from database');
            const pokemon = await this.getDocumentByField({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

            if (!pokemon) {
                throw new Error(`Pokemon with name ${name} not found`);
            }

            // Update the cache with the new Pokemon
            if (cachedData) {
                const updatedPokemonList = [...JSON.parse(cachedData), pokemon];
                await setAsync(cacheKey, JSON.stringify(updatedPokemonList), 3600); // Cache for 1 hour
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
            else {
                const cacheKey = 'all_pokemon';
                await client.del(cacheKey);

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
            const cacheKey = 'all_pokemon';
            await client.del(cacheKey);
            return updatedPokemon;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createPokemon(pokemonData){
        try {
            const newPokemon = await this.createDocument(pokemonData);
            const cacheKey = 'all_pokemon';
            await client.del(cacheKey);
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
        const cacheKey = 'all_pokemon';
        await client.del(cacheKey);
        return { newPokemonList, errorMessages };
    }

}

module.exports = new PokemonService();
