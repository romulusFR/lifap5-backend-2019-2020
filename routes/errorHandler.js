const createError = require('http-errors');
const { logger, config } = require('../utils');

function notFoundHandler(req, res, next) {
  next(createError.NotFound(`${req.url}`));
}

function defaultErrorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
  }
  const { name, message, status = 500 } = err;
  const stack = config.env === 'development' ? err.stack : '';
  res.status(status);
  res.render('error', { stack, name, message, status, config });

  const msg = `${status} - ${req.method} ${req.url} - ${req.ip} : ${name} - ${message}`;
  if (status >= 500) {
    logger.error(msg);
  } else {
    logger.info(msg);
  }
}

module.exports = { notFoundHandler, defaultErrorHandler };
