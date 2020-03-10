const createError = require('http-errors');
const { logger, config } = require('../utils');

function notFoundHandler(req, res, next) {
  next(createError.NotFound(`${req.url}`));
}

function defaultErrorHandler(err, req, res, _next) {
  res.locals.message = err.message;
  res.locals.status = err.status || 500;
  res.locals.error = config.env === 'development' ? err : '';
  res.status(res.locals.status);
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <h1>Error: ${res.locals.status}</h1>
    <h2>Message: ${res.locals.message}</h2>
    <p>${res.locals.error}</p>
  </html>`);

  const msg = `${res.locals.status} - ${req.method} ${req.url} - ${req.ip}`;
  if (res.locals.status >= 500) {
    logger.error(msg);
  } else {
    logger.info(msg);
  }
}

module.exports = { notFoundHandler, defaultErrorHandler};
