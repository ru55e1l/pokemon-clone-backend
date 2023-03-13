const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const trainer = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    Birthday: {
        type: Date,
        required: true,
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    roles: {
        type: [String],
        required: true,
        default: ['user'],
    },
    activePokemon: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivePokemon'
    }]
});
trainer.plugin(passportLocalMongoose);
module.exports = mongoose.model('Trainer', trainer);
