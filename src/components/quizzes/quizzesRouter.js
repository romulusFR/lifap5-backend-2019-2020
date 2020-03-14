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

  router.get('/', [getAllQuizzesHandler]);
  // curl -X POST -H  "Content-Type: application/json" -H "Accept:application/json" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da"
  router.post('/', [authFromApiKeyHandler, postQuizHandler]);
  // curl -X PUT -H  "Content-Type: application/json" -H "Accept:application/json" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da"
  router.put('/:quiz_id', [authFromApiKeyHandler, putQuizHandler]);

  router.delete('/:quiz_id', [authFromApiKeyHandler, delQuizHandler]);

  return router;
};
