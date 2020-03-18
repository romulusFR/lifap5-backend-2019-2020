const createError = require('http-errors');
const { logger } = require('../../config');

function checksQuizOwnership(_req, res, next) {
  const user = res.locals.user.user_id;
  const owner = res.locals.quiz.owner_id;
  logger.silly(`checksQuizOwnership@${user} VS ${owner}`);
  if (user !== owner) {
    const msg = `Quiz #${res.locals.quiz.quiz_id} is not owned by ${user} (owner is ${owner})`;
    return next(createError.Forbidden(msg));
  }
  return next();
}

module.exports = { checksQuizOwnership };
