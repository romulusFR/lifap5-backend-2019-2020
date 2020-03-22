/**
 * @file The postgres connection ppoler to execute queries
 * @author Romuald THION
 */

const { Pool, Client } = require('pg');
const config = require('./config');
const { logger } = require('./logger');

/* **************************** POOL CONFIGURATION  **************************** */

const connectionString = `postgresql://${config.pgUser}:${config.pgPass}@${config.pgHost}:${config.pgPort}/${config.pgDname}`;
const poolConfig = {
  connectionString,
  connectionTimeoutMillis: 2000, // 2 sec
  idleTimeoutMillis: 300000, // 5 min
  max: 20,
  ssl: { rejectUnauthorized: false },
  application_name: config.appname,
};

const pool = new Pool(poolConfig);

pool.on('connect', (client) => {
  logger.silly(`pool@client ${client.processID} added to the pool`);
});

pool.on('remove', (client) => {
  logger.silly(`pool@client ${client.processID} removed from the pool`);
});


pool.on('error', (err, client) => {
  logger.error(`pool@unexpected error on client ${client.processID} with error: ${err}`);
  throw err;
});

/* **************************** LONG RUNNING CLIENT FOR LISTEN/NOTIFY  **************************** */

function defaultNotificationCallback(msg) {
  logger.debug(`Notification on '${msg.channel}' : ${msg.payload}`);
};

async function createLongRunningClient(channel, callback = defaultNotificationCallback) {
  const client = new Client({ ...poolConfig, keepAlive: true });

  try {
    client.connect(() => logger.silly(`createLongRunningClient@client ${client.processID} connected`));

    client.query(`LISTEN ${channel}`);

    client.on('notification', callback);

    client.on('error', (err) => {
      logger.error(
        `createLongRunningClient@received unexpected error: ${err}`
      );
    });
  } catch (err) {
    logger.error(
      `createLongRunningClient@caught unexpected error on long running client with error: ${err}`
    );
    throw err;
  }
  return client;
}



/* **************************** FOR PAGINATED RESULTS  **************************** */

class PaginatedResult {
  static defaultPageSize() {
    return config.pageLimit;
  }

  constructor(currentPage, totalResults, pageSize, results) {
    this.nbResults = totalResults;
    this.nbPages = Math.ceil(totalResults / pageSize);
    this.pageSize = pageSize;
    this.currentPage = currentPage;
    this.results = results;
  }
}

/* **************************** EXPORTS  **************************** */

module.exports = { pool, createLongRunningClient, PaginatedResult };
