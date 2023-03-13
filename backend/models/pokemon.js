const mongoose = require('mongoose');
const validTypes = require('../constants/pokemon-types');

const pokemon = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    type: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return v.every(type => validTypes.includes(type));
            },
            message: props => `Invalid Pokemon type(s): ${props.value.filter(type => !validTypes.includes(type)).join(', ')}`
        }
    },
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
