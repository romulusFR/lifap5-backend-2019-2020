'use strict'; 

// Main configurations for winston and morgan
// https://github.com/winstonjs/winston
// https://github.com/bithavoc/express-winston
// https://github.com/winstonjs/logform
// https://github.com/expressjs/morgan

const {name, version} = require('./config');
// const {LEVEL, MESSAGE, SPLAT} = require('triple-beam');

const winston = require('winston');
const morgan = require('morgan');

// const fs = require('fs');
// const path = require('path');

// Winston

const winston_opts = {
  level: 'info',
  transports: [
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
      })
  ],
  format: winston.format.combine(
    winston.format.label({ label: `${name}@${version}` }),
    winston.format.timestamp(),
    winston.format.prettyPrint(),
  ),
  exitOnError: false,
};

const winston_logger = winston.createLogger(winston_opts);

winston_logger.stream = {
  write: function(message, _encoding){
    winston_logger.info(message);
  }
};

// Morgan

morgan.token('x-api-key', function (req, res) {
  return req.headers['x-api-key'] }
);

//const morgan_format = ':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms';

function morgan_format(tokens, req, res) {
  
  const msg = {
    'x-api-key': tokens['x-api-key'](req, res),
    'referrer': tokens.referrer(req, res),
    'remote-addr': tokens['remote-addr'],
    'method' : tokens.method(req, res),
    'url' : tokens.url(req, res),
    'status' : tokens.status(req, res),
    'length':tokens.res(req, res, 'content-length'),
    'time': tokens['response-time'](req, res, 3),
  };
  return JSON.stringify(msg);
}

const morgan_opts = { "stream": winston_logger.stream };
const morgan_logger = morgan(morgan_format, morgan_opts);

// Exports

module.exports.logger = winston_logger;
module.exports.morgan = morgan_logger;