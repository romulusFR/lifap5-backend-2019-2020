/**
 * @file common utils (logge) and environment variables exported once
 * https://github.com/winstonjs/winston
 * https://github.com/winstonjs/winston-transport
 * https://github.com/winstonjs/logform
 * https://github.com/expressjs/morgan
 * https://github.com/bithavoc/express-winston pas utilisé
 * @author Romuald THION
 */

// const {LEVEL, MESSAGE, SPLAT} = require('triple-beam');

const winston = require('winston');
const morgan = require('morgan');
const path = require('path');
const { env } = require('./config');

// https://github.com/winstonjs/winston#logging
// const levels = { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6};

// Winston : transports

// file loggers
// pour voir l'état courant : watch -t -d -c -n 1 tail -n 5 ./logs/error.log
const errorFileName = path.join(__dirname, '../logs', 'error.log');
const httpFileName = path.join(__dirname, '../logs', 'access.log');
// const error_stream = fs.createWriteStream(error_file_name, {flags: 'a'});
// const http_stream = fs.createWriteStream(http_file_name, {flags: 'a'});

const transportsFileOpts = {
  handleExceptions: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
};

const winstonTransports = [
  new winston.transports.File({
    ...transportsFileOpts,
    filename: errorFileName,
    level: 'info',
  }),
  new winston.transports.File({
    ...transportsFileOpts,
    filename: httpFileName,
    level: 'http',
  }),
];

if (env === 'development') {
  winstonTransports.push(
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.level}@${info.timestamp}: ${info.message}`
        )
      ),
    })
  );
}

// Winston : logger
const winstonOpts = {
  level: 'info',
  transports: winstonTransports,
  exitOnError: false,
};
const winstonLogger = winston.createLogger(winstonOpts);

winstonLogger.stream = {
  write(message) {
    winstonLogger.http(message);
  },
};

// Morgan
morgan.token('x-api-key', (req, _res) => req.headers['x-api-key']);

// pipe morgan to winston
const morganOpts = { stream: winstonLogger.stream };
const morganFormat =
  ':status - :method :url - :remote-addr(:x-api-key) - :res[content-length]B (:response-time ms)';
const morganLogger = morgan(morganFormat, morganOpts);

// Exports
module.exports.logger = winstonLogger;
module.exports.morgan = morganLogger;
