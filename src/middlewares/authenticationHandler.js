/**
 * @file X-API-KEY authentication handler
 * @author Romuald THION
 */

// X-API-KEY
// test.user   944c5fdd-af88-47c3-a7d2-5ea3ae3147da
// other.user  64decee2-acca-4a86-8e60-a46c4ccbca97

const { isUUID } = require('validator');
const createError = require('http-errors');
const { logger, pool } = require('../config');


// query to check an api_key
async function getUserFromApiKey(apiKey) {
  logger.silly(`getUserFromApiKey@${apiKey}`);
  const result = await pool.query(
    'SELECT user_id, firstname, lastname FROM quiz_user WHERE api_key=$1;',
    [apiKey]
  );
  return result.rows[0];
}

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
    const result = await getUserFromApiKey(token);
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
