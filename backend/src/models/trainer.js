const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const validTypes = require("../constants/validTypes");

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
    coins: {
        type: mongoose.Decimal128,
        required: true,
        default: 0,
    },
    inBattle: {
      type: Boolean,
      required: true,
      default: false,
    },
});
trainer.pre('save', async function (next) {
    this.inBattle = false;
});


trainer.plugin(passportLocalMongoose);
module.exports = mongoose.model('Trainer', trainer);
