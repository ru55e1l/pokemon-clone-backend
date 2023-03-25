trainerService = require('../../services/trainer-service');


class BattleService  {

    async startBattle(trainer1id, trainer2id) {
        const trainer1 = await trainerService.getDocumentById(trainer1id);
        const trainer2 = await trainerService.getDocumentById(trainer2id);
    }
}

module.exports = new BattleService();
