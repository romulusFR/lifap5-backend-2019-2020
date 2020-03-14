/**
 * @file All handlers and routers are exported from this file
 * @author Romuald THION
 */

const { apiDocsRouter } = require('./api-docs/apiDocsRouter');
const { indexRouter } = require('./index/indexRouter');
const { usersRouter } = require('./users/usersRouter');
const { quizzesRouter } = require('./quizzes/quizzesRouter');

module.exports = {
  apiDocsRouter,
  indexRouter,
  quizzesRouter,
  usersRouter,
};
