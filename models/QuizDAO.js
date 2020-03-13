/**
 * @file The quiz data access object (DAO)
 * @author Romuald THION
 */

const { logger } = require('../utils');
const pool = require('./pool');

const getAllQuizzesQuery = `
SELECT quiz.*,
       count(question_id)::integer as questions_number,
       COALESCE(SUM(weight)::integer,0) as total_weight,
       COALESCE(NULLIF(array_agg(question_id), '{NULL}'), '{}')::integer[] as questions_ids
FROM quiz LEFT OUTER JOIN question
  USING (quiz_id)
GROUP BY quiz.quiz_id;
`;

/**
 * @class QuizDAO
 * @todo Checks if it is a User model or not...
 */
class QuizDAO {
  // the list of all users
  static async getAllQuizzes() {
    logger.silly(`getAllQuizzes@`);
    logger.debug(getAllQuizzesQuery);
    const result = await pool.query(getAllQuizzesQuery);
    return result.rows;
  }
}

module.exports = QuizDAO;
