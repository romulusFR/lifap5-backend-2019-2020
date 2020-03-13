/**
 * @file The quiz data access object (DAO)
 * @author Romuald THION
 */

const createError = require('http-errors');
const { logger } = require('../utils');
const pool = require('./pool');

const postQuizQuery = `
INSERT INTO quiz(title, description, owner_id, open)
VALUES ($1, $2, $3, $4)
ON CONFLICT (title) DO NOTHING
RETURNING quiz_id;
`;

// generatePutQuizQuery({quiz_id : 2, owner_id : 'test.user', open:false});

function generatePutQuizQuery(quiz) {
  if (!quiz.quiz_id)
    throw createError.BadRequest(`Invalid content: quiz_id is missing`);
  if(!quiz.owner_id)
    throw createError.BadRequest(`Invalid content: owner_id is missing`);

  // keep keys which are updatable and which are defined
  const updatableAttributes = ['title', 'description', 'open'];
  const keys = Object.keys(quiz).filter(
    (key) => updatableAttributes.includes(key) && quiz[`${key}`] !== undefined
  );
  if (keys.length === 0)
    throw createError.BadRequest(`Invalid content: nothing to update`);

  // generate SET attr = $val clauses
  const templateText = keys.map((key, idx) => `SET ${key} = $${idx}`);
  // whole query with placeholders
  const text = `
  UPDATE quiz
  ${templateText.join(', ')}
  WHERE quiz_id = $${keys.length} AND owner_id = $${keys.length + 1}
  RETURNING *;
  `;

  // values for placeholders in order
  const values = keys.map((key) => quiz[`${key}`]).concat([quiz.quiz_id, quiz.owner_id]);
  return { text, values };
}

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

  static async postQuiz(quiz) {
    logger.silly(`postQuiz@${JSON.stringify(quiz)}`);
    const { title, description, owner, open = false } = quiz;
    const result = await pool.query(postQuizQuery, [
      title,
      description,
      owner,
      open,
    ]);
    if (result.rowCount) return result.rows[0].quiz_id;
    throw createError.BadRequest(`Invalid content: title "${quiz.title}" probably already exists (no insertion)`);
  }

  static async putQuiz(quiz) {
    logger.silly(`putQuiz@${JSON.stringify(quiz)}`);
    const result = await pool.query(generatePutQuizQuery(quiz));
    if (result.rowCount) return result.rows[0];
    throw createError.BadRequest(`Invalid content ${JSON.stringify(quiz)}`);
  }


}

module.exports = QuizDAO;
