/**
 * @file Express router under 'quizzes/:quizz_id/questions'
 * @author Romuald THION
 */

const { Router } = require('express');
const createError = require('http-errors');
const { QuestionDAO } = require('./QuestionDAO');
const { logger } = require('../../../config');

module.exports = function questionsRouter(_app) {
  const router = Router();

  async function getAllQuestionsHandler(req, res, next) {
    try {
      const results = await QuestionDAO.getAllQuestions(res.locals.quiz_id);
      return res.send(results);
    } catch (err) {
      logger.debug(`getAllQuestionsHandler throw ${err}`);
      return next(err);
    }
  }


  async function checksQuestionByIdHandler(_req, res, next, question_id) {
    logger.silly(`checksQuestionByIdHandler@${question_id}`);
    try {
      const question = await QuestionDAO.getQuestionById(question_id);
      if (!question)
        return next(
          createError.NotFound(
            `Question #${question_id} for quiz ${res.locals.quiz.quiz_id} does not exist`
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

  router.get('/:question_id', [checksQuestionByIdHandler]);

  return router;
};
