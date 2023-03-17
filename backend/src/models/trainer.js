const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const validTypes = require("../constants/pokemon-types");

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
        ref: 'ActivePokemon',
        validate: {
            validator: async function(id) {
                const activePokemonService = require('../services/active-pokemon-service');
                const activePokemon = await activePokemonService.getDocumentById(id);
                if(!activePokemon){
                    return false
                }
                return true;
            },
            message: props => `Invalid ActivePokemon Id`
        }
    }],
    coins: {
        type: Number,
        required: true,
        default: 0,
    },
});
trainer.pre('save', function(){
    this.activePokemon = [];
});

trainer.plugin(passportLocalMongoose);
module.exports = mongoose.model('Trainer', trainer);
