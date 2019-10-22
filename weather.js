const util = require ('./util');
const fetch = require('node-fetch');
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';

const headers = {
    'Accept': 'application/json'
};

module.exports.getWeather = async event =>{
    try {
        const city = event.queryStringParameters.city;
        if (!city) {
          throw new Error(
            "Missing parameters! Make sure to add parameters 'city'."
          );
        }
        const weather = await this.fetchWeather(city);
        console.log(`got weather for ${city}`, weather)
        util.generateResponse(200, weather);
    } catch(error) {
        console.error(error);
        util.generateResponse(500, error);
    }
}

module.exports.fetchWeather = async(city) => {
    try {
        const response = await fetch(apiUrl+city+`&APPID=d693a7d09290d4c3d41b93c81cbb2152`, {
            method: 'GET',
            headers: headers
        });
        return await response.json();
    } catch(error) {
        console.error(error);
        util.generateResponse(500, error);
    }
}