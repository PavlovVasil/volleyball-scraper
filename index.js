const cheerio = require('cheerio');
const axios = require('axios');
const mongoose = require('mongoose');
const Ranking = require('./models/Ranking');
require('dotenv/config')

//take nodeList and break it down into several separate tables. The first element in each table is its header.
const breakIntoTables = ($, nodeListArray, selector) => {
    const result = [];
    let currentTable = [];
    for (let i = 0; i < nodeListArray.length; i++) {
        //if this is not a title
        if ($(nodeListArray[i]).attr('bgcolor') !== selector) {
            currentTable.push(nodeListArray[i]);
            //if this is the last item, add the last chunk
            if (i === nodeListArray.length - 1) {
                result.push(currentTable);
            }
        } else {
            //add chunk, empty it and add he current title to the next chunk
            result.push(currentTable);
            currentTable = [];
            currentTable.push(nodeListArray[i]);

            //skipping the first row of each table, as it contains empty links
            i++
        }
    }
    return result;
}

(async () => {
    mongoose.connect(
        process.env.DB_CONNECTION,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => {
            console.log('connected to DB')
        })
    try {
        const response = await axios.get('https://volleymania.com/standings');
        //loading response in cheerio
        const $ = cheerio.load(response.data);
        const mainRankingTitle = $('#content .mainContent h3')[0];
        const allTableRows = Array.from($('#content .mainContent table tbody tr'));
        allTableRows.unshift(mainRankingTitle);
        const tables = breakIntoTables($, allTableRows, "#FFFFFF");

        //testing the DB
        const ranking = new Ranking({
            title: 'String',
            team: 'String',
            scorePlusCupScore: 1,
            cupScore: 1,
            matches: 1,
            wins: 1,
            losses: 1,
            games: 1,
            gameRatio: 1,
            scoreDifference: 1,
            scoreRatio: 1
        });

        try{
            const savedRanking = await ranking.save();
            console.log(savedRanking);
        } catch (err){
            console.log(err);
        }

        console.log(tables);
    } catch (err) {
        console.log(err)
    }
})()