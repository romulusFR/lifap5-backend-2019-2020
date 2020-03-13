/**
 * @file All handlers and routers are exported from this file
 * @author Romuald THION
 */

const {
  notFoundHandler,
  defaultErrorHandler,
  negotiateContentHandler,
} = require('./genericHandlers');
const { rootRouter } = require('./rootRouter');
const { userRouter } = require('./userRouter');
const { openApiRouter } = require('./openApiRouter');

module.exports = {
  notFoundHandler,
  defaultErrorHandler,
  negotiateContentHandler,
  rootRouter,
  userRouter,
  openApiRouter,
};
