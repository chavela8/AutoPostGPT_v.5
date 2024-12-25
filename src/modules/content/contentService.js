const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Функция для копирования постов из донорского канала.
 * @param {string} donorChannelId - ID донорского канала.
 * @returns {Promise<Array>} - Массив скопированных постов.
 */
async function copyPostsFromDonor(donorChannelId) {
  // Пример получения постов из донорского канала
  try {
    const response = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getUpdates`, {
      params: {
        offset: -1,
        limit: 100,
        timeout: 0,
      },
    });
    const posts = response.data.result.filter(update => update.message && update.message.chat.id === donorChannelId);
    return posts.map(update => update.message);
  } catch (error) {
    console.error('Ошибка при копировании постов:', error);
    return [];
  }
}

/**
 * Функция для удаления нежелательного контента по ключевым словам.
 * @param {Array} posts - Массив постов.
 * @param {Array} keywords - Массив ключевых слов.
 * @returns {Array} - Очищенный массив постов.
 */
function filterUnwantedContent(posts, keywords) {
  return posts.filter(post => {
    return !keywords.some(keyword => post.text.includes(keyword));
  });
}

/**
 * Функция для переформулирования текста через GPT для уникальности.
 * @param {string} text - Исходный текст.
 * @returns {Promise<string>} - Уникальный текст.
 */
async function rephraseText(text) {
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Переформулируй следующий текст, чтобы он был уникальным:\n\n${text}`,
      max_tokens: 150,
    });
    return completion.data.choices[0].text.trim();
  } catch (error) {
    console.error('Ошибка при переформулировании текста:', error);
    return text;
  }
}

/**
 * Функция для генерации релевантных хэштегов.
 * @param {string} text - Текст поста.
 * @returns {string} - Текст с добавленными хэштегами.
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

/**
 * Функция для автоматического добавления эмодзи в текст.
 * @param {string} text - Текст поста.
 * @returns {string} - Текст с добавленными эмодзи.
 */
function addEmojis(text) {
  // Пример добавления эмодзи в текст
  const emojis = ['😊', '🚀', '✨', '🔥', '💡', '📚'];
  return `${text} ${emojis[Math.floor(Math.random() * emojis.length)]}`;
}

module.exports = {
  copyPostsFromDonor,
  filterUnwantedContent,
  rephraseText,
  generateHashtags,
  addEmojis,
};