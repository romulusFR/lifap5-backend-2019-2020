const { Router } = require('express');
const createError = require('http-errors');
const { logger, config } = require('../utils');
const { UserDAO } = require('../models/');

const userRouter = Router();

// the list of all users
// curl -X GET -H "Content-Type:application/json" http://localhost:3000/user/all
async function getAllUsers(_req, res, next) {
  try {
    const results = await UserDAO.getAllUsers();
    return res.status(200).send(results);
  } catch (err) {
    logger.debug(`getAllUsers throw ${err}`);
    // logger.error(err.stack);
    return next(err);
  }
}

// curl -H "Accept:application/json" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da" http://localhost:3000/user/whoami
// curl -H "Accept:text/*" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da" http://localhost:3000/user/whoami
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
    // logger.error(err.stack);
    return next(err);
  }
}

function sendUser(req, res, _next) {
  logger.debug(`sendUser, ${JSON.stringify(req.user)}`);
  // res.status(200).send(req.user);
  const { appname, version } = config;
  res.format({
    html() {
      res.render('whoami', { appname, version, user: req.user });
    },

    json() {
      res.send({ appname, version, user: req.user });
    },
  });
}

userRouter.get('/all', [getAllUsers]);
userRouter.get('/whoami', [authFromApiKeyHandler, sendUser]);

module.exports = { userRouter, authFromApiKeyHandler };
