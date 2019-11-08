const cheerio = require('cheerio');
const axios = require('axios');

//take nodeList and break it down into several separate tables. The first element in each table is its header.
const breakIntoTables = ($, nodeListArray, selector) => {
    const result = [];
    let currentTable = [];
    for (let i = 0; i < nodeListArray.length; i++) {
        //if this is not a title
        if ($(nodeListArray[i]).attr('bgcolor') !== selector) {
            currentTable.push(nodeListArray[i]);
            //if this is the last item, add the last chunk
            if (i === nodeListArray.length -1){
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
    try {
        const response = await axios.get('https://volleymania.com/standings');
        //loading response in cheerio
        const $ = cheerio.load(response.data);
        const mainRankingTitle = $('#content .mainContent h3')[0];
        const allTableRows = Array.from($('#content .mainContent table tbody tr'));
        allTableRows.unshift(mainRankingTitle);
        const tables = breakIntoTables($, allTableRows, "#FFFFFF");
        
        console.log(tables)
    } catch (err) {
        console.log(err)
    }
})()