const axios = require('axios');

/**
 * Функция для автоматического перевода текста.
 * @param {string} text - Текст для перевода.
 * @param {string} targetLang - Язык перевода.
 * @returns {Promise<string>} - Переведенный текст.
 */
async function translateText(text, targetLang) {
  try {
    const response = await axios.post('https://api.example.com/translate', {
      apiKey: process.env.TRANSLATOR_API_KEY,
      text: text,
      targetLang: targetLang,
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Ошибка при переводе текста:', error);
    return text;
  }
}

module.exports = {
  translateText,
};