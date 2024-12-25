const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');

/**
 * Функция для оптимизации изображения.
 * @param {Buffer} imageBuffer - Буфер изображения.
 * @returns {Promise<Buffer>} - Оптимизированный буфер изображения.
 */
async function optimizeImage(imageBuffer) {
  try {
    const optimizedImage = await sharp(imageBuffer)
      .resize({ width: 800 }) // Изменяем размер изображения до ширины 800 пикселей
      .jpeg({ quality: 80 }) // Устанавливаем качество JPEG на 80%
      .toBuffer();
    return optimizedImage;
  } catch (error) {
    console.error('Ошибка при оптимизации изображения:', error);
    throw error;
  }
}

/**
 * Функция для оптимизации видео.
 * @param {string} videoPath - Путь к видеофайлу.
 * @returns {Promise<string>} - Путь к оптимизированному видеофайлу.
 */
async function optimizeVideo(videoPath) {
  const outputPath = `${videoPath.split('.').slice(0, -1).join('.')}_optimized.mp4`;
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions('-vf', 'scale=1280:-1') // Изменяем размер видео до ширины 1280 пикселей
      .outputOptions('-crf', '28') // Устанавливаем качество видео (CRF)
      .save(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (error) => reject(error));
  });
}

/**
 * Функция для оптимизации аудио.
 * @param {string} audioPath - Путь к аудиофайлу.
 * @returns {Promise<string>} - Путь к оптимизированному аудиофайлу.
 */
async function optimizeAudio(audioPath) {
  const outputPath = `${audioPath.split('.').slice(0, -1).join('.')}_optimized.mp3`;
  return new Promise((resolve, reject) => {
    ffmpeg(audioPath)
      .outputOptions('-b:a', '128k') // Устанавливаем битрейт аудио
      .save(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (error) => reject(error));
  });
}

module.exports = {
  optimizeImage,
  optimizeVideo,
  optimizeAudio,
};