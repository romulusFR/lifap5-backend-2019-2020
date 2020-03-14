/**
 * @file Generic errors handlers to be used directly by the express app in app.js using app.use()
 * @author Romuald THION
 */

const createError = require('http-errors');
const { logger, config } = require('../config');

function notFoundHandler(req, res, next) {
  const msg = `notFoundHandler@${req.method} ${req.url} - ${req.ip}`;
  logger.debug(msg);
  next(createError.NotFound(`URL '${req.url}' not found`));
}

function defaultErrorHandler(err, req, res, next) {
  // this should NOT happen
  if (res.headersSent) {
    logger.error(
      `defaultErrorHandler@has to call next(err) because res.headersSent=${res.headersSent}`
    );
    next(err);
  }

  const { name, message, status = 500 } = err;
  const stack = config.env === 'development' ? err.stack : undefined;

  res.status(status);
  res.format({
    html() {
      res.render('error', { stack, name, message, status });
    },

    json() {
      res.send({
        appname: res.locals.appname,
        version: res.locals.version,
        name,
        message,
        status,
      });
    },

    default() {
      res.render('error', { stack, name, message, status });
    },
  });

  const msg = `defaultErrorHandler@${status} - ${req.method} ${req.url} - ${req.ip} : ${name} - ${message}`;
  if (status >= 500) {
    logger.error(msg);
  } else {
    logger.info(msg);
  }
}

module.exports = {
  notFoundHandler,
  defaultErrorHandler,
};
