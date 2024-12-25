const axios = require('axios');

/**
 * Функция для планирования контент-стратегии.
 * @returns {Promise<Array>} - Массив предложенных тем и времени публикаций.
 */
async function planContentStrategy() {
  try {
    const trendsResponse = await axios.get('https://api.example.com/trends', {
      params: { apiKey: process.env.TREND_API_KEY },
    });
    const audienceResponse = await axios.get('https://api.example.com/audience', {
      params: { apiKey: process.env.AUDIENCE_API_KEY },
    });

    const trends = trendsResponse.data.trends;
    const audience = audienceResponse.data.audience;

    // Пример простого планирования на основе трендов и анализа аудитории
    const strategy = trends.map((trend, index) => ({
      topic: trend,
      time: audience.optimalTimes[index % audience.optimalTimes.length],
    }));

    return strategy;
  } catch (error) {
    console.error('Ошибка при планировании контент-стратегии:', error);
    return [];
  }
}

module.exports = {
  planContentStrategy,
};