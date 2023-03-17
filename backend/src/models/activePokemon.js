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
        type: Number,
        required: false,
    },
    active: {
        type: Boolean,
        required: true
    },
    levelMultiplier: {
        type: Number,
        required: true,
        default: 1
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

activePokemon.pre('save', function(next) {
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
