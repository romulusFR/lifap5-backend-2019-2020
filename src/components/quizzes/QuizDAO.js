/**
 * @file The quiz data access object (DAO)
 * @author Romuald THION
 */

const createError = require('http-errors');
const { logger, pool } = require('../../config');

const postQuizQuery = `
INSERT INTO quiz(title, description, owner_id, open)
VALUES ($1, $2, $3, $4)
ON CONFLICT (title) DO NOTHING
RETURNING quiz_id;
`;

const generatePutQuizQuery = `
UPDATE quiz SET
  title = $1,
  description = $2,
  open = $3
WHERE quiz_id = $4 AND owner_id = $5
RETURNING *;
`;

/**
 *
 * @todo : the OFFSET/FETCH method sucks, see
 *         https://www.citusdata.com/blog/2016/03/30/five-ways-to-paginate/
 * @param {*} page
 * @param {*} pageLimit
 */
const selectAllQuizzesQuery = (page, pageLimit) => `
SELECT *
FROM v_quiz_detailed
ORDER BY quiz_id
OFFSET ${(page - 1) * pageLimit} ROWS
FETCH FIRST ${pageLimit} ROWS ONLY;
`;



/**
 * @class QuizDAO
 */
class QuizDAO {
  // the list of all quizzes. The queried views contains extra information
  static async getAllQuizzes(page, pageLimit) {
    logger.silly(`getAllQuizzes@`);
    const result = await pool.query(selectAllQuizzesQuery(page, pageLimit));
    return result.rows;
  }

  static async getQuizById(quiz_id) {
    logger.silly(`getQuizById@${quiz_id}`);
    const query = 'SELECT * FROM v_quiz_detailed WHERE quiz_id = $1';
    const result = await pool.query(query, [quiz_id]);
    return result.rows[0];
  }

  static async postQuiz(quiz) {
    logger.silly(`postQuiz@${JSON.stringify(quiz)}`);
    const { title, description, owner_id, open = false } = quiz;
    const result = await pool.query(postQuizQuery, [
      title,
      description,
      owner_id,
      open,
    ]);
    if (result.rowCount) return result.rows[0];
    throw createError.BadRequest(
      `Invalid content: title "${quiz.title}" probably already exists (no INSERT)`
    );
  }

  static async putQuiz(quiz) {
    logger.silly(`putQuiz@${JSON.stringify(quiz)}`);
    const args = [quiz.title, quiz.description, quiz.open, quiz.quiz_id, quiz.owner_id];
    // logger.silly(`putQuiz@${query.text}`);
    // logger.silly(`putQuiz@${query.values}`);
    const result = await pool.query(generatePutQuizQuery, args);
    
    if (result.rowCount) return result.rows[0];
    throw createError.NotFound(`Cannot UPDATE quiz #${quiz.quiz_id}`);
  }

  static async delQuiz(quiz_id, user_id) {
    logger.silly(`delQuiz@${JSON.stringify(quiz_id)}, ${user_id}`);
    const result = await pool.query(
      'DELETE FROM quiz WHERE quiz_id = $1 AND owner_id = $2 RETURNING quiz_id;',
      [quiz_id, user_id]
    );

    if (result.rowCount) return result.rows[0];
    throw createError.NotFound(`Cannot DELETE quiz #${quiz_id}`);
  }
}

module.exports = { QuizDAO };
