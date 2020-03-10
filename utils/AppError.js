// https://javascript.info/custom-errors
// https://nodejs.org/api/errors.html
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
// https://expressjs.com/en/guide/error-handling.html
// https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/useonlythebuiltinerror.md

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

module.exports = { AppError };
