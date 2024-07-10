/*eslint no-console:0 */
const { default: axios } = require('axios');
const { log } = require('console');
const fs = require('fs/promises');
const mkdirp = require('mkdirp');
const path = require('path');

const pathToJSON = path.join(__dirname, '../test/swu/json/Card');

function getAttributeNames(attributeList) {
    return attributeList.data.map((attr) => attr.attributes.name);
}

function filterValues(card) {
    filteredObj = (
        ({ title, subtitle, cost, hp, power, text, deployBox, epicAction, cardId, unique, rules, type, traits, arenas, keywords}) => 
            ({ title, subtitle, cost, hp, power, text, deployBox, epicAction, cardId, unique, rules, type, traits, arenas, keywords}))
        (card.attributes);

    filteredObj.aspects = getAttributeNames(card.attributes.aspects);
    filteredObj.type = getAttributeNames(card.attributes.arenas)[0];
    filteredObj.traits = getAttributeNames(card.attributes.traits);
    filteredObj.arenas = getAttributeNames(card.attributes.arenas);
    filteredObj.keywords = getAttributeNames(card.attributes.keywords);

    return filteredObj;
}

async function main() {
    var currPage = 1;
    var lastPage = 0;
    do {
        await axios.get('https://admin.starwarsunlimited.com/api/cards?pagination[page]=' + currPage)
            .then(res => { lastPage = res.data.meta.pagination.pageCount; return res.data.data; })
            .then((cards) => {
                console.log(cards.length + ' cards fetched. on page ' + currPage + ' of ' + lastPage);
                // console.log(cards);
                mkdirp.sync(pathToJSON);
                return Promise.all(
                    cards.map((card) => fs.writeFile(path.join(pathToJSON, `${card.id}.json`), JSON.stringify([filterValues(card)], null, 2)))
                );
            })
            .catch((error) => console.log('error fetching: ' + error));
    
        currPage++;
        return;
    } while (currPage <= lastPage);   
}

main();
