const mongoose = require('mongoose');
const trainerService = require("../services/trainer-service");

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
    // other necessary fields for active battles
});

module.exports = mongoose.model("BattleActive", activeBattleSchema);