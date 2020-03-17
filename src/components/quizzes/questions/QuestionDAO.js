/**
 * @file The question data access object (DAO)
 * @author Romuald THION
 */

const { logger, pool } = require('../../../config');

async function selectAll(quiz_id) {
  logger.silly(`selectAll@`);

  const query = 'SELECT * FROM v_question_ext WHERE quiz_id = $1';
  const result = await pool.query(query, [quiz_id]);

  return result.rows;
}

async function selectById(quiz_id, question_id) {
  logger.silly(`selectById@${quiz_id} ${question_id}`);

  const query =
    'SELECT * FROM v_question_detailed WHERE quiz_id = $1 AND question_id = $2';
  const result = await pool.query(query, [quiz_id, question_id]);

  return result.rows[0];
}

module.exports = { selectAll, selectById }; //  insert, update, del
