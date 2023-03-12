const mongoose = require('mongoose');

const pokemon = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: [{
        type: String,
        required: true
    }],
    baseStats: {
        hp: {
            type: Number,
            required: true
        },
        attack: {
            type: Number,
            required: true
        },
        defense: {
            type: Number,
            required: true
        },
        specialAttack: {
            type: Number,
            required: true
        },
        specialDefense: {
            type: Number,
            required: true
        },
        speed: {
            type: Number,
            required: true
        }
    },
});

module.exports = mongoose.model('Pokemon', pokemon);
