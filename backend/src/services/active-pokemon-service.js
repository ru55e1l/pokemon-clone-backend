const GenericService = require('../repository/generic-repository');
const activePokemon = require('../models/activePokemon');
const validTypes = require('../constants/pokemon-types');
const xpConstants = require('../constants/xpConstants');
const trainerService = require('./trainer-service');

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


}

module.exports = new ActivePokemonService();