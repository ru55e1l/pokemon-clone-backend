const trainerService = require('../trainer-service');
const battleActiveService = require('./battle-active-service');
const completedBattleService = require('./battle-complete-service');
const activePokemonService = require('../pokemon/active-pokemon-service');
const moveService = require('../move-service');
const typeEffectiveness = require('../../constants/Move/typeEffectiveness');

class BattleService  {

    async startBattle(trainer1Id, trainer2Id) {
        // Get trainers by their IDs
        const trainer1 = await trainerService.getDocumentById(trainer1Id);
        const trainer2 = await trainerService.getDocumentById(trainer2Id);

        if (!trainer1 || !trainer2) {
            throw new Error('One or both trainers not found');
        }

        // Check if trainers are already in an active battle
        const activeBattlesTrainer1 = await battleActiveService.getDocumentsByField({ $or: [{ trainer1: trainer1Id }, { trainer2: trainer1Id }] });
        const activeBattlesTrainer2 = await battleActiveService.getDocumentsByField({ $or: [{ trainer1: trainer2Id }, { trainer2: trainer2Id }] });

        if (activeBattlesTrainer1.length > 0 || activeBattlesTrainer2.length > 0) {
            throw new Error('One or both trainers are already in an active battle');
        }

        // Create a new active battle
        const activeBattleData = {
            trainer1: trainer1Id,
            trainer2: trainer2Id,
        };

        const newActiveBattle = await battleActiveService.createDocument(activeBattleData);

        return newActiveBattle;
    }

    async endBattle(activeBattleId, winningTrainerId) {
        try {
            const activeBattle = await battleActiveService.getDocumentById(activeBattleId);
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
            await battleActiveService.deleteDocumentById(activeBattleId);

            return completedBattle;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async makeMove(battleId, trainerId, activePokemonId, moveId, targetId) {
        const activeBattle = await battleActiveService.getDocumentById(battleId);
        const activePokemon = await activePokemonService.getDocumentById(activePokemonId);
        const move = await moveService.getDocumentById(moveId);
        const target = await activePokemonService.getDocumentById(targetId);
        const typeEffectiveness = this.calculateTypeEffectiveness(move.type, target.types);

        // Validate if activePokemon is in the battle
        const activePokemonInBattle = activeBattle.activePokemon1.some(pokemon => pokemon.activePokemonId.equals(activePokemonId)) ||
            activeBattle.activePokemon2.some(pokemon => pokemon.activePokemonId.equals(activePokemonId));
        if (!activePokemonInBattle) {
            throw new Error("The active Pokemon is not participating in the battle.");
        }

        // Check if activePokemon has health
        if (activePokemon.currentHealth <= 0) {
            throw new Error("The active Pokemon has fainted and cannot make a move.");
        }

        // Validate the correct trainer's turn
        const isTrainer1 = activeBattle.trainer1.equals(trainerId);
        const isTrainer2 = activeBattle.trainer2.equals(trainerId);
        if ((activeBattle.trainer1Turn && !isTrainer1) || (!activeBattle.trainer1Turn && !isTrainer2)) {
            throw new Error("It is not this trainer's turn.");
        }

        // Validate the target enemy
        const targetInBattle = activeBattle.activePokemon1.some(pokemon => pokemon.activePokemonId.equals(targetId)) ||
            activeBattle.activePokemon2.some(pokemon => pokemon.activePokemonId.equals(targetId));
        if (!targetInBattle) {
            throw new Error("The target enemy is not participating in the battle.");
        }

        if (isTrainer1 && activeBattle.activePokemon1.some(pokemon => pokemon.activePokemonId.equals(targetId))) {
            throw new Error("Cannot target your own Pokemon.");
        }

        if (isTrainer2 && activeBattle.activePokemon2.some(pokemon => pokemon.activePokemonId.equals(targetId))) {
            throw new Error("Cannot target your own Pokemon.");
        }

        // Check if the move hits based on accuracy
        const moveHits = Math.random() * 100 < move.accuracy;
        if (!moveHits) {
            // The move missed, update the turn and return the updated activeBattle
            activeBattle.trainer1Turn = !activeBattle.trainer1Turn;
            await activeBattle.save();
            return activeBattle;
        }

        // Calculate damage
        const damage = this.calculateDamage(activePokemon.stats, move, target.stats, typeEffectiveness);

        // Apply damage
        target.currentHealth -= damage;
        if (target.currentHealth < 0) {
            target.currentHealth = 0;
        }

        // Update target Pokemon health
        await activePokemonService.updateDocumentById(targetId, {currentHealth: target.currentHealth});

        // Update turn
        activeBattle.trainer1Turn = !activeBattle.trainer1Turn;

        // Check for winner
        const trainer1HasRemainingPokemon = activeBattle.activePokemon1.some(pokemon => pokemon.currentHealth > 0);
        const trainer2HasRemainingPokemon = activeBattle.activePokemon2.some(pokemon => pokemon.currentHealth > 0);

        if (!trainer1HasRemainingPokemon || !trainer2HasRemainingPokemon) {
            const winner = trainer1HasRemainingPokemon ? activeBattle.trainer1 : activeBattle.trainer2;
            const loser = trainer1HasRemainingPokemon ? activeBattle.trainer2 : activeBattle.trainer1;
            await this.endBattle(battleId, winner);
            return {
                winner: trainer1HasRemainingPokemon ? activeBattle.trainer1 : activeBattle.trainer2,
                loser: trainer1HasRemainingPokemon ? activeBattle.trainer2 : activeBattle.trainer1,
                message: 'The battle has ended.'
            };
        } else {
            // Save the updated activeBattle and return it
            await activeBattle.save();
            return activeBattle;
        }
    }




    calculateTypeEffectiveness(moveType, targetType) {
        return typeEffectiveness[moveType][targetType];
    }
    calculateDamage(attacker, defender, move) {
        const attackStat = move.category === 'physical' ? attacker.stats.attack : attacker.stats.specialAttack;
        const defenseStat = move.category === 'physical' ? defender.stats.defense : defender.stats.specialDefense;

        const typeEffectivenessMultiplier = this.calculateTypeEffectiveness(move.type, defender.type);
        const levelFactor = 2 * attacker.level / 5 + 2;
        const baseDamage = Math.floor((levelFactor * move.power * attackStat / defenseStat) / 50) + 2;
        const damage = Math.floor(baseDamage * typeEffectivenessMultiplier);

        return damage;
    }
}

module.exports = new BattleService();
