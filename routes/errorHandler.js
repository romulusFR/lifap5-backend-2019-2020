const createError = require('http-errors');
const { logger, config } = require('../utils');

function notFoundHandler(req, res, next) {
  next(createError.NotFound(`${req.url}`));
}

function defaultErrorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err)
  }
  const { code, message, status = 500} = err;
  const error = config.env === 'development' ? err : {};
  res.status(status);
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <h1>HTTP-ERROR ${status} (${code})</h1>
    <h2>Message: ${message}</h2>
    <p>${error}</p>
  </html>`);

  const msg = `${status} - ${req.method} ${req.url} - ${req.ip}`;
  if (res.locals.status >= 500) {
    logger.error(msg);
  } else {
    logger.info(msg);
  }
}

module.exports = { notFoundHandler, defaultErrorHandler};
