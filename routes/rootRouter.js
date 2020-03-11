// A default router for examples and tests

const { Router } = require('express');
const createError = require('http-errors');
const { logger, config } = require('../utils');

const rootRouter = Router();

rootRouter.get('/error', (_req, _res, next) =>
  next(new createError.NotImplemented('Not yet'))
);

// basic echo service : simply returns the json body
// curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost:3000/echo/
rootRouter.post('/echo', function echoHandler(req, res) {
  logger.debug(`echoHandler(${req.body})`);
  return res.status(200).send(req.body);
});

// content negotiation
// http://expressjs.com/en/api.html#res.format
// http://expressjs.com/en/api.html#res.render
// http://expressjs.com/en/guide/using-template-engines.html

rootRouter.get('/', (_req, res, _next) => {
  res.render('index', { config });
});

module.exports = { rootRouter };
