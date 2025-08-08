// logger.js
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logDir = 'logs';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: path.join(logDir, '%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '10m',
      maxFiles: '14d'
    }),
    new transports.Console()
  ]
});

module.exports = logger;