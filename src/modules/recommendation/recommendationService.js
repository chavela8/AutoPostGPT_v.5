const axios = require('axios');

/**
 * Функция для получения трендов и популярных тем.
 * @returns {Promise<Array>} - Массив трендов и популярных тем.
 */
async function getTrends() {
  try {
    const response = await axios.get('https://api.example.com/trends', {
      params: { apiKey: process.env.TREND_API_KEY },
    });
    return response.data.trends;
  } catch (error) {
    console.error('Ошибка при получении трендов:', error);
    return [];
  }
}

/**
 * Функция для анализа конкурентов.
 * @param {string} competitorChannelId - ID канала конкурента.
 * @returns {Promise<object>} - Анализ конкурентов.
 */
async function analyzeCompetitor(competitorChannelId) {
  try {
    const response = await axios.get(`https://api.example.com/competitors/${competitorChannelId}`, {
      params: { apiKey: process.env.COMPETITOR_API_KEY },
    });
    return response.data.analysis;
  } catch (error) {
    console.error('Ошибка при анализе конкурентов:', error);
    return null;
  }
}

/**
 * Функция для предложения тем для контента.
 * @returns {Promise<Array>} - Массив предложенных тем.
 */
async function suggestContentTopics() {
  const trends = await getTrends();
  // Пример простого предложения тем на основе трендов
  const suggestedTopics = trends.map(trend => `Тема на основе тренда: ${trend}`);
  return suggestedTopics;
}

module.exports = {
  getTrends,
  analyzeCompetitor,
  suggestContentTopics,
};