const schedule = require('node-schedule');
const contentService = require('../content/contentService');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

/**
 * Функция для планирования публикации постов.
 * @param {string} time - Время публикации в формате 'HH:mm'.
 * @param {function} callback - Функция, которая будет вызвана в указанное время.
 */
function schedulePost(time, callback) {
  const [hour, minute] = time.split(':').map(Number);
  schedule.scheduleJob({ hour, minute }, callback);
}

/**
 * Функция для автоматического определения оптимального времени публикации.
 * @returns {string} - Оптимальное время публикации в формате 'HH:mm'.
 */
function determineOptimalTime() {
  const now = new Date();
  const optimalHour = (now.getHours() + 2) % 24; // Публикация через 2 часа
  const optimalMinute = now.getMinutes();
  return `${optimalHour}:${optimalMinute}`;
}

/**
 * Планировщик публикаций с учетом часовых поясов.
 * @param {string} donorChannelId - ID донорского канала.
 * @param {Array} keywords - Массив ключевых слов для фильтрации.
 * @param {string} timeZone - Часовой пояс.
 */
async function scheduleContent(donorChannelId, keywords, timeZone) {
  const posts = await contentService.copyPostsFromDonor(donorChannelId);
  const filteredPosts = contentService.filterUnwantedContent(posts, keywords);

  for (let post of filteredPosts) {
    post.text = await contentService.rephraseText(post.text);
    post.text = await contentService.generateHashtags(post.text);
    post.text = contentService.addEmojis(post.text);

    const optimalTime = determineOptimalTime();
    schedulePost(optimalTime, async () => {
      await bot.telegram.sendMessage(process.env.TARGET_CHANNEL_ID, post.text);
    });
  }
}

module.exports = {
  scheduleContent,
  determineOptimalTime,
  schedulePost,
};