'use strict'; 
const {name, version} = require('../package.json');
require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';
const http_port = process.env.PORT || '3000';

const configuration = {
  name,
  version,
  environment,
  http_port,
};

module.exports = configuration;