const util = require ('./util');
const fetch = require('node-fetch');
const apiUrl = 'https://cat-fact.herokuapp.com/facts/random';

const headers = {
    'Accept': 'application/json'
};

module.exports.getCatFact = async event =>{
    try {
        const fact = await this.fetchCatFact();
        console.log('got cat fact', fact);
        util.generateResponse(200, fact);
    } catch(error) {
        console.error(error);
        util.generateResponse(500, error);
    }
}

module.exports.fetchCatFact = async () => {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
        });
        return await response.json();
    } catch(error) {
        console.error(error);
        util.generateResponse(500, error);
    }
}