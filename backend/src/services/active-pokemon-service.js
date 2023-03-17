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
    async equipPokemon(activePokemonId){
        try{
            const activePokemon = await this.getDocumentById(activePokemonId);
            const trainer = await trainerService.getDocumentById(activePokemon.trainer);

            activePokemon.active = true;
            await this.updateDocumentById(activePokemonId, activePokemon);
            trainer.activePokemon.push(activePokemonId);
            await trainerService.updateDocumentById(trainer.id, trainer);

        } catch (error){
            throw error;
        }
    }
}

module.exports = new ActivePokemonService();