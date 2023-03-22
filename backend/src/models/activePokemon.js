const mongoose = require('mongoose');

const activePokemon = new mongoose.Schema({
    nickname: {
        type: String,
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        validate: {
            validator: async function(value) {
                const trainerService = require('../services/trainer-service');
                const trainer = await trainerService.getDocumentByField({_id: value});
                return trainer !== null;
            },
            message: 'Invalid trainer ID'
        },
        required: true
    },
    pokemon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemon',
        validate: {
            validator: async function(value) {
                const pokemonService = require('../services/pokemon-service');
                const pokemon = await pokemonService.getDocumentByField({_id: value});
                return pokemon !== null;
            },
            message: 'Invalid pokemon ID'
        },
        required: true
    },
    exp: {
        type: mongoose.Decimal128,
        required: false,
    },
    equipped: {
        type: Boolean,
        required: false,
    },
    stats: {
        hp: Number,
        attack: Number,
        defense: Number,
        specialAttack: Number,
        specialDefense: Number,
        speed: Number
    },
    levelMultiplier: {
        type: Number,
        required: false,
    },
    level: {
        type: Number,
        required: false,
    },
    moves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Move',
        required: true
    }],
});

function calculateStats(baseStats) {
    const stats = {};
    for (const key in baseStats) {
        const value = baseStats[key];
        const minValue = value - value * 0.5;
        const maxValue = value + value * 0.5;
        stats[key] = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
    }
    return stats;
}

function calculateLevelMultiplier(stats, baseStats) {
    let totalPercentage = 0;
    let statCount = 0;
    for (const key in stats) {
        if (baseStats.hasOwnProperty(key)) {
            const percentage = stats[key] / baseStats[key];
            totalPercentage += percentage;
            statCount++;
        }
    }
    const averagePercentage = totalPercentage / statCount;
    return 1 / averagePercentage;
}

activePokemon.pre('save', async function (next) {
    const pokemonService = require('../services/pokemon-service');
    const pokemon = await pokemonService.getDocumentByField({ _id: this.pokemon });

    this.stats = calculateStats(pokemon.baseStats);
    this.levelMultiplier = calculateLevelMultiplier(this.stats, pokemon.baseStats);
    this.exp = 1;
    this.level = 1;
    this.active = false;
    next();
});

activePokemon.pre('findOneAndUpdate',  function(next) {
    const update = this.getUpdate();
    const exp = update.$set.exp || this.exp;
    const levelMultiplier = update.$set.levelMultiplier || this.levelMultiplier;
    const level = generateLevel(exp, levelMultiplier);
    update.$set.level = level;
    next();
});

activePokemon.set('toObject', { getters: true });
activePokemon.set('toJSON', { getters: true });

function generateLevel(exp, levelMultiplier){
    // Calculate the current level based on the experience and level multiplier
    let level = Math.floor(Math.sqrt(exp / levelMultiplier));
    // Calculate the experience required to reach the next level
    let nextLevelExp = Math.pow(level * levelMultiplier + 1, 2) * levelMultiplier;
    // If the current experience is greater than or equal to the experience required for the next level,
    // increase the level and update the experience required for the next level
    while (exp >= nextLevelExp) {
        level++;
        nextLevelExp = Math.pow(level * levelMultiplier + 1, 2) * levelMultiplier;
    }
    //start at 1
    level++;
    return level;
}
module.exports = mongoose.model('ActivePokemon', activePokemon);
