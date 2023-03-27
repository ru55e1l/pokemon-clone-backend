trainerService = require('../trainer-service');
const activeBattleService = require('./battle-active-service');
const completedBattleService = require('./battle-complete-service');

class BattleService  {

    async startBattle(trainer1Id, trainer2Id) {
        // Get trainers by their IDs
        const trainer1 = await trainerService.getDocumentById(trainer1Id);
        const trainer2 = await trainerService.getDocumentById(trainer2Id);

        if (!trainer1 || !trainer2) {
            throw new Error('One or both trainers not found');
        }

        // Check if trainers are already in an active battle
        const activeBattlesTrainer1 = await activeBattleService.getDocumentsByField({ $or: [{ trainer1: trainer1Id }, { trainer2: trainer1Id }] });
        const activeBattlesTrainer2 = await activeBattleService.getDocumentsByField({ $or: [{ trainer1: trainer2Id }, { trainer2: trainer2Id }] });

        if (activeBattlesTrainer1.length > 0 || activeBattlesTrainer2.length > 0) {
            throw new Error('One or both trainers are already in an active battle');
        }

        // Create a new active battle
        const activeBattleData = {
            trainer1: trainer1Id,
            trainer2: trainer2Id,
        };

        const newActiveBattle = await activeBattleService.createDocument(activeBattleData);

        return newActiveBattle;
    }

    async endBattle(activeBattleId, winningTrainerId) {
        try {
            const activeBattle = await activeBattleService.getDocumentById(activeBattleId);
            if (!activeBattle) {
                throw new Error('Active battle not found');
            }
            if (winningTrainerId != activeBattle.trainer1 && winningTrainerId != activeBattle.trainer2) {
                throw new Error('Invalid winning trainer ID');
            }

            const completedBattle = {
                trainer1: activeBattle.trainer1,
                trainer2: activeBattle.trainer2,
                winner: winningTrainerId,
                endDate: new Date(),
            };

            await completedBattleService.createDocument(completedBattle);
            await activeBattleService.deleteDocumentById(activeBattleId);

            return completedBattle;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new BattleService();
