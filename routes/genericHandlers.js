const createError = require('http-errors');
const { logger, config } = require('../utils');

// content negotiation
// http://expressjs.com/en/api.html#res.format
// http://expressjs.com/en/api.html#res.render
// http://expressjs.com/en/guide/using-template-engines.html
// https://github.com/expressjs/express/blob/master/lib/response.js#L659

// curl -I -H'Accept: application/json' http://localhost:3000/doesnotexists/
// curl -I -H'Accept: application/json' http://localhost:3000/error/
// curl -I -H'Accept: text/*' http://localhost:3000/doesnotexists/
// curl -I -H'Accept: text/*' http://localhost:3000/error/
function negotiateContentHandler(htmlOpts, jsonOpts) {
  const { view, args } = htmlOpts;
  return (_req, res, _next) => {
    res.format({
      html() {
        res.render(view, args);
      },

      json() {
        res.send(jsonOpts);
      },
    });
  };
}

function notFoundHandler(req, res, next) {
  const msg = `notFoundHandler@${req.method} ${req.url} - ${req.ip}`;
  logger.debug(msg);
  next(createError.NotFound(`URL '${req.url}' not found`));
}

function defaultErrorHandler(err, req, res, _next) {
  // should NOT happen
  // if (res.headersSent) {
  //   next(err);
  // }

  const { name, message, status = 500 } = err;
  const stack = config.env === 'development' ? err.stack : undefined;

  res.status(status);
  res.format({
    html() {
      res.render('error', { stack, name, message, status });
    },

    json() {
      res.send({
        appname: res.locals.appname,
        version: res.locals.version,
        name,
        message,
        status,
      });
    },

    default() {
      res.render('error', { stack, name, message, status });
    },
  });

  const msg = `defaultErrorHandler@${status} - ${req.method} ${req.url} - ${req.ip} : ${name} - ${message}`;
  if (status >= 500) {
    logger.error(msg);
  } else {
    logger.info(msg);
  }
}

module.exports = {
  notFoundHandler,
  defaultErrorHandler,
  negotiateContentHandler,
};
