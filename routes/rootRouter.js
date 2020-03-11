// A default router for examples and tests

const { Router } = require('express');
const createError = require('http-errors');
const { logger, config } = require('../utils');

const rootRouter = Router();

// a router that always returns an error
rootRouter.get('/error', (_req, _res, next) =>
  next(new createError.NotImplemented('Not implemented yet'))
);

// basic echo service : simply returns the json body
// curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost:3000/echo/
rootRouter.post('/echo', function echoHandler(req, res) {
  logger.debug(`echoHandler(${req.body})`);
  return res.send(req.body);
});

// curl -H "Accept: application/json" http://localhost:3000/
rootRouter.get('/', (req, res, _next) => {
  logger.debug(`rootRouter.get('/') with Accept: ${req.get('Accept')}`);
  const { description } = config;
  res.format({
    html() {
      res.render('index', { description });
    },

    json() {
      res.send({
        appname: res.locals.appname,
        version: res.locals.version,
        description,
      });
    },
  });
});

module.exports = { rootRouter };
