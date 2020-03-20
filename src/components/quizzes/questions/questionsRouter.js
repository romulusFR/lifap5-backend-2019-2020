/**
 * @file Express router under 'quizzes/:quizz_id/questions'
 * @author Romuald THION
 */

const { Router } = require('express');
const createError = require('http-errors');
const { logger } = require('../../../config');
const { authFromApiKeyHandler } = require('../../../middlewares');
const { checksQuizOwnership } = require('../quizzesMiddlewares');
const QuestionDAO = require('./QuestionDAO');
const PropositionDAO = require('./PropositionDAO');

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
    if (Number.isNaN(parseInt(question_id, 10)))
    return next(
      createError.BadRequest(`Invalid content:' ${question_id}' is not an integer`)
    );
    const { quiz_id } = res.locals.quiz;
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


  async function checksPropositionByIdHandler(_req, res, next, proposition_id) {
    logger.silly(`checksPropositionByIdHandler@${proposition_id}`);
    const { question_id } = res.locals.question;
    if (Number.isNaN(parseInt(proposition_id, 10)))
    return next(
      createError.BadRequest(`Invalid content: '${proposition_id}' is not an integer`)
    );
    const { quiz_id } = res.locals.quiz;
    try {
      const proposition = await PropositionDAO.selectById(quiz_id, question_id, proposition_id);
      if (!proposition)
        return next(
          createError.NotFound(
            `Proposition #${proposition_id} of question #${question_id} for quiz ${quiz_id} does not exist`
          )
        );
      res.locals.proposition = proposition;
      return next();
    } catch (err) {
      logger.debug(`checksPropositionByIdHandler throw ${err}`);
      return next(err);
    }
  }

  function validateQuestion (req, _res, next) {
    const { sentence, propositions } = req.body;
    if (!sentence)
      return next(
        createError.BadRequest(`Invalid content: sentence is missing`)
      );
    if (!Array.isArray(propositions))
      return next(
        createError.BadRequest(`Invalid content: propositions is not an array`)
      );
    
    // @todo : checks details of propositions
    return next();
  }

  async function postQuestionHandler(req, res, next) {
    try {
      const { question_id, sentence, propositions } = req.body;
      const { quiz_id } = res.locals.quiz;
      const question = { quiz_id, question_id, sentence, propositions };
      const questionId = await QuestionDAO.insert(question);
      logger.silly(`postQuestionHandler@${JSON.stringify(questionId)}`);
      return res.status(201).send(questionId);
    } catch (err) {
      logger.debug(`postQuestionHandler throw ${err}`);
      return next(err);
    }
  }

  async function putQuestionHandler(req, res, next) {
    const { quiz_id } = res.locals.quiz;
    const { question_id } = res.locals.question;
    try {

      const { sentence, propositions } = req.body;
      const question = { quiz_id, question_id, sentence, propositions };
      const questionId = await QuestionDAO.update(question);
      logger.silly(`putQuestionHandler@${JSON.stringify(questionId)}`);
      return res.status(201).send(questionId);
    } catch (err) {
      logger.debug(`putQuestionHandler throw ${err}`);
      return next(err);
    }
  }

  async function delQuestionHandler(req, res, next) {
    const { quiz_id } = res.locals.quiz;
    const { question_id } = res.locals.question;
    try {
      const deletedQuiz = await QuestionDAO.del(quiz_id, question_id);
      logger.silly(`delQuestionHandler@${deletedQuiz}`);
      return res.status(200).send(deletedQuiz);

    } catch (err) {
      logger.debug(`delQuestionHandler throw ${err}`);
      return next(err);
    }
  }


  async function postAnswerHandler(req, res, next) {
    const { user_id } = res.locals.user;
    const { quiz_id } = res.locals.quiz;
    const { question_id } = res.locals.question;
    const { proposition_id } = res.locals.proposition;
    try {
      const answer = await PropositionDAO.upsert(user_id, quiz_id, question_id, proposition_id);
      logger.silly(`postAnswerHandler@${answer}`);
      return res.status(201).send(answer);

    } catch (err) {
      logger.debug(`postAnswerHandler throw ${err}`);
      return next(err);
    }
  }

  async function deleteAnswerHandler(req, res, next) {
    const { user_id } = res.locals.user;
    const { quiz_id } = res.locals.quiz;
    const { question_id } = res.locals.question;
    try {
      const answer = await PropositionDAO.del(user_id, quiz_id, question_id);
      logger.silly(`deleteAnswerHandler@${answer}`);
      return res.status(201).send(answer);

    } catch (err) {
      logger.debug(`deleteAnswerHandler throw ${err}`);
      return next(err);
    }
  }

  // when parameter :question_id is used, checks if it exists
  router.param('question_id', checksQuestionByIdHandler);

  // when parameter :proposition_id is used, checks if it exists
  router.param('proposition_id', checksPropositionByIdHandler);


  // root : all questions
  router.get('/', [getAllQuestionsHandler]);

  router.get('/:question_id', [
    authFromApiKeyHandler,
    checksQuizOwnership,
    getOneQuestionHandler,
  ]);

  // curl -X POST "http://localhost:3000/quizzes/" -H  "accept: application/json" -H  "X-API-KEY: 944c5fdd-af88-47c3-a7d2-5ea3ae3147da" -H  "Content-Type: application/json" -d "{\"title\":\"QCM de test\",\"description\":\"Un QCM supplémentaire\",\"open\":false}"
  // curl -X POST "http://localhost:3000/quizzes/36/questions" -H  "accept: application/json" -H  "X-API-KEY: 944c5fdd-af88-47c3-a7d2-5ea3ae3147da" -H  "Content-Type: application/json" -d "{\"question_id\":42,\"content\":\"Qui a pissé sur le chien ?\"}"
  router.post('/', [
    authFromApiKeyHandler,
    checksQuizOwnership,
    validateQuestion,
    postQuestionHandler,
  ]);

  router.put('/:question_id', [
    authFromApiKeyHandler,
    checksQuizOwnership,
    validateQuestion,
    putQuestionHandler,
  ]);

  // curl -X DELETE "http://localhost:3000/quizzes/36/questions/42" -H  "accept: application/json" -H  "X-API-KEY: 944c5fdd-af88-47c3-a7d2-5ea3ae3147da" -H  "Content-Type: application/json"
  router.delete('/:question_id', [
    authFromApiKeyHandler,
    checksQuizOwnership,
    delQuestionHandler,
  ]);


  // curl -X POST "http://localhost:3000/quizzes/0/questions/0/answer/0" -H  "accept: application/json" -H  "X-API-KEY: 944c5fdd-af88-47c3-a7d2-5ea3ae3147da" -H  "Content-Type: application/json"
  router.post('/:question_id/answer/:proposition_id/', [
    authFromApiKeyHandler,
    postAnswerHandler,
  ]);

  router.delete('/:question_id/answer/', [
    authFromApiKeyHandler,
    deleteAnswerHandler,
  ]);

  return router;
};
