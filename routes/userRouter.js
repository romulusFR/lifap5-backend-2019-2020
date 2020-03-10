const { Router } = require('express');
const { logger } = require('../utils');
const { UserDAO } = require('../models/');

const userRouter = Router();

async function getAllUsers(_req, res, next) {
  try {
    const results = await UserDAO.getAllUsers();
    return res.status(200).send(results);
  } catch (err) {
    logger.error(`getAllUsers throw ${err}`);
    logger.error(err.stack);
    return next(err);
  }
}

// curl -X GET -H "Content-Type: application/json" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da" http://localhost:3000/user/whoami
async function authFromApiKeyHandler(req, res, next) {
  const token = req.headers['x-api-key'];
  if (!token) {
    // TODO here custom error
    // { name: "NoX-Api-KeyProvided", message: "No x-api-key provided." }
    logger.info(`authFromApiKeyHandler 401`);
    const err = new Error(`x-api-key not provided`);
    err.status = 401;
    return next(err);
  }
  try {
    const result = await UserDAO.getUserFromApiKey(token);
    if (!result) {
      // TODO here custom error
      logger.info(`authFromApiKeyHandler 403`);
      const err = new Error(`x-api-key "${token}" does not exist`);
      err.status = 403;
      return next(err);
    }
    req.user = result;
    return next();
  } catch (err) {
    logger.error(`authFromApiKeyHandler throw ${err}`);
    logger.error(err.stack);
    return next(err);
  }
}

function sendUser(req, res, _next) {
  logger.debug(`sendUser, ${JSON.stringify(req.user)}`);
  return res.status(200).send(req.user);
}

// the list of all users
// curl -X GET -H "Content-Type:application/json" http://localhost:3000/user/all
userRouter.get('/all', [getAllUsers]);
userRouter.get('/whoami', [authFromApiKeyHandler, sendUser]);

// router.get('/:login', [user_controller.find_by_login]);

module.exports = { userRouter, authFromApiKeyHandler };
