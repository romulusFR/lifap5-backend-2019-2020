'use strict'; 

// common utils and environment variables exported once

const {name, version, environment, http_port} = require('./config');
const {logger, morgan} = require('./logger');

module.exports.name = name;
module.exports.version = version;
module.exports.environment = environment;
module.exports.http_port = http_port;

module.exports.logger = logger;
module.exports.morgan = morgan;