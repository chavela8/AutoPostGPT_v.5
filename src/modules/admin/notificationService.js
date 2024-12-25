
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

function notifyAdmins(message) {
  const adminChatIds = process.env.ADMIN_CHAT_IDS.split(',');
  adminChatIds.forEach(chatId => {
    bot.telegram.sendMessage(chatId, message);
  });
}

function notifyNewPost(post) {
  notifyAdmins(`Новый пост опубликован:\n${post.text}`);
}

function notifyError(error) {
  notifyAdmins(`Произошла ошибка:\n${error.message}`);
}

function notifyStats(stats) {
  notifyAdmins(`Статистика:\n${JSON.stringify(stats, null, 2)}`);
}

module.exports = {
  notifyAdmins,
  notifyNewPost,
  notifyError,
  notifyStats,
};