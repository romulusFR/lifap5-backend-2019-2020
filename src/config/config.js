/**
 * @file wrapper over dotenv configuration and package.json to get configuration paramaters and general information
 * @author Romuald THION
 */

const { name, version, description } = require('../../package.json');
require('dotenv').config();

const appname = name || '';
const env = process.env.NODE_ENV || 'development';
const debugLvl = process.env.DEV_CONSOLE_DEBUG_LVL || 'debug';

const httpPort = process.env.NODE_PORT || '3000';

const pgHost = process.env.PG_HOST || 'localhost';
const pgPort = process.env.PG_PORT || '5432';
const pgUser = process.env.PG_USER || 'lifap5';
const pgPass = process.env.PG_PASS || '';
const pgDname = process.env.PG_DNAME || 'lifap5';
const pgSchema = process.env.PG_SCHEMA || 'lifap5';


module.exports = {
  appname,
  version,
  description,
  env,
  debugLvl,
  httpPort,
  pgHost,
  pgPort,
  pgUser,
  pgPass,
  pgDname,
  pgSchema,
};
