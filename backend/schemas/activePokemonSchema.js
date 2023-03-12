const mongoose = require('mongoose');

const activePokemonSchema = new mongoose.Schema({
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    pokemon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemon',
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    moves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Move',
        required: true
    }],
    active: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('ActivePokemon', activePokemonSchema);
