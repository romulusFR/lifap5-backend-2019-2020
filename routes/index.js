// all routers are exported from this file

const rootRouter = require('./rootRouter');
const { notFoundHandler, defaultErrorHandler } = require('./error');

module.exports.rootRouter = rootRouter;
module.exports.notFoundHandler = notFoundHandler;
module.exports.defaultErrorHandler = defaultErrorHandler;
