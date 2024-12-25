const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

/**
 * Функция для отправки обратной связи администраторам.
 * @param {string} message - Сообщение с обратной связью.
 * @param {string} userId - ID пользователя, отправившего обратную связь.
 */
function sendFeedbackToAdmins(message, userId) {
  const adminChatIds = process.env.ADMIN_CHAT_IDS.split(',');
  adminChatIds.forEach(chatId => {
    bot.telegram.sendMessage(chatId, `Обратная связь от пользователя ${userId}:\n${message}`);
  });
}

/**
 * Функция для отправки подтверждения пользователю.
 * @param {string} userId - ID пользователя.
 */
function sendConfirmationToUser(userId) {
  bot.telegram.sendMessage(userId, 'Спасибо за ваш отзыв! Мы обязательно его рассмотрим.');
}

module.exports = {
  sendFeedbackToAdmins,
  sendConfirmationToUser,
};