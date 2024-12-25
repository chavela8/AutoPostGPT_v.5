const schedule = require('node-schedule');
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
 * Функция для установки интервалов между постами.
 * @param {Array} posts - Массив постов.
 * @param {number} interval - Интервал между постами в минутах.
 */
function setPostIntervals(posts, interval) {
  let currentTime = new Date();
  posts.forEach((post, index) => {
    currentTime.setMinutes(currentTime.getMinutes() + interval);

    schedulePost(`${currentTime.getHours()}:${currentTime.getMinutes()}`, async () => {
      await bot.telegram.sendMessage(process.env.TARGET_CHANNEL_ID, post.text);
    });
  });
}

/**
 * Функция для установки лимитов на количество постов в день.
 * @param {Array} posts - Массив постов.
 * @param {number} limit - Лимит на количество постов в день.
 * @returns {Array} - Обрезанный массив постов с учетом лимита.
 */
function limitPostsPerDay(posts, limit) {
  return posts.slice(0, limit);
}

module.exports = {
  schedulePost,
  setPostIntervals,
  limitPostsPerDay,
};