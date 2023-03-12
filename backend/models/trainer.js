const mongoose = require('mongoose');

const trainer = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true },
    joinDate: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    },
    activePokemon: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivePokemon'
    }]
});

module.exports = mongoose.model('Trainer', trainer);
