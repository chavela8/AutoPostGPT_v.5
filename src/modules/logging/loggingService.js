const fs = require('fs');
const path = require('path');

/**
 * Функция для логирования сообщений.
 * @param {string} message - Сообщение для логирования.
 */
function logMessage(message) {
  const logPath = path.join(__dirname, 'logs', 'app.log');
  const logMessage = `${new Date().toISOString()} - INFO - ${message}\n`;
  fs.appendFileSync(logPath, logMessage);
}

/**
 * Функция для логирования ошибок.
 * @param {Error} error - Ошибка для логирования.
 */
function logError(error) {
  const logPath = path.join(__dirname, 'logs', 'app.log');
  const logMessage = `${new Date().toISOString()} - ERROR - ${error.message}\n`;
  fs.appendFileSync(logPath, logMessage);
}

module.exports = {
  logMessage,
  logError,
};