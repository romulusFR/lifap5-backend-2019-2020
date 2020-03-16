/**
 * @file wrapper over dotenv configuration and package.json to get configuration paramaters and general information
 * @author Romuald THION
 */

const path = require('path');

const {
  name: appname = 'App',
  version = 'O.O.O',
  description = 'No description',
} = require('../../package.json');

require('dotenv').config({path: path.join(__dirname, "../../.env")});

const pageLimit = Number.parseInt(process.env.PAGE_LIMIT, 10) || 20;

const env = process.env.NODE_ENV || 'development';
const debugLvl = process.env.DEV_CONSOLE_DEBUG_LVL || 'debug';

const httpPort = Number.parseInt(process.env.NODE_PORT, 10) || 3000;

const pgHost = process.env.PG_HOST || 'localhost';
const pgPort = Number.parseInt(process.env.PG_PORT, 10) || 5432;
const pgUser = process.env.PG_USER || 'lifap5';
const pgPass = process.env.PG_PASS || 'THEPASSWORD';
const pgDname = process.env.PG_DNAME || 'lifap5';
const pgSchema = process.env.PG_SCHEMA || 'lifap5';

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
