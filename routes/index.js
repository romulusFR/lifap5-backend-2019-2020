/**
 * @file All handlers and routers are exported from this file
 * @author Romuald THION
 */

const {
  notFoundHandler,
  defaultErrorHandler,
  negotiateContentHandler,
} = require('./genericHandlers');

const { openApiRouter } = require('./openApiRouter');
const { rootRouter } = require('./rootRouter');
const { userRouter } = require('./userRouter');
const { quizRouter } = require('./quizRouter');


module.exports = {
  notFoundHandler,
  defaultErrorHandler,
  negotiateContentHandler,
  openApiRouter,
  rootRouter,
  userRouter,
  quizRouter,
};
