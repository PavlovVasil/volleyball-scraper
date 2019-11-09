const mongoose = require('mongoose');

const RankingSchema = mongoose.Schema({
    title: String,
    team: String,
    scorePlusCupScore: Number,
    cupScore: Number,
    matches: Number,
    wins: Number,
    losses: Number,
    games: Number,
    gameRatio: Number,
    scoreDifference: Number,
    scoreRatio: Number
})

module.exports = mongoose.model('Rankings', RankingSchema)