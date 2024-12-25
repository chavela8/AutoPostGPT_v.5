const axios = require('axios');

/**
 * Функция для публикации контента в Instagram.
 * @param {string} content - Контент для публикации.
 * @returns {Promise<void>}
 */
async function postToInstagram(content) {
  try {
    await axios.post('https://api.instagram.com/v1/media', {
      access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      caption: content,
    });
    console.log('Контент успешно опубликован в Instagram');
  } catch (error) {
    console.error('Ошибка при публикации в Instagram:', error);
  }
}

/**
 * Функция для публикации контента в VK.
 * @param {string} content - Контент для публикации.
 * @returns {Promise<void>}
 */
async function postToVK(content) {
  try {
    await axios.post('https://api.vk.com/method/wall.post', {
      access_token: process.env.VK_ACCESS_TOKEN,
      owner_id: process.env.VK_OWNER_ID,
      message: content,
      v: '5.131',
    });
    console.log('Контент успешно опубликован в VK');
  } catch (error) {
    console.error('Ошибка при публикации в VK:', error);
  }
}

/**
 * Функция для публикации контента в Facebook.
 * @param {string} content - Контент для публикации.
 * @returns {Promise<void>}
 */
async function postToFacebook(content) {
  try {
    await axios.post(`https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/feed`, {
      access_token: process.env.FACEBOOK_ACCESS_TOKEN,
      message: content,
    });
    console.log('Контент успешно опубликован в Facebook');
  } catch (error) {
    console.error('Ошибка при публикации в Facebook:', error);
  }
}

module.exports = {
  postToInstagram,
  postToVK,
  postToFacebook,
};