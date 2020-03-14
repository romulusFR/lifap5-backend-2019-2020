/**
 * @file Express router under '/users'
 * @author Romuald THION
 */

const { Router } = require('express');
const { logger } = require('../../config');
const { UserDAO } = require('./UserDAO');
const { negotiateContentHandler, authFromApiKeyHandler } = require('../../middlewares/');

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

module.exports = { userRouter };
