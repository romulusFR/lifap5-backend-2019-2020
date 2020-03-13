/**
 * @file The quiz data access object (DAO)
 * @author Romuald THION
 */

const { logger } = require('../utils');
const pool = require('./pool');

/**
 * @class QuizDAO
 */
class QuizDAO {
  // the list of all quizzes. The queried views contains extra information
  static async getAllQuizzes() {
    logger.silly(`getAllQuizzes@`);
    const result = await pool.query('SELECT * FROM v_quiz_detailed;');
    return result.rows;
  }
}

module.exports = QuizDAO;
