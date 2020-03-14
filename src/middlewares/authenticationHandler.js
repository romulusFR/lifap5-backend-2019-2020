/**
 * @file X-API-KEY authentication handler
 * @author Romuald THION
 */

const { isUUID } = require('validator');
const createError = require('http-errors');
const { logger } = require('../config');

async function authFromApiKeyHandler(req, res, next) {
  const token = req.headers['x-api-key'];
  if (!token) {
    const err = new createError.Unauthorized(`x-api-key not provided`);
    return next(err);
  }
  if (!isUUID(token, 4)) {
    const err = new createError.BadRequest(`x-api-key is not a valid uuid`);
    return next(err);
  }
  try {
    const result = await UserDAO.getUserFromApiKey(token);
    if (!result) {
      const err = new createError.Forbidden(
        `x-api-key "${token}" does not exist`
      );
      return next(err);
    }
    logger.silly(
      `authFromApiKeyHandler@sets res.locals.user = ${JSON.stringify(result)}`
    );
    res.locals.user = result;
    return next();
  } catch (err) {
    logger.debug(`authFromApiKeyHandler@throw ${err}`);
    return next(err);
  }
}

module.exports = { authFromApiKeyHandler };
