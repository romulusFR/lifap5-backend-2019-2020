// all routers are exported from this file

const { notFoundHandler, defaultErrorHandler } = require('./errorHandler');
const { rootRouter } = require('./rootRouter');
const { userRouter } = require('./userRouter');

module.exports = {
  notFoundHandler,
  defaultErrorHandler,
  rootRouter,
  userRouter,
};
