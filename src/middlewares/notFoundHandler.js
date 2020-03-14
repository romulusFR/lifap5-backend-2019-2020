/**
 * @file Generic errors handlers to be used directly by the express app in app.js using app.use()
 * @author Romuald THION
 */

const createError = require('http-errors');
const { logger } = require('../config');

module.exports = function notFoundHandler(_app) {
  function handler(req, _res, next) {
    const msg = `notFoundHandler@${req.method} ${req.url} - ${req.ip}`;
    logger.debug(msg);
    next(createError.NotFound(`URL '${req.url}' not found`));
  }

  return handler;
};
