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
    return res.status(401).send();
  }
  try {
    const result = await UserDAO.getUserFromApiKey(token);
    if (result) {
      req.user = result;
      return next();
    }
    // TODO here custom error
    return res.status(403).send();
  } catch (err) {
    logger.error(`getUserFromApiKey throw ${err}`);
    logger.error(err.stack);
    return next(err);
  }
}

function sendUser(req, res, _next) {
  return res.status(200).send(req.user);
}

// the list of all users
// curl -X GET -H "Content-Type:application/json" http://localhost:3000/user/all
userRouter.get('/all', [getAllUsers]);
userRouter.get('/whoami', [authFromApiKeyHandler, sendUser]);

// router.get('/:login', [user_controller.find_by_login]);

module.exports = { userRouter, authFromApiKeyHandler };
