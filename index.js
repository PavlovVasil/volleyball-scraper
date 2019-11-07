const cheerio = require('cheerio');
const axios = require('axios');

//take nodeList and break it down into several separate tables
const breakIntoChunks = ($, nodeArr, selector) => {
    const result = [];
    let currentChunk = [];
    for (let i = 0; i < nodeArr.length; i++) {
        //if this is not a title
        if ($(nodeArr[i]).attr('bgcolor') !== selector) {
            currentChunk.push(nodeArr[i]);
            //if this is the last item, add the last chunk
            if (i === nodeArr.length -1){
                result.push(currentChunk);
            }
        } else {
            //add chunk, empty it and add he current title to the next chunk
            result.push(currentChunk);
            currentChunk = [];
            currentChunk.push(nodeArr[i]);
        }
    }
    return result;
}

(async () => {
    try {
        const response = await axios.get('https://volleymania.com/standings');
        //loading response in cheerio
        const $ = cheerio.load(response.data);
        const mainRankingTitle = $('#content .mainContent h3')[0];
        const allTableRows = Array.from($('#content .mainContent table tbody tr'));
        allTableRows.unshift(mainRankingTitle);
        const tables = breakIntoChunks($, allTableRows, "#FFFFFF");
        
        console.log(tables)
    } catch (err) {
        console.log(err)
    }
})()