const fs = require('fs');
const path = require('path');

/**
 * Функция для резервного копирования данных.
 * @param {string} data - Данные для резервного копирования.
 */
function backupData(data) {
  const backupPath = path.join(__dirname, 'backup', `${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
}

/**
 * Функция для логирования действий.
 * @param {string} action - Действие для логирования.
 */
function logAction(action) {
  const logPath = path.join(__dirname, 'logs', 'actions.log');
  const logMessage = `${new Date().toISOString()} - ${action}\n`;
  fs.appendFileSync(logPath, logMessage);
}

/**
 * Функция для проверки текста на наличие спама.
 * @param {string} text - Текст для проверки.
 * @returns {boolean} - True, если текст содержит спам.
 */
function isSpam(text) {
  const spamKeywords = ['спам', 'реклама', 'купить', 'скидка'];
  return spamKeywords.some(keyword => text.includes(keyword));
}

/**
 * Функция для модерации контента.
 * @param {Array} posts - Массив постов для модерации.
 * @returns {Array} - Отфильтрованный массив постов.
 */
function moderateContent(posts) {
  return posts.filter(post => !isSpam(post.text));
}

module.exports = {
  backupData,
  logAction,
  isSpam,
  moderateContent,
};