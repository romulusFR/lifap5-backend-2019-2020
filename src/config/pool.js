/**
 * @file The postgres connection ppoler to execute queries
 * @author Romuald THION
 */

const { Pool } = require('pg');
const config = require('./config');
const { logger } = require('./logger');

const connectionString = `postgresql://${config.pgUser}:${config.pgPass}@${config.pgHost}:${config.pgPort}/${config.pgDname}`;

const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 2000, // 2 sec
  idleTimeoutMillis: 300000, // 5 min
  max: 20,
  ssl: { rejectUnauthorized: false },
  application_name: config.appname,
});

// config postgres
// ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'
// ssl_key_file = '/etc/ssl/private/ssl-cert-snakeoil.key'

pool.on('connect', (_client) => {
  logger.silly(`Client connected to ${connectionString}`);
});

pool.on('error', (err, _client) => {
  logger.error(`Unexpected error on client with error: ${err}`);
  throw err;
});

module.exports = { pool };
