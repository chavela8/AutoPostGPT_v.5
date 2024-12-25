const axios = require('axios');

async function getWeather(city) {
  const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`);
  return `Погода в ${city}: ${response.data.current.temp_c}°C, ${response.data.current.condition.text}`;
}

async function getNews() {
  const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`);
  return response.data.articles.map(article => `${article.title}\n${article.url}`).join('\n\n');
}

async function getExchangeRates(base) {
  const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`);
  return Object.entries(response.data.rates).map(([currency, rate]) => `${currency}: ${rate}`).join('\n');
}

module.exports = {
  getWeather,
  getNews,
  getExchangeRates,
};