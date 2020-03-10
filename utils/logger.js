'use strict'; 

// Main configurations for winston and morgan
// https://github.com/winstonjs/winston
// https://github.com/bithavoc/express-winston pas utilisé
// https://github.com/winstonjs/winston-transport
// https://github.com/winstonjs/logform
// https://github.com/expressjs/morgan

const {log_level, env} = require('./config');
// const {LEVEL, MESSAGE, SPLAT} = require('triple-beam');

const winston = require('winston');
const morgan = require('morgan');
const path = require('path');

// https://github.com/winstonjs/winston#logging
// const levels = { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6};

// Winston : transports

// file loggers
// pour voir l'état courant : watch -t -d -c -n 1 tail -n 5 ./logs/error.log
const error_file_name = path.join(__dirname, '../logs', 'error.log');
const http_file_name = path.join(__dirname, '../logs', 'access.log');
// const error_stream = fs.createWriteStream(error_file_name, {flags: 'a'});
// const http_stream = fs.createWriteStream(http_file_name, {flags: 'a'});

const winston_transports_file_opts = {
    handleExceptions: true,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
};

const winston_transports = [
  new winston.transports.File({...winston_transports_file_opts, filename: error_file_name, level: 'info'}),
  new winston.transports.File({...winston_transports_file_opts, filename: http_file_name,  level: 'http'}),
];

if (env === 'development'){
  winston_transports.push(
    new winston.transports.Console({
      level: log_level,
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ all: true }),
        winston.format.printf(info => `${info.level}@${info.timestamp}: ${info.message}`)
      ),
    })
  );
}

// Winston : logger
const winston_opts = {
  level: 'info',
  transports: winston_transports,
  exitOnError: false,
};
const winston_logger = winston.createLogger(winston_opts);

winston_logger.stream = {
  write: function(message){
    winston_logger.http(message);
  }
};

// Morgan
morgan.token('x-api-key', function (req, _res) {
  return req.headers['x-api-key'] }
);

// eslint-disable-next-line no-unused-vars
function morgan_format_json(tokens, req, res) {
  const msg = {
    'x-api-key': tokens['x-api-key'](req, res),
    'referrer': tokens.referrer(req, res),
    'remote-addr': tokens['remote-addr'],
    'method' : tokens.method(req, res),
    'url' : tokens.url(req, res),
    'status' : tokens.status(req, res),
    'length':tokens.res(req, res, 'content-length'),
    'response-time': tokens['response-time'](req, res, 3),
  };
  return JSON.stringify(msg);
}

const morgan_format = ':status - :method :url - :remote-addr(:x-api-key) - :res[content-length]B (:response-time ms)';

// pipe morgan to winston
const morgan_opts = { "stream": winston_logger.stream };
const morgan_logger = morgan(morgan_format, morgan_opts);

// Exports
module.exports.logger = winston_logger;
module.exports.morgan = morgan_logger;