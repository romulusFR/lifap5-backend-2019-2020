'use strict'; 
const {name, version} = require('../package.json');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const http_port = process.env.PORT || '3000';
const log_level = process.env.LOG_LEVEL || 'debug';

const configuration = {
  name,
  version,
  env,
  http_port,
  log_level,
};

module.exports = configuration;