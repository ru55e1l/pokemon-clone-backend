const GenericService = require('../generic-service');
const CompletedBattle = require('../../models/completedBattle');

class CompletedBattleService extends GenericService {
    constructor() {
        super(CompletedBattle);
    }

}

module.exports = new CompletedBattleService();
