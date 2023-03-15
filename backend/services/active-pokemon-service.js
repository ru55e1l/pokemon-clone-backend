const GenericService = require('../services/generic-service');
const activePokemon = require('../models/activePokemon');
const validTypes = require('../constants/pokemon-types');
const xpConstants = require('../constants/xpConstants');

class ActivePokemonService extends GenericService {
    constructor() {
        super(activePokemon);
    }
    async awardExp(activePokemonId, xpPoints){
        try{
            const activePokemon = this.getDocumentById(activePokemonId);
            activePokemon.exp += xpPoints;
            this.updateDocumentById(activePokemonId, activePokemon);
        } catch (error){

        }
    }
}

module.exports = new ActivePokemonService();