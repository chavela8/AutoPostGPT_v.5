const roles = {
  admin: ['manage_users', 'manage_content', 'view_stats'],
  editor: ['manage_content', 'view_stats'],
  viewer: ['view_stats'],
};

/**
 * Функция для проверки прав пользователя на выполнение действия.
 * @param {string} userId - ID пользователя.
 * @param {string} action - Действие, которое нужно проверить.
 * @returns {boolean} - True, если пользователь имеет право на выполнение действия.
 */
function canPerformAction(userId, action) {
  const userRole = getUserRole(userId); // Предполагается, что у вас есть функция для получения роли пользователя
  return roles[userRole].includes(action);
}

/**
 * Функция для получения роли пользователя.
 * @param {string} userId - ID пользователя.
 * @returns {string} - Роль пользователя.
 */
function getUserRole(userId) {
  // Пример получения роли пользователя из базы данных
  // В реальной реализации замените это на запрос к вашей базе данных
  const userRoles = {
    'user1': 'admin',
    'user2': 'editor',
    'user3': 'viewer',
  };

  return userRoles[userId] || 'viewer';
}

module.exports = {
  canPerformAction,
  getUserRole,
};