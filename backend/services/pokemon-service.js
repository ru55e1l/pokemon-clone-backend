const Pokemon = require('../models/pokemon');
const validTypes = require('../constants/pokemon-types');

async function getAllPokemon() {
    try {
        const allPokemon = await Pokemon.find();
        return allPokemon;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getPokemonByName(name) {
    try {
        const pokemon = await Pokemon.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (!pokemon) {
            throw new Error(`Pokemon with name ${name} not found`);
        }
        return pokemon;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function deletePokemonByName(name) {
    try {
        const deletedPokemon = await Pokemon.findOneAndDelete({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (!deletedPokemon) {
            throw new Error(`Pokemon with name ${name} not found`);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

async function updatePokemonByName(name, pokemonData) {
    try {
        // Check if all types are valid
        const invalidTypes = pokemonData.type.filter(type => !validTypes.includes(type));
        if (invalidTypes.length > 0) {
            throw new Error(`Invalid Pokemon type(s): ${invalidTypes.join(', ')}`);
        }

        const existingPokemon = await Pokemon.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (!existingPokemon) {
            throw new Error(`Pokemon with name ${name} not found`);
        }

        const updatedPokemonData = Object.assign({}, existingPokemon.toObject(), pokemonData);
        const updatedPokemon = await Pokemon.findOneAndUpdate({ name: { $regex: new RegExp(`^${name}$`, 'i') } }, { $set: updatedPokemonData }, { new: true });
        return updatedPokemon;
    } catch (error) {
        throw new Error(error.message);
    }
}


async function createPokemon(pokemonData){
    try {
        // Check if all types are valid
        const invalidTypes = pokemonData.type.filter(type => !validTypes.includes(type));
        if (invalidTypes.length > 0) {
            throw new Error(`Invalid Pokemon type(s): ${invalidTypes.join(', ')}`);
        }

        const newPokemon = new Pokemon(pokemonData);
        const savedPokemon = await newPokemon.save();
        return savedPokemon;
    } catch (error) {
        throw new Error(error.message);
    }
};
module.exports = {
    getAllPokemon,
    getPokemonByName,
    deletePokemonByName,
    updatePokemonByName,
    createPokemon,
};