/**
 * @file Express router under 'quizzes/:quizz_id/questions'
 * @author Romuald THION
 */

const { Router } = require('express');
const createError = require('http-errors');
const { logger } = require('../../../config');
const QuestionDAO = require('./QuestionDAO');


module.exports = function questionsRouter(_app) {
  const router = Router();

  async function getAllQuestionsHandler(req, res, next) {
    logger.silly(`getAllQuestionsHandler@${res.locals.quiz.quiz_id}`);
    try {
      const results = await QuestionDAO.selectAll(res.locals.quiz.quiz_id);
      return res.send(results);
    } catch (err) {
      logger.debug(`getAllQuestionsHandler throw ${err}`);
      return next(err);
    }
  }

  function getOneQuestionHandler(_req, res, _next) {
    return res.send(res.locals.question);
  }

  async function checksQuestionByIdHandler(_req, res, next, question_id) {
    logger.silly(`checksQuestionByIdHandler@${question_id}`);
    const {quiz_id} = res.locals.quiz;
    try {
      const question = await QuestionDAO.selectById(quiz_id, question_id);
      if (!question)
        return next(
          createError.NotFound(
            `Question #${question_id} for quiz ${quiz_id} does not exist`
          )
        );
      res.locals.question = question;
      return next();
    } catch (err) {
      logger.debug(`checksQuestionByIdHandler throw ${err}`);
      return next(err);
    }
  }

  // when parameter :question_id is used, checks if it exists
  router.param('question_id', checksQuestionByIdHandler);

  // 
  router.get('/', [getAllQuestionsHandler]);

  router.get('/:question_id', [getOneQuestionHandler]);

  return router;
};
