// common utils and environment variables exported once

const config = require('./config');
const { logger, morgan } = require('./logger');

module.exports.config = config;
module.exports.logger = logger;
module.exports.morgan = morgan;
