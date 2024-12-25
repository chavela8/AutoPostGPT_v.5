const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

/**
 * Функция для отправки уведомлений администраторам.
 * @param {string} message - Сообщение для отправки.
 */
function notifyAdmins(message) {
  const adminChatIds = process.env.ADMIN_CHAT_IDS.split(',');
  adminChatIds.forEach(chatId => {
    bot.telegram.sendMessage(chatId, message);
  });
}

/**
 * Функция для мониторинга ошибок и проблем.
 * @param {Error} error - Ошибка для мониторинга.
 */
function monitorErrors(error) {
  console.error('Мониторинг ошибки:', error);
  notifyAdmins(`Произошла ошибка: ${error.message}`);
}

module.exports = {
  notifyAdmins,
  monitorErrors,
};