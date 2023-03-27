const mongoose = require('mongoose');
const trainerService = require("../services/trainer-service");

const CompletedBattleSchema = new mongoose.Schema({
    trainer1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true,
        validator: async function(value) {
            const trainerService = require('../services/trainer-service');
            const trainer = await trainerService.getDocumentByField({_id: value});
            return trainer !== null;
        },
    },
    trainer2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true,
        validator: async function(value) {
            const trainerService = require('../services/trainer-service');
            const trainer = await trainerService.getDocumentByField({_id: value});
            return trainer !== null;
        },
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: false,
    },
    endDate: {
        type: Date,
        required: false,
    },
});

module.exports = mongoose.model('BattleComplete', CompletedBattleSchema);
