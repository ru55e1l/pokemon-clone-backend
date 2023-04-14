const mongoose = require('mongoose');
const trainerService = require("../services/trainer-service");
const pokemonService = require("../services/pokemon/pokemon-service");
const activePokemonService = require("../services/pokemon/active-pokemon-service");

const activeBattleSchema = new mongoose.Schema({
    trainer1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required: true,
        validator: async function(value) {
            const trainerService = require('../services/trainer-service');
            const trainer = await trainerService.getDocumentByField({_id: value});
            return trainer !== null;
        },
    },
    trainer2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required: true,
        validator: async function(value) {
            const trainerService = require('../services/trainer-service');
            const trainer = await trainerService.getDocumentByField({_id: value});
            return trainer !== null;
        },
    },
    trainer1Turn: {
        type: Boolean,
        required: false,
        default: true
    },
    activePokemon1: [
        {
            _id: false,
            activePokemonId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ActivePokemon",
                required: true,
            },
            currentHealth: {
                type: Number,
                required: true,
            },
            stats: {
                hp: Number,
                attack: Number,
                defense: Number,
                specialAttack: Number,
                specialDefense: Number,
                speed: Number,
            },
        },
    ],
    activePokemon2: [
        {
            _id: false,
            activePokemonId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ActivePokemon",
                required: true,
            },
            currentHealth: {
                type: Number,
                required: true,
            },
            stats: {
                hp: Number,
                attack: Number,
                defense: Number,
                specialAttack: Number,
                specialDefense: Number,
                speed: Number,
            },
            moves: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Move',
                required: true
            }],
        },
    ],
    // other necessary fields for active battles
});

function calculateStatsByLevel(baseStats, level) {
    const stats = {};
    const statIncreasePerLevel = 1.25;

    for (const key in baseStats) {
        if (baseStats.hasOwnProperty(key)) {
            let scaledValue = baseStats[key];
            for (let i = 1; i < level; i++) {
                scaledValue *= statIncreasePerLevel;
            }
            stats[key] = Math.floor(scaledValue);
        }
    }

    return stats;
}

async function createActivePokemonList(activePokemonIds) {
    const activePokemonList = [];

    for (const activePokemonId of activePokemonIds) {
        const activePokemon = await activePokemonService.getDocumentByField({ _id: activePokemonId });
        const baseStats = activePokemon.stats;
        const level = activePokemon.level;
        const stats = calculateStatsByLevel(baseStats, level);
        const moves = activePokemon.moves;

        activePokemonList.push({
            activePokemonId: activePokemonId,
            currentHealth: stats.hp,
            stats: stats,
            moves: moves
        });
    }

    return activePokemonList;
}

activeBattleSchema.pre('save', async function (next) {
    const activepokemon1Ids = await activePokemonService.getActivePokemonByTrainerId(this.trainer1);
    const activepokemon2Ids = await activePokemonService.getActivePokemonByTrainerId(this.trainer2);

    this.activePokemon1 = await createActivePokemonList(activepokemon1Ids);
    this.activePokemon2 = await createActivePokemonList(activepokemon2Ids);

    next();
});

module.exports = mongoose.model("BattleActive", activeBattleSchema);
