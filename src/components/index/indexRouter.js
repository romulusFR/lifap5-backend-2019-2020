/**
 * @file Express router under '/'
 * @author Romuald THION
 */

const { Router } = require('express');
const createError = require('http-errors');
const { logger, config } = require('../../config');
const { negotiateContentHandler } = require('../../middlewares/');

const indexHandler = negotiateContentHandler(
  {
    htmlView: 'index',
    htmlArgs: (_req, _res) => ({ description: config.description }),
  },
  {
    jsonArgs: (_req, res) => ({
      appname: res.locals.appname,
      version: res.locals.version,
      description: config.description,
    }),
  }
);

function notImplementedHandler(_req, _res, next) {
  next(new createError.NotImplemented('Not implemented yet'));
}

function echoHandler(req, res) {
  logger.debug(`echoHandler(${req.body})`);
  return res.send(req.body);
}

const indexRouter = Router();

//
// curl -H "Accept: application/json" http://localhost:3000/
indexRouter.get('/', indexHandler);

// basic echo service : simply returns the json body
// curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost:3000/echo/
indexRouter.post('/echo', echoHandler);

// a router that always returns an error
// curl -H "Accept: application/json"  http://localhost:3000/not-implemented/
indexRouter.get('/not-implemented', notImplementedHandler);

module.exports = { indexRouter };
