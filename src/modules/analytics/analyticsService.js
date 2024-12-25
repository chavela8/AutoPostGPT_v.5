const { Pool } = require('pg');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * Функция для построения графиков на основе данных.
 * @param {Array} data - Данные для графика.
 * @param {string} type - Тип графика (line, bar, pie и т.д.).
 * @param {Object} options - Дополнительные настройки графика.
 * @returns {Promise<Buffer>} - Буфер изображения графика.
 */
async function generateChart(data, type, options) {
  const width = 800;
  const height = 600;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const configuration = {
    type: type,
    data: data,
    options: options,
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

/**
 * Функция для анализа аудитории.
 * @returns {Promise<Object>} - Анализ аудитории.
 */
async function analyzeAudience() {
  try {
    const result = await pool.query('SELECT * FROM audience');
    return result.rows;
  } catch (error) {
    console.error('Ошибка при анализе аудитории:', error);
    return [];
  }
}

/**
 * Функция для прогнозирования трендов.
 * @returns {Promise<Array>} - Прогноз трендов.
 */
async function forecastTrends() {
  try {
    const result = await pool.query('SELECT * FROM trends');
    const trends = result.rows;

    // Пример простого прогнозирования на основе текущих трендов
    const forecast = trends.map(trend => ({
      topic: trend.topic,
      prediction: trend.score * 1.1, // Пример простого увеличения на 10%
    }));

    return forecast;
  } catch (error) {
    console.error('Ошибка при прогнозировании трендов:', error);
    return [];
  }
}

/**
 * Функция для отслеживания конверсий.
 * @returns {Promise<Array>} - Данные о конверсиях.
 */
async function trackConversions() {
  try {
    const result = await pool.query('SELECT * FROM conversions');
    return result.rows;
  } catch (error) {
    console.error('Ошибка при отслеживании конверсий:', error);
    return [];
  }
}

module.exports = {
  generateChart,
  analyzeAudience,
  forecastTrends,
  trackConversions,
};