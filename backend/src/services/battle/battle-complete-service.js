const GenericService = require('../generic-service');
const CompletedBattle = require('../../models/battleComplete');

class BattleCompleteService extends GenericService {
    constructor() {
        super(CompletedBattle);
    }

}

module.exports = new BattleCompleteService();
