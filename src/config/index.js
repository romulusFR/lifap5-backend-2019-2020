/**
 * @file common utils (logge) and environment variables exported once
 * @author Romuald THION
 */

const config = require('./config');
const { logger, morgan } = require('./logger');
const { pool, PaginatedResult } = require('./pool');

module.exports = { config, logger, morgan, pool, PaginatedResult };
