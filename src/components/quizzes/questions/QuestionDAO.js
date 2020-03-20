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
    'SELECT * FROM v_question_ext WHERE quiz_id = $1 AND question_id = $2';
  const result = await pool.query(query, [quiz_id, question_id]);

  return result.rows[0];
}

async function selectByIdAnswers(quiz_id, question_id) {
  logger.silly(`QuestionDAO.selectByIdAnswers@${quiz_id} ${question_id}`);

  const query =
    'SELECT * FROM v_question_detailed WHERE quiz_id = $1 AND question_id = $2';
  const result = await pool.query(query, [quiz_id, question_id]);

  return result.rows[0];
}

async function insert(question) {
  logger.silly(`QuestionDAO.insert@${JSON.stringify(question)}`);

  const questionQuery = `
    INSERT INTO question(quiz_id, question_id, sentence)
    VALUES ($1, $2, $3)
    ON CONFLICT (quiz_id, question_id) DO NOTHING
    RETURNING quiz_id, question_id;`;

  const propositionQuery = `
    INSERT INTO proposition(quiz_id, question_id, proposition_id, content, correct)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (quiz_id, question_id, proposition_id) DO NOTHING
    RETURNING quiz_id, question_id, proposition_id;`;

  const { quiz_id, question_id, sentence, propositions } = question;
  const questionArgs = [quiz_id, question_id, sentence];

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const questionResult = await pool.query(questionQuery, questionArgs);
    logger.silly(`QuestionDAO.insert@${JSON.stringify(questionResult.rows)}`);

    if (!questionResult.rowCount) {
      throw createError.Conflict(
        `Question "${question_id}" already exists for quizz ${quiz_id} (no INSERT)`
      );
    }

    const insertPromises = propositions.map((prop) => {
      const { proposition_id, content, correct } = prop;
      const propArgs = [quiz_id, question_id, proposition_id, content, correct];
      return pool.query(propositionQuery, propArgs);
    });

    const propResults = await Promise.all(insertPromises);
    logger.silly(
      `QuestionDAO.insert@${JSON.stringify(propResults.map((o) => o.rows))}`
    );
    if (propResults.some(o => o === undefined))
    {
      throw createError.Conflict(
        `Proposition contraint violated for question "${question_id}" of quizz ${quiz_id} (no INSERT)`
      );
    }

    await client.query('COMMIT');
    return questionResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    logger.silly(`QuestionDAO.insert throw error ${err}`);
    throw err;
  } finally {
    client.release();
  }
}

async function update(question) {
  logger.silly(`QuestionDAO.insert@${JSON.stringify(question)}`);

  const questionQuery = `
    UPDATE question SET
      sentence = $3
    WHERE quiz_id = $1 AND question_id = $2
    RETURNING quiz_id, question_id;`;

  const propositionQuery = `
    UPDATE proposition SET
      content = $4,
      correct = $5
    WHERE quiz_id = $1 AND question_id = $2 AND proposition_id = $3
    RETURNING quiz_id, question_id, proposition_id;`;

  const { quiz_id, question_id, sentence, propositions } = question;
  const questionArgs = [quiz_id, question_id, sentence];

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const questionResult = await pool.query(questionQuery, questionArgs);
    logger.silly(`QuestionDAO.update@${JSON.stringify(questionResult.rows)}`);
    const insertPromises = propositions.map((prop) => {
      const { proposition_id, content, correct } = prop;
      const propArgs = [quiz_id, question_id, proposition_id, content, correct];
      return pool.query(propositionQuery, propArgs);
    });

    const propResults = await Promise.all(insertPromises);
    logger.silly(
      `QuestionDAO.insert@${JSON.stringify(propResults.map((o) => o.rows))}`
    );

    await client.query('COMMIT');
    return questionResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    logger.silly(`QuestionDAO.insert throw error ${err}`);
    throw err;
  } finally {
    client.release();
  }
}

async function del(quiz_id, question_id) {
  logger.silly(`QuestionDAO.del@${JSON.stringify(quiz_id)}, ${question_id}`);

  const query = `
    DELETE FROM question
    WHERE quiz_id = $1 AND question_id = $2
    RETURNING quiz_id, question_id;`;
  const result = await pool.query(query, [quiz_id, question_id]);

  if (result.rowCount) return result.rows[0];
  throw createError.NotFound(
    `Cannot DELETE question ${question_id} of quiz #${quiz_id}`
  );
}

module.exports = { selectAll, selectByIdAnswers, selectById, insert, update, del };
