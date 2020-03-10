const createError = require('http-errors');
const {logger, env} = require('../utils/');

function not_found_handler(req, res, next) {
  next(createError.NotFound(`${req.url}`));
}

function default_error_handler(err, req, res, _next) {
  res.locals.message = err.message;
  res.locals.status = err.status || 500;
  res.locals.error =  (env === 'development') ? err : '';
  res.status(res.locals.status);
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <h1>Error: ${res.locals.status}</h1>
    <h2>Message: ${res.locals.message}</h2>
    <p>${res.locals.error}</p>
  </html>`);

  const level = (res.locals.status >= 500) ? 'error'  : 'info';
  logger.log(level, `${res.locals.status} - ${req.method} ${req.url} - ${req.ip}`);
}

module.exports.not_found_handler = not_found_handler;
module.exports.default_error_handler = default_error_handler;