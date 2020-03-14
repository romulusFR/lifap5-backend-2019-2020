/**
 * @file The postgres connection ppoler to execute queries
 * @author Romuald THION
 */

const { Pool } = require('pg');
const config = require('./config');
const { logger } = require('./logger');

const pool = new Pool({
  user: config.pgUser,
  host: config.pgHost,
  database: config.pgDname,
  password: config.pgPass,
  port: config.pgPort,
  connectionTimeoutMillis: 2000,
  idleTimeoutMillis: 10000, // default
  max: 20,
  ssl: { rejectUnauthorized: false },
  // eslint-disable-next-line camelcase
  application_name: config.appname,
});

// config postgres
// ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'
// ssl_key_file = '/etc/ssl/private/ssl-cert-snakeoil.key'

pool.on('error', (err, _client) => {
  logger.error(`Unexpected error on client with error: ${err}`);
  throw err;
});

module.exports = { pool };
