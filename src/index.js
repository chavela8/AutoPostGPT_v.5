require('dotenv').config();
const { Telegraf } = require('telegraf');
const { Pool } = require('pg');
const contentService = require('./modules/content/contentService');
const schedulerService = require('./modules/scheduler/schedulerService');
const analyticsService = require('./modules/analytics/analyticsService');
const mediaService = require('./modules/media/mediaService');
const recommendationService = require('./modules/recommendation/recommendationService');
const securityService = require('./modules/security/securityService');
const contentGenerationService = require('./modules/contentGeneration/contentGenerationService');
const postService = require('./modules/posts/postService');
const adminService = require('./modules/admin/adminService');
const notificationService = require('./modules/admin/notificationService');
const multiplatformService = require('./modules/multiplatform/multiplatformService');
const translationService = require('./modules/translation/translationService');
const hashtagService = require('./modules/hashtags/hashtagService');
const categoryService = require('./modules/categories/categoryService');
const strategyService = require('./modules/strategy/strategyService');
const moderationService = require('./modules/moderation/moderationService');
const feedbackService = require('./modules/feedback/feedbackService');
const loggingService = require('./modules/logging/loggingService');
const autoPostService = require('./modules/scheduler/autoPostService');
const roleService = require('./modules/auth/roleService');
const auditService = require('./modules/audit/auditService');
const faqService = require('./modules/faq/faqService');
const integrationService = require('./modules/api/integrationService');
const searchService = require('./modules/search/searchService');
const languageService = require('./modules/language/languageService');

// Инициализация бота
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Настройка подключения к базе данных
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Основная логика бота
bot.start((ctx) => ctx.reply(languageService.getMessage('welcome')));
bot.help((ctx) => ctx.reply(languageService.getMessage('help')));

// Проверка прав пользователя перед выполнением команды
bot.use((ctx, next) => {
  const userId = ctx.from.id.toString();
  const command = ctx.message.text.split(' ')[0].substring(1);

  const actionMap = {
    copy_content: 'manage_content',
    schedule_content: 'manage_content',
    auto_post: 'manage_content',
    stats: 'view_stats',
    suggest_topics: 'view_stats',
    generate_content: 'manage_content',
    translate: 'manage_content',
    backup: 'manage_content',
    categorize_post: 'manage_content',
    plan_strategy: 'manage_content',
    analyze_audience: 'view_stats',
    forecast_trends: 'view_stats',
    track_conversions: 'view_stats',
    generate_chart: 'view_stats',
    feedback: 'view_stats',
    faq: 'view_stats',
    weather: 'view_stats',
    news: 'view_stats',
    exchange_rates: 'view_stats',
    search_content: 'view_stats'
  };

  const action = actionMap[command];

  if (!roleService.canPerformAction(userId, action)) {
    return ctx.reply(languageService.getMessage('no_permission'));
  }

  auditService.logUserAction(userId, command, ctx.message.text);
  return next();
});

