/**
 * @file router for the '/api-docs' route, bound to swagger-ui-express
 * @author Romuald THION
 */

const { Router } = require('express');
const swaggerUI = require('swagger-ui-express');

// options to swagger-ui-express
// https://github.com/scottie1984/swagger-ui-express
// https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md
const swaggerUIOptions = {
  explorer: true,
  swaggerUrl: '/open-api-specification.yaml',
  swaggerOptions: { validatorUrl: null },
};

// the router
const openApiRouter = Router();
openApiRouter.use('/', [
  swaggerUI.serve,
  swaggerUI.setup(null, swaggerUIOptions),
]);


module.exports = { openApiRouter };
