'use strict'; 

// Main configuration for winston
// https://github.com/winstonjs/winston
// https://github.com/bithavoc/express-winston
// https://github.com/winstonjs/logform

const {name, version} = require('./config');
const winston = require('winston');
const {LEVEL, MESSAGE, SPLAT} = require('triple-beam');
// const fs = require('fs');
// const path = require('path');


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

module.exports = winston_logger;
