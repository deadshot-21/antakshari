const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    groupName:String,
    number:String,
    members:[String]
});

const Player = mongoose.model('player',playerSchema);

module.exports = Player;