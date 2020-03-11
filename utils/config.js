const { name, version, description } = require('../package.json');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const httpPort = process.env.NODE_PORT || '3000';
const pgHost = process.env.PG_HOST || 'localhost';
const pgPort = process.env.PG_PORT || '5432';
const pgUser = process.env.PG_USER || 'lifap5';
const pgPass = process.env.PG_PASS || '';
const pgDname = process.env.PG_DNAME || 'lifap5';
const pgSchema = process.env.PG_SCHEMA || 'lifap5';

module.exports = {
  name,
  version,
  description,
  env,
  httpPort,
  pgHost,
  pgPort,
  pgUser,
  pgPass,
  pgDname,
  pgSchema,
};
