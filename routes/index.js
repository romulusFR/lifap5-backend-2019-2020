// all routers are exported from this file

const basicRouter = require('./basicRouter');
const { notFoundHandler, defaultErrorHandler } = require('./error');

module.exports.basicRouter = basicRouter;
module.exports.notFoundHandler = notFoundHandler;
module.exports.defaultErrorHandler = defaultErrorHandler;
