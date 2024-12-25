const supportedLanguages = ['en', 'ru'];
let currentLanguage = 'en';

const messages = {
  en: {
    welcome: 'Welcome to AutoPost GPT!',
    help: 'This bot helps with automating content management in Telegram.',
    // ...другие сообщения на английском
  },
  ru: {
    welcome: 'Добро пожаловать в AutoPost GPT!',
    help: 'Этот бот помогает с автоматизацией управления контентом в Telegram.',
    // ...другие сообщения на русском
  }
};

function setLanguage(lang) {
  if (supportedLanguages.includes(lang)) {
    currentLanguage = lang;
  }
}

function getMessage(key) {
  return messages[currentLanguage][key] || key;
}

module.exports = {
  setLanguage,
  getMessage,
};