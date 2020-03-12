const { config } = require('./utils');

module.exports = {
  openapi: '3.0.2',
  info: {
    title: config.appname,
    version: config.version,
    description: config.description,
  },
  servers: [
    {
      url: 'https://lifap5.univ-lyon1.fr',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  basePath: '/',
};
