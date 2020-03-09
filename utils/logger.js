'use strict'; 

// Main configuration for winston
// https://github.com/winstonjs/winston
// https://github.com/bithavoc/express-winston
// https://github.com/winstonjs/logform

const winston = require('winston');
const winston_middleware = require('express-winston');
const { LEVEL, MESSAGE, SPLAT } = require('triple-beam');
const fs = require('fs');
const path = require('path');
const {name, version} = require('../package.json');

const winston_opts = {
  level: 'info',
  transports: [
      new winston.transports.Console()
  ],
  format: winston.format.combine(
    // winston.format.colorize(),
    winston.format.label({ label: `${name}@${version}` }),
    winston.format.timestamp(),
    // winston.format.simple(),
    // winston.format.json(),
    winston.format.prettyPrint(),

  )
};

const winston_logger = winston.createLogger(winston_opts);
const winston_middleware_opts = {
  winstonInstance: winston_logger,
  requestWhitelist : ['url', 'method', 'query'],
  statusLevels: true
};

const request_opts = Object.assign({}, winston_middleware_opts);
const error_opts = Object.assign({}, winston_middleware_opts);

// const request_opts = Object.assign({level : 'info'}, winston_middleware_opts);
// const error_opts = Object.assign({level : 'error'}, winston_middleware_opts);

const request_logger = winston_middleware.logger(request_opts);
const error_logger = winston_middleware.errorLogger(error_opts);

module.exports.logger = winston_logger;
module.exports.request_logger = request_logger;
module.exports.error_logger = error_logger;
