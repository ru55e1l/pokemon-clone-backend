const GenericService = require('../generic-service');
const ActiveBattle = require('../../models/activeBattle');

class ActiveBattleService extends GenericService {
    constructor() {
        super(ActiveBattle);
    }

    async startBattle() {

    }
}

module.exports = new ActiveBattleService();
