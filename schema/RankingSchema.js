const mongoose = require('mongoose');

const RankingSchema = mongoose.Schema({
    teamRanking: Number,
    teamName: String,
    scorePlusCupScore: Number,
    cupScore: Number,
    matches: Number,
    wins: Number,
    losses: Number,
    games: String,
    gameRatio: Number,
    scoreDifference: String,
    scoreRatio: Number
})

//module.exports = mongoose.model('Rankings', RankingSchema)
module.exports = RankingSchema;