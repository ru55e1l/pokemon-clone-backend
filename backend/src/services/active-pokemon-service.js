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
    async equipPokemon(activePokemonId) {
        try {
            const activePokemon = await this.getDocumentById(activePokemonId);
            const trainer = await trainerService.getDocumentById(activePokemon.trainer);

            if (!activePokemon || !trainer) {
                throw new Error('Active Pokemon or Trainer not found');
            }

            if (activePokemon.active) {
                throw new Error('The Pokemon is already equipped');
            }

            if (trainer.activePokemon.length >= 6) {
                throw new Error('The Trainer already has 6 active Pokemon');
            }

            activePokemon.active = true;
            await this.updateDocumentById(activePokemonId, activePokemon);
            trainer.activePokemon.push(activePokemonId);
            await trainerService.updateDocumentById(trainer._id, trainer);

        } catch (error) {
            throw error;
        }
    }
    async unequipPokemon(activePokemonId) {
        try {
            const activePokemon = await this.getDocumentById(activePokemonId);
            const trainer = await trainerService.getDocumentById(activePokemon.trainer);

            if (!activePokemon || !trainer) {
                throw new Error('Active Pokemon or Trainer not found');
            }

            if (!activePokemon.active) {
                throw new Error('The Pokemon is already unequipped');
            }

            activePokemon.active = false;
            await this.updateDocumentById(activePokemonId, activePokemon);

            const index = trainer.activePokemon.indexOf(activePokemonId);
            if (index > -1) {
                trainer.activePokemon.splice(index, 1);
            }

            await trainerService.updateDocumentById(trainer._id, trainer);

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

            const activePokemon = await this.getDocumentsByField({ trainer: trainer._id, active: true });
            return activePokemon;
        } catch (error) {
            throw error;
        }
    }



}

module.exports = new ActivePokemonService();