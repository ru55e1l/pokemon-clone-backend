const mongoose = require('mongoose');

const move = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    power: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    pp: { type: Number, required: true },
    priority: { type: Number, default: 0 },
    effect: { type: String, required: false },
    target: { type: String, required: true }
});

module.exports = mongoose.model('Move', move);