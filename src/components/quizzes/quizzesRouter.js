/**
 * @file Express router under '/quizzes'
 * @author Romuald THION
 */

const { Router } = require('express');
const createError = require('http-errors');
const { isInt } = require('validator');
const { logger } = require('../../config');
const QuizDAO = require('./QuizDAO');
const { authFromApiKeyHandler } = require('../../middlewares');
const questionsRouter = require('./questions/questionsRouter');

module.exports = function quizzesRouter(app) {
  async function getAllQuizzesHandler(req, res, next) {
    const page = req.query.page || 1;
    if (!isInt(`${page}`, { min: 1 })) {
      const err = new createError.BadRequest(
        `In query "?page=${page}", page must be greater or equal than 1`
      );
      return next(err);
    }
    try {
      const results = await QuizDAO.selectAll(page, app.locals.pageLimit);
      return res.send(results);
    } catch (err) {
      logger.debug(`getAllQuizzesHandler throw ${err}`);
      return next(err);
    }
  }

  function getOneQuizHandler(_req, res, _next) {
    return res.send(res.locals.quiz);
  }

  async function postQuizHandler(req, res, next) {
    try {
      const { title, description, open = false } = req.body;
      // authFromApiKeyHandler ensures that owner_id is defined
      const owner_id = res.locals.user.user_id;
      const quiz = { title, description, open, owner_id };
      if (!title)
        return next(
          createError.BadRequest(`Invalid content: title is missing`)
        );
      if (!description)
        return next(
          createError.BadRequest(`Invalid content: description is missing`)
        );
      const quizId = await QuizDAO.insert(quiz);
      logger.silly(
        `QuizDAO.postQuiz(${JSON.stringify(quiz)})=${JSON.stringify(quizId)}`
      );
      return res.status(201).send(quizId);
    } catch (err) {
      logger.debug(`postQuizHandler throw ${err}`);
      return next(err);
    }
  }

  async function putQuizHandler(req, res, next) {
    try {
      const { quiz } = res.locals;
      const { title, description, open } = req.body;
      Object.assign(quiz, { title, description, open });

      const updatedQuiz = await QuizDAO.update(quiz);
      logger.silly(`QuizDAO.putQuizHandler(${quiz})=${updatedQuiz}`);
      return res.send(updatedQuiz);
    } catch (err) {
      logger.debug(`putQuizHandler throw ${err}`);
      return next(err);
    }
  }

  async function delQuizHandler(req, res, next) {
    const { quiz_id } = res.locals.quiz;
    const { user_id } = res.locals.user;
    try {
      const deletedQuiz = await QuizDAO.del(quiz_id, user_id);
      logger.silly(`QuizDAO.delQuiz(${quiz_id}, ${user_id})=${deletedQuiz}`);
      res.send(deletedQuiz);
      return deletedQuiz;
    } catch (err) {
      logger.debug(`delQuizHandler throw ${err}`);
      return next(err);
    }
  }

  function checksQuizOwnership(_req, res, next) {
    const user = res.locals.user.user_id;
    const owner = res.locals.quiz.owner_id;
    logger.silly(`checkQuizIdExists@${user} VS ${owner}`);
    if (user !== owner)
      return next(
        createError.Unauthorized(
          `Quiz #${res.locals.quiz.quiz_id} is not owned by ${user} (owner is ${owner})`
        )
      );
    return next();
  }

  async function checksQuizByIdHandler(_req, res, next, quiz_id) {
    logger.silly(`checksQuizByIdHandler@${quiz_id}`);
    try {
      const quiz = await QuizDAO.selectById(quiz_id);
      if (!quiz)
        return next(createError.NotFound(`Quiz #${quiz_id} does not exist`));
      res.locals.quiz = quiz;
      return next();
    } catch (err) {
      logger.debug(`delQuizHandler throw ${err}`);
      return next(err);
    }
  }

  const router = Router();

  // when parameter :quiz_id is used, checks if it exists
  router.param('quiz_id', checksQuizByIdHandler);

  router.get('/', [getAllQuizzesHandler]);

  // curl -H "Accept:application/json" -H "X-API-KEY:944c5fdd-af88-47c3-a7d2-5ea3ae3147da" http://localhost:3000/quizzes/0
  router.get('/:quiz_id', [getOneQuizHandler]);

  // X-API-KEY
  // test.user   944c5fdd-af88-47c3-a7d2-5ea3ae3147da
  // other.user  64decee2-acca-4a86-8e60-a46c4ccbca97

  // curl -X POST "http://localhost:3000/quizzes/" -H  "accept: application/json" -H  "X-API-KEY: 944c5fdd-af88-47c3-a7d2-5ea3ae3147da" -H  "Content-Type: application/json" -d "{\"title\":\"QCM de test\",\"description\":\"Un QCM supplémentaire\",\"open\":false}"
  router.post('/', [authFromApiKeyHandler, postQuizHandler]);

  // curl -X PUT "http://localhost:3000/quizzes/3" -H  "accept: application/json" -H  "X-API-KEY: 944c5fdd-af88-47c3-a7d2-5ea3ae3147da" -H  "Content-Type: application/json" -d "{\"title\":\"QCM de test - màj \",\"description\":\"Un QCM supplémentaire - màj \"}"

  // curl -X PUT "http://localhost:3000/quizzes/3" -H  "accept: application/json" -H  "X-API-KEY: 64decee2-acca-4a86-8e60-a46c4ccbca97" -H  "Content-Type: application/json" -d "{\"title\":\"QCM de test - màj \",\"description\":\"Un QCM supplémentaire - màj \"}"
  router.put('/:quiz_id', [
    authFromApiKeyHandler,
    checksQuizOwnership,
    putQuizHandler,
  ]);

  // curl -X DELETE "http://localhost:3000/quizzes/3" -H  "accept: application/json" -H  "X-API-KEY: 64decee2-acca-4a86-8e60-a46c4ccbca97"
  // curl -X DELETE "http://localhost:3000/quizzes/3" -H  "accept: application/json" -H  "X-API-KEY: 944c5fdd-af88-47c3-a7d2-5ea3ae3147da"
  router.delete('/:quiz_id', [
    authFromApiKeyHandler,
    checksQuizOwnership,
    delQuizHandler,
  ]);

  router.use('/:quiz_id/questions', questionsRouter(app));

  return router;
};
