/**
 * @file Express router under '/users'
 * @author Romuald THION
 */

const { Router } = require('express');
const { logger } = require('../utils');
const { QuizDAO } = require('../models');
// const { negotiateContentHandler } = require('./genericHandlers');

const quizRouter = Router();

async function getAllQuizzesHandler(_req, res, next) {
  try {
    const results = await QuizDAO.getAllQuizzes();
    return res.send(results);
  } catch (err) {
    logger.debug(`getAllQuizzesHandler throw ${err}`);
    // logger.error(err.stack);
    return next(err);
  }
}

quizRouter.get('/', [getAllQuizzesHandler]);

module.exports = { quizRouter };
