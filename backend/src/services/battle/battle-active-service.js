const GenericService = require('../generic-service');
const ActiveBattle = require('../../models/battleActive');

class BattleActiveService extends GenericService {
    constructor() {
        super(ActiveBattle);
    }

    async startBattle() {

    }
}

module.exports = new BattleActiveService();
