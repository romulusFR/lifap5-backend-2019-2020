/**
 * @file Express router under '/'
 * @author Romuald THION
 */

const { Router } = require('express');
const createError = require('http-errors');
const { logger, config, pool } = require('../../config');
const { negotiateContentHandler } = require('../../middlewares');

module.exports = function indexRouter(app) {
  const indexHandler = negotiateContentHandler(
    {
      htmlView: 'index',
      htmlArgs: (_req, _res) => ({ description: config.description }),
    },
    {
      jsonArgs: (_req, _res) => ({
        appname: app.locals.appname,
        version: app.locals.version,
        description: app.locals.description,
      }),
    }
  );

  function notImplementedHandler(_req, _res, next) {
    next(new createError.NotImplemented('Not implemented yet'));
  }

  function echoHandler(req, res, _next) {
    logger.debug(`echoHandler(${req.body})`);
    return res.send(req.body);
  }

  async function searchHandler(req, res, next) {
    const q = req.query.q || '';
    if (q === '') {
      const err = new createError.BadRequest(
        `Query parameter "?q=${q}", page must specified`
      );
      return next(err);
    }
    logger.silly(`searchHandler@"${q}"`);

    const query = `
    WITH q AS (
      SELECT websearch_to_tsquery('french', $1) AS fts_query
    )
    
    SELECT type, 
           quiz_id,
           question_id,
           proposition_id,
           ts_rank(searchable_text, q.fts_query) AS rank
    FROM v_fts, q 
    WHERE  searchable_text @@ q.fts_query
    ORDER BY rank desc, quiz_id, question_id, proposition_id;`;

    try {
      const result = await pool.query(query, [q]);
      return res.send(result.rows);
    } catch (err) {
      logger.debug(`searchHandler throw ${err}`);
      return next(err);
    }
  }

  const router = Router();

  //
  // curl -H "Accept: application/json" http://localhost:3000/
  router.get('/', indexHandler);

  // basic echo service : simply returns the json body
  // curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost:3000/echo/
  router.post('/echo', echoHandler);

  // a router that always returns an error
  // curl -H "Accept: application/json"  http://localhost:3000/not-implemented/
  router.get('/not-implemented', notImplementedHandler);

  router.get('/search', searchHandler);

  return router;
};
