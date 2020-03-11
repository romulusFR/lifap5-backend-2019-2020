const { Pool } = require('pg');
const { config, logger } = require('../utils');

const pool = new Pool({
  user: config.pgUser,
  host: config.pgHost,
  database: config.pgDname,
  password: config.pgPass,
  port: config.pgPort,
  connectionTimeoutMillis: 2000,
  idleTimeoutMillis: 10000, // default
  max: 20,
});

pool.on('error', (err, _client) => {
  logger.error(`Unexpected error on client with error: ${err}`);
  throw err;
});

module.exports = pool;
