const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Функция для генерации текста на основе трендов.
 * @param {string} trend - Тренд, на основе которого будет сгенерирован текст.
 * @returns {Promise<string>} - Сгенерированный текст.
 */
async function generateTextFromTrend(trend) {
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Создай уникальный текст на основе тренда: ${trend}`,
      max_tokens: 150,
    });
    return completion.data.choices[0].text.trim();
  } catch (error) {
    console.error('Ошибка при генерации текста:', error);
    return '';
  }
}

/**
 * Функция для генерации изображения с помощью DALL-E.
 * @param {string} description - Описание для генерации изображения.
 * @returns {Promise<Buffer>} - Буфер сгенерированного изображения.
 */
async function generateImage(description) {
  try {
    const response = await openai.createImage({
      prompt: description,
      n: 1,
      size: '512x512',
    });
    const imageUrl = response.data.data[0].url;
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    return Buffer.from(imageResponse.data, 'binary');
  } catch (error) {
    console.error('Ошибка при генерации изображения:', error);
    return null;
  }
}

module.exports = {
  generateTextFromTrend,
  generateImage,
};