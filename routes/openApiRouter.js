/**
 * @file router for the '/api-docs' roue, bound to swagger-ui-express
 * @author Romuald THION
 */

const { Router } = require('express');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

// /!\ STOP swagger-jsdoc /!\

// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerDefinition = require('../swagger-definition');

// options for swagger-jsdoc: header of OAS and the routes to document
// const swaggerJSDocOpts = {
//   swaggerDefinition,
//   apis: ['routes/rootRouter.js'],
// };
// generates the json spec of the API
// const swaggerSpec = swaggerJSDoc(swaggerJSDocOpts);

// options to swagger-ui-express
// https://github.com/scottie1984/swagger-ui-express
// https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md
const swaggerUIOptions = {
  explorer: true,
  swaggerOptions: { validatorUrl: null },
};
const swaggerDocument = YAML.load('./static/open-api-specification.yaml');

// the router
const openApiRouter = Router();
openApiRouter.use('/', [
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, swaggerUIOptions),
]);

module.exports = { openApiRouter };
