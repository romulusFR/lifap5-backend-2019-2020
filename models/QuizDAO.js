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
  if (!quiz.owner_id)
    throw createError.BadRequest(`Invalid content: owner_id is missing`);

  // keep keys which are updatable and which are defined
  const updatableAttributes = ['title', 'description', 'open'];
  const keys = Object.keys(quiz).filter(
    (key) => updatableAttributes.includes(key) && quiz[`${key}`] !== undefined
  );
  if (keys.length === 0)
    throw createError.BadRequest(`Invalid content: nothing to update`);

  // generate SET attr = $val clauses
  const templateText = keys.map((key, idx) => `${key} = $${idx + 1}`);
  // whole query with placeholders
  const text = `
  UPDATE quiz SET
  ${templateText.join(', ')}
  WHERE quiz_id = $${keys.length + 1} AND owner_id = $${keys.length + 2}
  RETURNING *;
  `;

  // values for placeholders in order
  const values = keys
    .map((key) => quiz[`${key}`])
    .concat([quiz.quiz_id, quiz.owner_id]);
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
    const query = generatePutQuizQuery(quiz);
    logger.silly(`putQuiz@${query.text}`);
    logger.silly(`putQuiz@${query.values}`);
    const result = await pool.query(query);
    if (result.rowCount) return result.rows[0];
    throw createError.Unauthorized(`User ${JSON.stringify(quiz.owner_id)} cannot UPDATE quiz #${quiz.quiz_id}`);
  }

  static async delQuiz(quiz_id, owner_id) {
    logger.silly(`delQuiz@${JSON.stringify(quiz_id)}, ${owner_id}`);
    const result = await pool.query('DELETE FROM quiz WHERE quiz_id = $1 AND owner_id = $2;', [quiz_id, owner_id]);
    if (result.rowCount) return result.rows[0];
    throw createError.Unauthorized(`User ${JSON.stringify(owner_id)} cannot DELETE quiz #${quiz_id}`);
  }
}

module.exports = QuizDAO;
