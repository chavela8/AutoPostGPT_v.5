const axios = require('axios');

/**
 * Функция для автоматического тегирования контента.
 * @param {string} text - Текст для тегирования.
 * @returns {Promise<string>} - Текст с добавленными хэштегами.
 */
async function generateHashtags(text) {
  try {
    const response = await axios.get(`https://api.example.com/hashtags`, {
      params: {
        apiKey: process.env.HASHTAG_GENERATOR_API_KEY,
        text: text,
      },
    });
    const hashtags = response.data.hashtags.join(' ');
    return `${text}\n\n${hashtags}`;
  } catch (error) {
    console.error('Ошибка при генерации хэштегов:', error);
    return text;
  }
}

module.exports = {
  generateHashtags,
};