/**
 * @file Generic handlers to be used directly by the express app in app.js using app.use()
 * @author Romuald THION
 */

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

/**
 * An high order function that generates a middlware for content negotiation using res.format
 * @function
 * @param {Object} htmlOpts - options for html rendering via res.redner
 * @param {string} htmlOpts.htmlView - the view to render
 * @param {function(req, res): Object} htmlOpts.htmlArgs - function that generates the paramaters object to be fed into the renderer
 * @param {Object} jsonOpts - options for json rendering via res.send
 * @param {function(req, res): Object} jsonOpts.jsonArgs - function that generates the paramaters to be sent
 * @returns {function(req, res, next): undefined} - the middleware function
 */
function negotiateContentHandler(htmlOpts, jsonOpts) {
  const { htmlView, htmlArgs } = htmlOpts;
  const { jsonArgs } = jsonOpts;
  return (req, res, next) => {
    res.format({
      html() {
        res.render(htmlView, htmlArgs(req, res));
      },

      json() {
        res.send(jsonArgs(req, res));
      },

      default() {
        const err = new createError.NotAcceptable(
          `Header "Accept: ${req.get('Accept')}" is not acceptable`
        );
        next(err);
      },
    });
  };
}

function notFoundHandler(req, res, next) {
  const msg = `notFoundHandler@${req.method} ${req.url} - ${req.ip}`;
  logger.debug(msg);
  next(createError.NotFound(`URL '${req.url}' not found`));
}

function defaultErrorHandler(err, req, res, next) {
  // this should NOT happen
  if (res.headersSent) {
    logger.error(
      `defaultErrorHandler@has to call next(err) because res.headersSent=${res.headersSent}`
    );
    next(err);
  }

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
