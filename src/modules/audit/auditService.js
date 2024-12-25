const fs = require('fs');
const path = require('path');

/**
 * Функция для записи действия пользователя в журнал аудита.
 * @param {string} userId - ID пользователя.
 * @param {string} action - Выполненное действие.
 * @param {string} details - Дополнительные детали действия.
 */
function logUserAction(userId, action, details) {
  const logPath = path.join(__dirname, 'logs', 'audit.log');
  const logMessage = `${new Date().toISOString()} - USER: ${userId} - ACTION: ${action} - DETAILS: ${details}\n`;
  fs.appendFileSync(logPath, logMessage);
}

module.exports = {
  logUserAction,
};