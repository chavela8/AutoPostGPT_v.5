const faqDatabase = {
  "What is your name?": "I am AutoPost GPT, your content automation assistant.",
  "How do I use this bot?": "You can use this bot to automate content posting, get content recommendations, and much more. Use /help to see all available commands.",
  "How can I contact support?": "You can contact support by sending an email to support@example.com.",
  // Добавьте больше вопросов и ответов по мере необходимости
};

/**
 * Функция для получения ответа на часто задаваемый вопрос.
 * @param {string} question - Вопрос пользователя.
 * @returns {string} - Ответ на вопрос или сообщение о том, что вопрос не найден.
 */
function getFaqAnswer(question) {
  return faqDatabase[question] || "Sorry, I don't have an answer to that question.";
}

module.exports = {
  getFaqAnswer,
};