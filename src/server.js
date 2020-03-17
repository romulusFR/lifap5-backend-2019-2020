// #!/usr/bin/env node

const http = require('http');
const { createTerminus } = require('@godaddy/terminus');
const { logger, config, pool } = require('./config');
const app = require('./app');

const httpServer = http.createServer(app);
const serverVersion = `${config.appname}@${config.version}[${config.env}]`;

// see https://github.com/godaddy/terminus/blob/master/example/postgres/index.js
// for an example with terminus and pg
function onSignal() {
  logger.silly(
    `onSignal@starting cleanup, ending node-postgres's pool`
  );
  return Promise.all([pool.end()]);
}

async function onHealthCheck() {
  const pgInfo = {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  };
  logger.silly(
    `onHealthCheck@(${JSON.stringify(pgInfo)})`
  );

  return Promise.all([
    pool.query('SELECT 1 AS ok;').then((res) => res.rowCount),
    // Promise.resolve(pgInfo),
  ]);
}

function onShutdown() {
  logger.debug(`onShutdown@${serverVersion} is shutting down`
  );
}

const terminusOpts = {
  // health check options: a function returning a promise indicating service health,
  healthChecks: { '/healthcheck': onHealthCheck, verbatim: false },
  timeout: 1000, // [optional = 1000] number of milliseconds before forceful exiting
  signals: ['SIGTERM', 'SIGINT', 'SIGUSR2'],
  onSignal, // [optional] cleanup function, returning a promise (used to be onSigterm)
  onShutdown, // [optional] called right before exiting
  logger: logger.error,
};

createTerminus(httpServer, terminusOpts);

// https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/catchunhandledpromiserejection.md

// catch promises without catch, cf. UnhandledPromiseRejectionWarning
process.on('unhandledRejection', (reason, promise) => {
  // https://nodejs.org/api/process.html#process_event_unhandledrejection
  logger.error(`Unhandled Rejection at ${JSON.stringify(promise)} with error: "${reason}"`);
  throw reason;
});

process.on('uncaughtException', async (error) => {
  // https://nodejs.org/api/process.html#process_event_uncaughtexception
  logger.error(`Uncaught Exception: ${error}, killing process`);
  await onSignal();
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});


httpServer.listen(config.httpPort, () => {
  logger.debug(
    `listen@${serverVersion} listening on ${config.httpPort}`
  );
});
