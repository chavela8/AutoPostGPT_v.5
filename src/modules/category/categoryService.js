const axios = require('axios');

/**
 * Функция для категоризации постов.
 * @param {string} text - Текст поста.
 * @returns {Promise<string>} - Категория поста.
 */
async function categorizePost(text) {
  try {
    const response = await axios.post('https://api.example.com/categorize', {
      apiKey: process.env.CATEGORY_API_KEY,
      text: text,
    });
    return response.data.category;
  } catch (error) {
    console.error('Ошибка при категоризации поста:', error);
    return 'Uncategorized';
  }
}

module.exports = {
  categorizePost,
};