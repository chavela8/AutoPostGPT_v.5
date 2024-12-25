const axios = require('axios');

/**
 * Функция для проверки текста на наличие нежелательного контента.
 * @param {string} text - Текст для проверки.
 * @returns {Promise<boolean>} - True, если текст содержит нежелательный контент.
 */
async function checkForUnwantedContent(text) {
  try {
    const response = await axios.post('https://api.example.com/moderation', {
      apiKey: process.env.MODERATION_API_KEY,
      text: text,
    });
    return response.data.isUnwanted;
  } catch (error) {
    console.error('Ошибка при проверке нежелательного контента:', error);
    return false;
  }
}

/**
 * Функция для автоматической модерации контента.
 * @param {Array} posts - Массив постов для модерации.
 * @returns {Promise<Array>} - Отфильтрованный массив постов.
 */
async function moderateContent(posts) {
  const moderatedPosts = [];
  for (const post of posts) {
    const isUnwanted = await checkForUnwantedContent(post.text);
    if (!isUnwanted) {
      moderatedPosts.push(post);
    }
  }
  return moderatedPosts;
}

module.exports = {
  checkForUnwantedContent,
  moderateContent,
};