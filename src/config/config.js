/**
 * @file wrapper over dotenv configuration and package.json to get configuration paramaters and general information
 * @author Romuald THION
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// from package.json
const appname = process.env.npm_package_name || 'App';
const version = process.env.npm_package_version || 'O.O.O';
const description = process.env.npm_package_description || 'No description';

// environment and debug
const env = process.env.NODE_ENV || 'development';
const debugLvl = process.env.DEV_CONSOLE_DEBUG_LVL || 'debug';

// http server config
const httpPort = Number.parseInt(process.env.NODE_PORT, 10) || 3000;

// application configuration
const pageLimit = Number.parseInt(process.env.PAGE_LIMIT, 10) || 20;

// postgres database configuration
const pgHost = process.env.PG_HOST || 'localhost';
const pgPort = Number.parseInt(process.env.PG_PORT, 10) || 5432;
const pgUser = process.env.PG_USER || 'lifap5';
const pgPass = process.env.PG_PASS || 'THEPASSWORD';
const pgDname = process.env.PG_DNAME || 'lifap5';
const pgSchema = process.env.PG_SCHEMA || 'lifap5';

// exports all variables
module.exports = {
  appname,
  version,
  description,
  pageLimit,
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
