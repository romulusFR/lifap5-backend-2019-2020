'use strict'; 

const {name, version, environment, http_port} = require('./config');
const logger = require('./logger');

module.exports.name = name;
module.exports.version = version;
module.exports.environment = environment;
module.exports.logger = logger;
module.exports.http_port = http_port;