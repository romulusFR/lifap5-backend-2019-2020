const { name, version } = require('../package.json');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const httpPort = process.env.PORT || '3000';
const logLevel = process.env.LOG_LEVEL || 'debug';

const config = {
  name,
  version,
  env,
  httpPort,
  logLevel,
};

module.exports = config;
