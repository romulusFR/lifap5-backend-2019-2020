const { Pool } = require('pg');
const { config } = require('../utils');

const pool = new Pool({
  user: config.pgUser,
  host: config.pgHost,
  database: config.pgDname,
  password: config.pgPass,
  port: config.pgPort,
});

module.exports = pool;
