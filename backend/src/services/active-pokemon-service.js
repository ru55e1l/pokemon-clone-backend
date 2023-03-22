const GenericService = require('../repository/generic-repository');
const activePokemon = require('../models/activePokemon');
const validTypes = require('../constants/validTypes');
const xpConstants = require('../constants/xpConstants');
const trainerService = require('./trainer-service');
const moveService = require('./move-service');
const pokemonService = require('./pokemon-service');

class ActivePokemonService extends GenericService {
    constructor() {
        super(activePokemon);
    }
    async awardExp(activePokemonId, xpPoints){
        try{
            const activePokemon = await this.getDocumentById(activePokemonId);
            activePokemon.exp += xpPoints;
            await this.updateDocumentById(activePokemonId, activePokemon);
        } catch (error){

        }
    }
    async countEquippedPokemonByTrainer(trainerId) {
        try {
            const equippedPokemonCount = await this.countDocuments({ trainer: trainerId, equipped: true });
            return equippedPokemonCount;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async equipPokemon(activePokemonId) {
        try {
            const activePokemon = await this.getDocumentById(activePokemonId);
            const trainer = await trainerService.getDocumentById(activePokemon.trainer);

            if (!activePokemon || !trainer) {
                throw new Error('Active Pokemon or Trainer not found');
            }

            if (activePokemon.equipped) {
                throw new Error('The Pokemon is already equipped');
            }

            // Get the number of equipped Pokemon for the trainer
            const equippedPokemonCount = await this.countEquippedPokemonByTrainer(trainer._id);

            if (equippedPokemonCount >= 6) {
                throw new Error('The Trainer already has 6 active Pokemon');
            }

            activePokemon.equipped = true;
            await this.updateDocumentById(activePokemonId, activePokemon);

        } catch (error) {
            throw error;
        }
    }
    async unequipPokemon(activePokemonId) {
        try {
            const activePokemon = await this.getDocumentById(activePokemonId);

            if (!activePokemon) {
                throw new Error('Active Pokemon not found');
            }

            if (!activePokemon.equipped) {
                throw new Error('The Pokemon is already unequipped');
            }

            activePokemon.equipped = false;
            await this.updateDocumentById(activePokemonId, activePokemon);


        } catch (error) {
            throw error;
        }
    }
    async getActivePokemonByTrainerName(trainerName) {
        try {
            const trainer = await trainerService.getDocumentByField({ username: trainerName });
            if (!trainer) {
                throw new Error('Trainer not found');
            }

            const activePokemon = await this.getDocumentsByField({ trainer: trainer._id, equipped: true });
            return activePokemon;
        } catch (error) {
            throw error;
        }
    }

    // activePokemonService.js
    async isPokemonEquipped(id) {
        try {
            const activePokemon = await this.getDocumentById(id);

            if (!activePokemon) {
                return { error: 'not_found', message: `active-pokemon ${id} not found` };
            }

            if (activePokemon.equipped) {
                return { error: 'equipped', message: `active-pokemon ${id} is equipped and cannot be deleted` };
            }

            return { error: null, message: '' };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateNickname(id, newNickname){
        try {
            const activePokemon = await this.getDocumentById(id);
            if (!activePokemon) {
                throw new Error('Active Pokemon not found');
            }

            activePokemon.nickname = newNickname;
            await this.updateDocumentById(id, activePokemon);
            return activePokemon;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addMoveToActivePokemon(activePokemonId, moveId) {
        // Fetch ActivePokemon, Pokemon, and Move
        const activePokemon = await this.getDocumentById(activePokemonId);
        const pokemon = await pokemonService.getDocumentById(activePokemon.pokemon);
        const move = await moveService.getDocumentById(moveId);

        if(!move) {
            throw new Error(`Move ${moveId} does not exist`)
        }

        if(!activePokemon) {
            throw new Error(`ActivePokemon ${activePokemonId} does not exist`)
        }

        // Check if the move type is one of the Pokemon types
        if (!pokemon.type.includes(move.type)) {
            throw new Error('Move type does not match Pokemon type');
        }

        // Check if the move is already known by the ActivePokemon
        if (activePokemon.moves.some(move => move._id.toString() === moveId)) {
            throw new Error('ActivePokemon already knows this move');
        }

        // Add the move to the ActivePokemon
        activePokemon.moves.push(moveId);
        await activePokemon.save();

        return activePokemon;
    }

    async removeMoveFromActivePokemon(activePokemonId, moveId) {
        const activePokemon = await this.getDocumentById(activePokemonId);

        // Check if the move is known by the ActivePokemon
        const moveIndex = activePokemon.moves.findIndex(move => move._id.toString() === moveId);
        if (moveIndex === -1) {
            throw new Error('ActivePokemon does not know this move');
        }

        // Remove the move from the ActivePokemon
        activePokemon.moves.splice(moveIndex, 1);
        await activePokemon.save();

        return activePokemon;
    }

    async createActivePokemon(trainerId, pokemonId) {
        try {
            const pokemon = pokemonService.getDocumentById(pokemonId);
            const trainer = pokemonService.getDocumentById(trainerId);

            if (!pokemon) {
                throw new Error('Pokemon not found');
            }

            if (!trainer) {
                throw new Error('Trainer not found');
            }

            const activePokemonData = {
                trainer: trainerId,
                pokemon: pokemonId,
            };

            return await this.createDocument(activePokemonData);
        } catch(Error) {
            throw Error;
        }
    }

}

module.exports = new ActivePokemonService();