// Команда для копирования и обработки контента
bot.command('copy_content', async (ctx) => {
  try {
    const donorChannelId = ctx.message.text.split(' ')[1];
    if (!donorChannelId) {
      return ctx.reply(languageService.getMessage('provide_channel_id'));
    }

    ctx.reply(languageService.getMessage('copying_content'));

    const posts = await contentService.copyPostsFromDonor(donorChannelId);
    const filteredPosts = await moderationService.moderateContent(posts);

    for (let post of filteredPosts) {
      post.text = await contentService.rephraseText(post.text);
      post.text = await hashtagService.generateHashtags(post.text);
      post.text = contentService.addEmojis(post.text);

      if (post.photo) {
        const optimizedImage = await mediaService.optimizeImage(post.photo);
        await bot.telegram.sendPhoto(process.env.TARGET_CHANNEL_ID, { source: optimizedImage }, { caption: post.text });
      } else if (post.video) {
        const optimizedVideo = await mediaService.optimizeVideo(post.video);
        await bot.telegram.sendVideo(process.env.TARGET_CHANNEL_ID, { source: optimizedVideo }, { caption: post.text });
      } else if (post.audio) {
        const optimizedAudio = await mediaService.optimizeAudio(post.audio);
        await bot.telegram.sendAudio(process.env.TARGET_CHANNEL_ID, { source: optimizedAudio }, { caption: post.text });
      } else {
        await bot.telegram.sendMessage(process.env.TARGET_CHANNEL_ID, post.text);
      }

      // Кросспостинг в другие платформы
      await multiplatformService.postToInstagram(post.text);
      await multiplatformService.postToVK(post.text);
      await multiplatformService.postToFacebook(post.text);
    }

    ctx.reply(languageService.getMessage('content_copied'));
    adminService.notifyAdmins(languageService.getMessage('content_copied'));
    loggingService.logMessage(languageService.getMessage('content_copied'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при копировании контента: ${error.message}`);
  }
});

// Команда для планирования публикаций
bot.command('schedule_content', async (ctx) => {
  try {
    const donorChannelId = ctx.message.text.split(' ')[1];
    if (!donorChannelId) {
      return ctx.reply(languageService.getMessage('provide_channel_id'));
    }

    ctx.reply(languageService.getMessage('scheduling_content'));

    await schedulerService.scheduleContent(donorChannelId, ['реклама', 'спам'], 'Europe/Moscow');

    ctx.reply(languageService.getMessage('content_scheduled'));
    loggingService.logMessage(languageService.getMessage('content_scheduled'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при планировании контента: ${error.message}`);
  }
});

// Команда для автоматической публикации контента
bot.command('auto_post', async (ctx) => {
  try {
    const donorChannelId = ctx.message.text.split(' ')[1];
    if (!donorChannelId) {
      return ctx.reply(languageService.getMessage('provide_channel_id'));
    }

    ctx.reply(languageService.getMessage('starting_auto_post'));

    const posts = await contentService.copyPostsFromDonor(donorChannelId);
    const filteredPosts = await moderationService.moderateContent(posts);

    autoPostService.autoPostContent(filteredPosts);

    ctx.reply(languageService.getMessage('auto_post_started'));
    loggingService.logMessage(languageService.getMessage('auto_post_started'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при автоматической публикации контента: ${error.message}`);
  }
});

// Команда для получения статистики
bot.command('stats', async (ctx) => {
  try {
    const report = await analyticsService.generateReport();
    ctx.reply(`${languageService.getMessage('stats_report')}:\n${JSON.stringify(report, null, 2)}`);
    loggingService.logMessage(languageService.getMessage('stats_requested'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при получении статистики: ${error.message}`);
  }
});

// Команда для получения рекомендаций по контенту
bot.command('suggest_topics', async (ctx) => {
  try {
    const topics = await recommendationService.suggestContentTopics();
    ctx.reply(`${languageService.getMessage('suggested_topics')}:\n${topics.join('\n')}`);
    loggingService.logMessage(languageService.getMessage('suggestions_requested'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при получении рекомендаций: ${error.message}`);
  }
});

// Команда для генерации контента на основе трендов
bot.command('generate_content', async (ctx) => {
  try {
    const trend = ctx.message.text.split(' ').slice(1).join(' ');
    if (!trend) {
      return ctx.reply(languageService.getMessage('provide_trend'));
    }

    ctx.reply(languageService.getMessage('generating_content'));

    const generatedText = await contentGenerationService.generateTextFromTrend(trend);
    const generatedImage = await contentGenerationService.generateImage(trend);

    if (generatedImage) {
      await bot.telegram.sendPhoto(process.env.TARGET_CHANNEL_ID, { source: generatedImage }, { caption: generatedText });
    } else {
      await bot.telegram.sendMessage(process.env.TARGET_CHANNEL_ID, generatedText);
    }

    ctx.reply(languageService.getMessage('content_generated'));
    loggingService.logMessage(languageService.getMessage('content_generated'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при генерации контента: ${error.message}`);
  }
});

// Команда для перевода текста
bot.command('translate', async (ctx) => {
  try {
    const [_, targetLang, ...textParts] = ctx.message.text.split(' ');
    const text = textParts.join(' ');
    if (!targetLang || !text) {
      return ctx.reply(languageService.getMessage('provide_text_translation'));
    }

    ctx.reply(languageService.getMessage('translating_text'));

    const translatedText = await translationService.translateText(text, targetLang);
    ctx.reply(`${languageService.getMessage('translation')}:\n${translatedText}`);
    loggingService.logMessage(languageService.getMessage('text_translated'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при переводе текста: ${error.message}`);
  }
});

// Команда для резервного копирования данных
bot.command('backup', async (ctx) => {
  try {
    const data = await pool.query('SELECT * FROM posts LIMIT 1000'); // Ограничиваем количество результатов
    await securityService.backupData(data.rows);
    ctx.reply(languageService.getMessage('data_backed_up'));
    adminService.notifyAdmins(languageService.getMessage('data_backed_up'));
    loggingService.logMessage(languageService.getMessage('data_backed_up'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при резервном копировании данных: ${error.message}`);
  }
});

// Команда для категоризации постов
bot.command('categorize_post', async (ctx) => {
  try {
    const text = ctx.message.text.split(' ').slice(1).join(' ');
    if (!text) {
      return ctx.reply(languageService.getMessage('provide_text'));
    }

    ctx.reply(languageService.getMessage('categorizing_post'));

    const category = await categoryService.categorizePost(text);
    ctx.reply(`${languageService.getMessage('post_category')}:\n${category}`);
    loggingService.logMessage(languageService.getMessage('post_categorized'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при категоризации поста: ${error.message}`);
  }
});

// Команда для планирования контент-стратегии
bot.command('plan_strategy', async (ctx) => {
  try {
    ctx.reply(languageService.getMessage('planning_strategy'));

    const strategy = await strategyService.planContentStrategy();
    const strategyMessage = strategy.map(item => `${languageService.getMessage('topic')}: ${item.topic}, ${languageService.getMessage('time')}: ${item.time}`).join('\n');
    ctx.reply(`${languageService.getMessage('content_strategy')}:\n${strategyMessage}`);
    loggingService.logMessage(languageService.getMessage('strategy_planned'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при планировании стратегии: ${error.message}`);
  }
});

// Команда для анализа аудитории
bot.command('analyze_audience', async (ctx) => {
  try {
    ctx.reply(languageService.getMessage('analyzing_audience'));

    const audience = await analyticsService.analyzeAudience();
    ctx.reply(`${languageService.getMessage('audience_analysis')}:\n${JSON.stringify(audience, null, 2)}`);
    loggingService.logMessage(languageService.getMessage('analysis_performed'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при анализе аудитории: ${error.message}`);
  }
});

// Команда для прогнозирования трендов
bot.command('forecast_trends', async (ctx) => {
  try {
    ctx.reply(languageService.getMessage('forecasting_trends'));

    const trends = await analyticsService.forecastTrends();
    const trendsMessage = trends.map(trend => `${languageService.getMessage('topic')}: ${trend.topic}, ${languageService.getMessage('prediction')}: ${trend.prediction}`).join('\n');
    ctx.reply(`${languageService.getMessage('trends_forecast')}:\n${trendsMessage}`);
    loggingService.logMessage(languageService.getMessage('trends_forecasted'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при прогнозировании трендов: ${error.message}`);
  }
});

// Команда для отслеживания конверсий
bot.command('track_conversions', async (ctx) => {
  try {
    ctx.reply(languageService.getMessage('tracking_conversions'));

    const conversions = await analyticsService.trackConversions();
    ctx.reply(`${languageService.getMessage('conversions_data')}:\n${JSON.stringify(conversions, null, 2)}`);
    loggingService.logMessage(languageService.getMessage('conversions_tracked'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при отслеживании конверсий: ${error.message}`);
  }
});

// Команда для построения графиков
bot.command('generate_chart', async (ctx) => {
  try {
    const type = ctx.message.text.split(' ')[1];
    if (!type) {
      return ctx.reply(languageService.getMessage('provide_chart_type'));
    }

    ctx.reply(languageService.getMessage('generating_chart'));

    const data = {
      labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май'],
      datasets: [{
        label: languageService.getMessage('example_data'),
        data: [65, 59, 80, 81, 56],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }],
    };

    const chartBuffer = await analyticsService.generateChart(data, type, {});
    await bot.telegram.sendPhoto(ctx.chat.id, { source: chartBuffer });
    ctx.reply(languageService.getMessage('chart_generated'));
    loggingService.logMessage(languageService.getMessage('chart_generated'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при построении графика: ${error.message}`);
  }
});

// Команда для получения обратной связи
bot.command('feedback', async (ctx) => {
  try {
    const feedback = ctx.message.text.split(' ').slice(1).join(' ');
    if (!feedback) {
      return ctx.reply(languageService.getMessage('provide_feedback'));
    }

    feedbackService.sendFeedbackToAdmins(feedback, ctx.from.id);
    feedbackService.sendConfirmationToUser(ctx.from.id);

    ctx.reply(languageService.getMessage('feedback_thank_you'));
    loggingService.logMessage(languageService.getMessage('feedback_received'));
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при обработке обратной связи: ${error.message}`);
  }
});

// Команда для получения ответа на часто задаваемые вопросы
bot.command('faq', async (ctx) => {
  try {
    const question = ctx.message.text.split(' ').slice(1).join(' ');
    if (!question) {
      return ctx.reply(languageService.getMessage('provide_question'));
    }

    const answer = faqService.getFaqAnswer(question);
    ctx.reply(answer);
    loggingService.logMessage(`FAQ ответ: ${question} - ${answer}`);
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при получении ответа на FAQ: ${error.message}`);
  }
});

// Команда для получения текущей погоды
bot.command('weather', async (ctx) => {
  try {
    const city = ctx.message.text.split(' ').slice(1).join(' ');
    if (!city) {
      return ctx.reply(languageService.getMessage('provide_city'));
    }

    const weather = await integrationService.getWeather(city);
    ctx.reply(weather);
    loggingService.logMessage(`Погода запрошена для города: ${city}`);
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins(`Ошибка при получении погоды: ${error.message}`);
  }
});

// Команда для получения последних новостей
bot.command('news', async (ctx) => {
  try {
    const news = await integrationService.getNews();
    ctx.reply(`Последние новости:\n${news}`);
    loggingService.logMessage('Новости запрошены.');
  } catch (error) {
    ctx.reply(languageService.getMessage('error_occurred'));
    loggingService.logError(error);
    adminService.notifyAdmins