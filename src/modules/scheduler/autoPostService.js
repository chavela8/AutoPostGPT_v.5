const schedule = require('node-schedule');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

/**
 * Функция для планирования автоматической публикации постов.
 * @param {string} time - Время публикации в формате cron.
 * @param {function} callback - Функция, которая будет вызвана в указанное время.
 */
function scheduleAutoPost(time, callback) {
  schedule.scheduleJob(time, callback);
}

/**
 * Функция для автоматической публикации контента.
 * @param {Array} posts - Массив постов для публикации.
 */
function autoPostContent(posts) {
  posts.forEach((post, index) => {
    const time = `*/${index + 1} * * * *`; // Пример расписания: публикация постов каждую минуту
    scheduleAutoPost(time, async () => {
      if (post.photo) {
        await bot.telegram.sendPhoto(process.env.TARGET_CHANNEL_ID, { source: post.photo }, { caption: post.text });
      } else if (post.video) {
        await bot.telegram.sendVideo(process.env.TARGET_CHANNEL_ID, { source: post.video }, { caption: post.text });
      } else if (post.audio) {
        await bot.telegram.sendAudio(process.env.TARGET_CHANNEL_ID, { source: post.audio }, { caption: post.text });
      } else {
        await bot.telegram.sendMessage(process.env.TARGET_CHANNEL_ID, post.text);
      }
    });
  });
}

module.exports = {
  scheduleAutoPost,
  autoPostContent,
};