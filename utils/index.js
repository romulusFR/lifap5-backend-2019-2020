'use strict'; 

// common utils and environment variables exported once

const {name, version, env, http_port} = require('./config');
const {logger, morgan} = require('./logger');

module.exports.name = name;
module.exports.version = version;
module.exports.env = env;
module.exports.http_port = http_port;

module.exports.logger = logger;
module.exports.morgan = morgan;