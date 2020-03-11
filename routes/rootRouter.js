// A default router for examples and tests

const { Router } = require('express');
const createError = require('http-errors');
const { logger, config } = require('../utils');
const { negotiateContentHandler } = require('./genericHandlers');

const rootRouter = Router();

// curl -H "Accept: application/json" http://localhost:3000/
const sendIndex = negotiateContentHandler(
  {
    htmlView: 'index',
    htmlArgs: (_req, _res) => ({ description: config.description }),
  },
  {
    jsonArgs: (req, res) => ({
      appname: res.locals.appname,
      version: res.locals.version,
      description: config.description,
    }),
  }
);

function NotImplemented(_req, _res, next) {
  next(new createError.NotImplemented('Not implemented yet'));
}

function echoHandler(req, res) {
  logger.debug(`echoHandler(${req.body})`);
  return res.send(req.body);
}

// the index page
rootRouter.get('/', sendIndex);

// basic echo service : simply returns the json body
// curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost:3000/echo/
rootRouter.post('/echo', echoHandler);

// a router that always returns an error
rootRouter.get('/not-implemented', NotImplemented);


module.exports = { rootRouter };
