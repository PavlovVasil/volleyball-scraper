const cheerio = require('cheerio');
const axios = require('axios');
const mongoose = require('mongoose');
const RankingSchema = require('./schema/RankingSchema');
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
            //adding the chunk to the final result, emptying it, and adding the current title to the next chunk
            result.push(currentTable);
            currentTable = [];
            currentTable.push(nodeListArray[i]);

            //skipping the first row of each table, as it contains empty links
            i++
        }
    }
    return result;
}

// convert a table to an object, containing the collection name and the documents to be stored in the DB
const convertTableToCollectionObj = ($, table) => {
    const collectionName = $(table).eq(0).text().replace(/"/g,"");
    const teams = [];

    for (let i = 1; i < table.length; i++) {
        const currentRow = $(table).eq(i).find('td');
        const team = {};
        team.teamRanking = parseInt(currentRow.eq(0).text(), 10);
        team.teamName = currentRow.eq(1).text();
        team.scorePlusCupScore = parseInt(currentRow.eq(2).text(), 10);
        team.cupScore = parseInt(currentRow.eq(3).text(), 10);
        team.matches = parseInt(currentRow.eq(4).text(), 10);
        team.wins = parseInt(currentRow.eq(5).text(), 10);
        team.losses = parseInt(currentRow.eq(6).text(), 10);
        team.games = currentRow.eq(7).text();
        team.gameRatio = currentRow.eq(8).text() === 'max' ? 'max' : parseFloat(currentRow.eq(8).text());
        team.scoreDifference = currentRow.eq(9).text();
        team.scoreRatio = parseFloat(currentRow.eq(10).text());
        teams.push(team);
    }
    
    return {collectionName: collectionName, teams: teams};
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
        //parsing the response with cheerio
        const $ = cheerio.load(response.data);
        const mainRankingTitle = $('#content .mainContent h3')[0];
        const allTableRows = Array.from($('#content .mainContent table tbody tr'));
        allTableRows.unshift(mainRankingTitle);
        const tables = breakIntoTables($, allTableRows, "#FFFFFF");
        for (table of tables) {
            const collectionObj = convertTableToCollectionObj($, table);
            let Ranking = mongoose.model(collectionObj.collectionName, RankingSchema);
        
            try {
                await Ranking.insertMany(collectionObj.teams);
            } catch (err) {
                console.log(err)
            }
        }
        //const firstTable = convertTableToCollectionObj($, tables[0]);
    } catch (err) {
        console.log(err)
    }
})()