/**
 * @file The question data access object (DAO)
 * @author Romuald THION
 */

const createError = require('http-errors');
const { logger, pool } = require('../../../config');

async function selectAll(quiz_id) {
  logger.silly(`QuestionDAO.selectAll@`);

  const query = 'SELECT * FROM v_question_ext WHERE quiz_id = $1';
  const result = await pool.query(query, [quiz_id]);

  return result.rows;
}

async function selectById(quiz_id, question_id) {
  logger.silly(`QuestionDAO.selectById@${quiz_id} ${question_id}`);

  const query =
    'SELECT * FROM v_question_detailed WHERE quiz_id = $1 AND question_id = $2';
  const result = await pool.query(query, [quiz_id, question_id]);

  return result.rows[0];
}

async function insert(question) {
  logger.silly(`QuestionDAO.insert@${JSON.stringify(question)}`);

  const query = `
    INSERT INTO question(quiz_id, question_id, content)
    VALUES ($1, $2, $3)
    ON CONFLICT (quiz_id, question_id) DO NOTHING
    RETURNING quiz_id, question_id;`;

  const { quiz_id, question_id, content } = question;
  const args = [quiz_id, question_id, content];
  const result = await pool.query(query, args);

  if (result.rowCount) return result.rows[0];
  throw createError.Conflict(
    `Invalid content: question "${question_id}" already exists for quizz ${quiz_id} (no INSERT)`
  );
}

async function del(quiz_id, question_id) {
  logger.silly(`QuestionDAO.del@${JSON.stringify(quiz_id)}, ${question_id}`);

  const query = `
    DELETE FROM question
    WHERE quiz_id = $1 AND question_id = $2
    RETURNING quiz_id, question_id;`;
  const result = await pool.query(query, [quiz_id, question_id]);

  if (result.rowCount) return result.rows[0];
  throw createError.NotFound(`Cannot DELETE question ${question_id} of quiz #${quiz_id}`);
}

module.exports = { selectAll, selectById, insert, del };
