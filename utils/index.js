// common utils and environment variables exported once

const config = require('./config');
const { logger, morgan } = require('./logger');
const negotiateContent = require('./negotiateContent');

module.exports = { config, logger, morgan, negotiateContent };
