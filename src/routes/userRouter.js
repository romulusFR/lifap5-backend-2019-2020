/**
 * @file Express router under '/users'
 * @author Romuald THION
 */

const { Router } = require('express');
const createError = require('http-errors');
const { isUUID } = require('validator');
const { logger } = require('../utils');
const { UserDAO } = require('../models/');
const { negotiateContentHandler } = require('./genericHandlers');

const userRouter = Router();

async function getAllUsersHandler(_req, res, next) {
  try {
    const results = await UserDAO.getAllUsers();
    return res.send(results);
  } catch (err) {
    logger.debug(`getAllUsers throw ${err}`);
    // logger.error(err.stack);
    return next(err);
  }
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
    const result = await UserDAO.getUserFromApiKey(token);
    if (!result) {
      const err = new createError.Forbidden(
        `x-api-key "${token}" does not exist`
      );
      return next(err);
    }
    logger.silly(`authFromApiKeyHandler@sets res.locals.user = ${JSON.stringify(result)}`);
    res.locals.user = result;
    return next();
  } catch (err) {
    logger.debug(`authFromApiKeyHandler@throw ${err}`);
    return next(err);
  }
}

const whoamiHandler = negotiateContentHandler(
  { htmlView: 'whoami', htmlArgs: (req, res) => res.locals.user },
  { jsonArgs: (req, res) => res.locals.user }
);

// the list of all users
// curl -X GET -H "Content-Type:application/json" http://localhost:3000/user/all
userRouter.get('/', [getAllUsersHandler]);

// checks authentification and serves negotiated content
// curl -H "Accept:application/json" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da" http://localhost:3000/user/whoami
// curl -H "Accept:text/*" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da" http://localhost:3000/user/whoami
// curl -H "Accept:nonexistent/nonexistent" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da" http://localhost:3000/user/whoami
// deals with errors
// 403 (ForbiddenError)   curl -H "Accept:text/*" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae314700" http://localhost:3000/user/whoami
// 400 (Bad Request)      curl -H "Accept:text/*" -H "X-API-KEY:invalid" http://localhost:3000/user/whoami
userRouter.get('/whoami', [authFromApiKeyHandler, whoamiHandler]);

module.exports = { userRouter, authFromApiKeyHandler };
