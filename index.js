const cheerio = require('cheerio');
const axios = require('axios');

(async () => {
    try {
        const response = await axios.get('https://volleymania.com/standings');
        //loading response in cheerio
        const $ = cheerio.load(response.data);
        const mainRankingTitle = $('#content .mainContent h3')[0];
        const allTableRows = Array.from($('#content .mainContent table tbody tr'))
        allTableRows.unshift(mainRankingTitle)
        console.log(allTableRows)
    } catch (err) {
        console.log(err)
    }
})()