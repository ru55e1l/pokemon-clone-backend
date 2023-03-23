const mongoose = require('mongoose');

const move = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true, lowercase: true },
    power: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    pp: { type: Number, required: true },
    priority: { type: Number, default: 0 },
    effect: { type: String, required: false, lowercase: true },
    target: { type: String, required: true, lowercase: true },
    level: {type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('Move', move);
