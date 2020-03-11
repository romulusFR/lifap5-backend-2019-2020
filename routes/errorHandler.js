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
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <h1>ERROR ${status} (${name})</h1>
    <h2>${name}: ${message}</h2>
    <p>${stack}</p>
  </html>`);

  const msg = `${status} - ${req.method} ${req.url} - ${req.ip} : ${name} - ${message}`;
  if (status >= 500) {
    logger.error(msg);
  } else {
    logger.info(msg);
  }
}

module.exports = { notFoundHandler, defaultErrorHandler };
