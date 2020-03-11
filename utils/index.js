// common utils and environment variables exported once

const config = require('./config');
const { logger, morgan } = require('./logger');

module.exports = { config, logger, morgan };
