// all routers are exported from this file

const { notFoundHandler, defaultErrorHandler, negotiateContentHandler } = require('./genericHandlers');
const { rootRouter } = require('./rootRouter');
const { userRouter } = require('./userRouter');


module.exports = {
  notFoundHandler,
  defaultErrorHandler,
  negotiateContentHandler,
  rootRouter,
  userRouter,
};
