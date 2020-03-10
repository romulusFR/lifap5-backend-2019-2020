'use strict'; 

// Main configurations for winston and morgan
// https://github.com/winstonjs/winston
// https://github.com/bithavoc/express-winston
// https://github.com/winstonjs/logform
// https://github.com/expressjs/morgan

const {log_level, env} = require('./config');
// const {LEVEL, MESSAGE, SPLAT} = require('triple-beam');

const winston = require('winston');
const morgan = require('morgan');
const path = require('path');

const error_file_name = path.join(__dirname, '../logs', 'error.log');
const http_file_name = path.join(__dirname, '../logs', 'access.log');
// const error_stream = fs.createWriteStream(error_file_name, {flags: 'a'});
// const http_stream = fs.createWriteStream(http_file_name, {flags: 'a'});

// npm levels { 
//   error: 0, 
//   warn: 1, 
//   info: 2, 
//   http: 3,
//   verbose: 4, 
//   debug: 5, 
//   silly: 6 
// }

// Winston

const winston_transports = [
  new winston.transports.File({
    level: 'error',
    filename: error_file_name,
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
  new winston.transports.File({
    level: 'http',
    filename: http_file_name,
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
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

morgan.token('x-api-key', function (req, res) {
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