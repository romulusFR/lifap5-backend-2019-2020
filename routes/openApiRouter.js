const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = require('../swagger-definition');

const swaggerJSDocOpts = {
  swaggerDefinition,
  apis: ['routes/*Router.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerJSDocOpts);

const swaggerUIOptions = { explorer: true };

const openApiRouter = Router();

openApiRouter.use(
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUIOptions)
);

module.exports = { openApiRouter };
