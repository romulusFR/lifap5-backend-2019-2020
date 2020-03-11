const { Router } = require('express');
const createError = require('http-errors');
const { logger } = require('../utils');
const { UserDAO } = require('../models/');

const userRouter = Router();

async function getAllUsers(_req, res, next) {
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
  try {
    const result = await UserDAO.getUserFromApiKey(token);
    if (!result) {
      const err = new createError.Forbidden(
        `x-api-key "${token}" does not exist`
      );
      return next(err);
    }
    req.user = result;
    return next();
  } catch (err) {
    logger.debug(`authFromApiKeyHandler throw ${err}`);
    return next(err);
  }
}

function sendUser(req, res, next) {
  logger.debug(`sendUser, ${JSON.stringify(req.user)}`);
  res.format({
    html() {
      res.render('whoami', { user: req.user });
    },

    json() {
      res.send({ user: req.user });
    },
  });
}

// the list of all users
// curl -X GET -H "Content-Type:application/json" http://localhost:3000/user/all
userRouter.get('/all', [getAllUsers]);

// checks authentification and serves negotiated content
// curl -H "Accept:application/json" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da" http://localhost:3000/user/whoami
// curl -H "Accept:text/*" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da" http://localhost:3000/user/whoami
// curl -H "Accept:nonexistent/nonexistent" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da" http://localhost:3000/user/whoami
userRouter.get('/whoami', [authFromApiKeyHandler, sendUser]);

module.exports = { userRouter, authFromApiKeyHandler };
