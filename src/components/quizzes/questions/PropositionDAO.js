/**
 * @file The proposition data access object (DAO)
 * @author Romuald THION
 */

const { logger, pool } = require('../../../config');

async function selectById(quiz_id, question_id, proposition_id) {
  logger.silly(
    `PropositionDAO.selectById@${quiz_id} ${question_id} ${proposition_id}`
  );

  const query =
    'SELECT * FROM proposition WHERE quiz_id = $1 AND question_id = $2 AND proposition_id = $3';
  const result = await pool.query(query, [
    quiz_id,
    question_id,
    proposition_id,
  ]);

  return result.rows[0];
}

async function upsert(user_id, quiz_id, question_id, proposition_id) {
  logger.silly(
    `PropositionDAO.upsert@${user_id} ${quiz_id} ${question_id} ${proposition_id}`
  );

  const query = `
  INSERT INTO answer(user_id, quiz_id, question_id, proposition_id)
  VALUES($1, $2, $3, $4)
  ON CONFLICT (quiz_id, question_id, user_id)
    DO UPDATE SET proposition_id = EXCLUDED.proposition_id, answered_at = DEFAULT
  RETURNING *;`;

  const result = await pool.query(query, [
    user_id,
    quiz_id,
    question_id,
    proposition_id,
  ]);

  return result.rows[0];
}

async function del(user_id, quiz_id, question_id) {
  logger.silly(`PropositionDAO.user_id@${user_id} ${quiz_id} ${question_id}`);

  const query = 'DELETE FROM answer WHERE user_id = $1 AND quiz_id = $2 AND question_id = $3 RETURNING *;';
  const result = await pool.query(query, [user_id, quiz_id, question_id]);

  return result.rows[0];
}

module.exports = { selectById, upsert, del };
