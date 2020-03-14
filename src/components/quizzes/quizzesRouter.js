/**
 * @file Express router under '/users'
 * @author Romuald THION
 */

const { Router } = require('express');
const createError = require('http-errors');
const { logger } = require('../../config');
const { QuizDAO } = require('./QuizDAO');
const { authFromApiKeyHandler } = require('../../middlewares');

module.exports = function quizzesRouter(_app) {
  const router = Router();

  async function getAllQuizzesHandler(_req, res, next) {
    try {
      const results = await QuizDAO.getAllQuizzes();
      return res.send(results);
    } catch (err) {
      logger.debug(`getAllQuizzesHandler throw ${err}`);
      return next(err);
    }
  }

  async function postQuizHandler(req, res, next) {
    try {
      const { title, description, open } = req.body;
      const quiz = {
        title,
        description,
        open,
        owner_id: res.locals.user.user_id,
      };
      if (!title)
        return next(
          createError.BadRequest(`Invalid content: title is missing`)
        );
      if (!description)
        return next(
          createError.BadRequest(`Invalid content: description is missing`)
        );
      const quizId = await QuizDAO.postQuiz(quiz);
      logger.silly(
        `QuizDAO.postQuiz(${JSON.stringify(quiz)})=${JSON.stringify(quizId)}`
      );
      res.send(quizId);
      return quizId;
    } catch (err) {
      logger.debug(`postQuizHandler throw ${err}`);
      // logger.error(err.stack);
      return next(err);
    }
  }

  async function putQuizHandler(req, res, next) {
    try {
      const { title, description, open } = req.body;
      const quiz = {
        quiz_id: req.params.quiz_id,
        owner_id: res.locals.user.user_id,
        title,
        description,
        open,
      };
      const updatedQuiz = await QuizDAO.putQuiz(quiz);
      logger.silly(`QuizDAO.putQuizHandler(${quiz})=${updatedQuiz}`);
      res.send(updatedQuiz);
      return updatedQuiz;
    } catch (err) {
      logger.debug(`putQuizHandler throw ${err}`);
      // logger.error(err.stack);
      return next(err);
    }
  }

  async function delQuizHandler(req, res, next) {
    try {
      const deletedQuiz = await QuizDAO.delQuiz(
        req.params.quiz_id,
        res.locals.user.user_id
      );
      logger.silly(
        `QuizDAO.delQuiz(${req.params.quiz_id}, ${res.locals.user.user_id})=${deletedQuiz}`
      );
      res.send(deletedQuiz);
      return deletedQuiz;
    } catch (err) {
      logger.debug(`delQuizHandler throw ${err}`);
      // logger.error(err.stack);
      return next(err);
    }
  }

  /**
   *  @todo implements
   */
  function checksQuizOwnership(_req, res, next) {
    const user = res.locals.user.user_id;
    const owner = res.locals.quiz.owner_id
    logger.silly(`checkQuizIdExists@${user} VS ${owner}`);
    if (user !== owner)
      return next(createError.Unauthorized(`Quiz #${res.locals.quiz.quiz_id} is not owned by ${user} (owner is ${owner})`));
    return next();
  }

  /**
   *  @todo implements
   */
  async function checksQuizByIdHandler(_req, res, next, quiz_id) {
    logger.silly(`checksQuizByIdHandler@${quiz_id}`);
    try {
    const quiz = await QuizDAO.getQuizById(quiz_id);
    if(!quiz)
      return next(createError.NotFound(`Quiz #${quiz_id} does not exist`));
    res.locals.quiz = quiz;
    return next();
    } catch (err) {
      logger.debug(`delQuizHandler throw ${err}`);
      // logger.error(err.stack);
      return next(err);
    }
  }

  // when parameter :quiz_id is used, checks if it exists
  router.param('quiz_id', checksQuizByIdHandler);

  router.get('/', [getAllQuizzesHandler]);
  // curl -X POST -H  "Content-Type: application/json" -H "Accept:application/json" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da"

  router.post('/', [authFromApiKeyHandler, postQuizHandler]);

  router.get('/:quiz_id', [(_req, res, _next) => res.send(res.locals.quiz)]);

  // curl -X PUT -H  "Content-Type: application/json" -H "Accept:application/json" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da"
  router.put('/:quiz_id', [
    authFromApiKeyHandler,
    checksQuizOwnership,
    putQuizHandler,
  ]);

  router.delete('/:quiz_id', [
    authFromApiKeyHandler,
    checksQuizOwnership,
    delQuizHandler,
  ]);

  return router;
};
