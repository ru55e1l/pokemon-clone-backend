const trainerService = require('../trainer-service');
const battleActiveService = require('./battle-active-service');
const completedBattleService = require('./battle-complete-service');
const activePokemonService = require('../pokemon/active-pokemon-service');
const moveService = require('../move-service');
const typeEffectiveness = require('../../constants/Move/typeEffectiveness');
const pokemonService = require('../pokemon/pokemon-service');

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
        const damage = await this.calculateDamage(activePokemon, target, move);

        // Find the target Pokemon in the activeBattle
        const targetIndex1 = activeBattle.activePokemon1.findIndex(pokemon => pokemon.activePokemonId.equals(targetId));
        const targetIndex2 = activeBattle.activePokemon2.findIndex(pokemon => pokemon.activePokemonId.equals(targetId));

        // Apply damage
        if (targetIndex1 >= 0) {
            activeBattle.activePokemon1[targetIndex1].currentHealth -= damage;
            if (activeBattle.activePokemon1[targetIndex1].currentHealth < 0) {
                activeBattle.activePokemon1[targetIndex1].currentHealth = 0;
            }
        } else {
            activeBattle.activePokemon2[targetIndex2].currentHealth -= damage;
            if (activeBattle.activePokemon2[targetIndex2].currentHealth < 0) {
                activeBattle.activePokemon2[targetIndex2].currentHealth = 0;
            }
        }

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
            await battleActiveService.updateDocumentById(activeBattle._id, activeBattle);
            return activeBattle;
        }
    }




    calculateTypeEffectiveness(moveType, targetType) {
        return typeEffectiveness[moveType][targetType];
    }
    async calculateDamage(attacker, defender, move) {
        const attackStat = attacker.stats.attack;
        const defenseStat = defender.stats.defense;

        const defenderPokemon = await pokemonService.getDocumentById(defender.pokemon);
        const defenderType = defenderPokemon.type[0];

        const typeEffectivenessMultiplier = this.calculateTypeEffectiveness(move.type, defenderType);
        const levelFactor = 2 * attacker.level / 5 + 2;
        const baseDamage = Math.floor((levelFactor * move.power * attackStat / defenseStat) / 50) + 2;
        const damage = Math.floor(baseDamage * typeEffectivenessMultiplier);

        return damage;
    }
}

module.exports = new BattleService();
