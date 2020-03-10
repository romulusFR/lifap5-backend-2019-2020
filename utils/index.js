
// common utils and environment variables exported once

const {
  name, version, env, httpPort,
} = require('./config');
const { logger, morgan } = require('./logger');

module.exports.name = name;
module.exports.version = version;
module.exports.env = env;
module.exports.httpPort = httpPort;

module.exports.logger = logger;
module.exports.morgan = morgan;
