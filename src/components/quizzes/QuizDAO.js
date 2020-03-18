/**
 * @file The quiz data access object (DAO)
 * @author Romuald THION
 */

const createError = require('http-errors');
const { logger, pool, PaginatedResult } = require('../../config');

/**
 * @todo : the OFFSET/FETCH method sucks, see
 *         https://www.citusdata.com/blog/2016/03/30/five-ways-to-paginate/
 */
// the list of all quizzes. The queried views contains extra information
async function selectAll(currentPage, pageSize) {
  logger.silly(`QuizDAO.selectAll@${currentPage}, ${pageSize})`);

  const query = `
    SELECT *
    FROM v_quiz_ext
    ORDER BY quiz_id
    OFFSET ${(currentPage - 1) * pageSize} ROWS
    FETCH FIRST ${pageSize} ROWS ONLY;`;
  // const result = await pool.query(query);

  const pagesInfoQuery = 'SELECT COUNT(*)::integer AS nb FROM v_quiz_ext;';
  const pagesInfo = await pool.query(pagesInfoQuery);
  const totalResults = pagesInfo.rows[0].nb;

  const result = await pool.query(query);

  return new PaginatedResult(currentPage, totalResults, pageSize, result.rows);
}

async function selectById(quiz_id) {
  logger.silly(`QuizDAO.selectById@${quiz_id}`);

  const query = 'SELECT * FROM v_quiz_ext WHERE quiz_id = $1';
  const result = await pool.query(query, [quiz_id]);

  return result.rows[0];
}

async function insert(quiz) {
  logger.silly(`QuizDAO.insert@${JSON.stringify(quiz)}`);

  const query = `
    INSERT INTO quiz(title, description, open, owner_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (title) DO NOTHING
    RETURNING quiz_id;`;

  const { title, description, owner_id, open = false } = quiz;
  const args = [title, description, open, owner_id];
  const result = await pool.query(query, args);

  if (!result.rowCount) {
    throw createError.Conflict(
      `Title "${quiz.title}" already exists (no INSERT)`
    );
  }
  return result.rows[0];
}

async function update(quiz) {
  const putQuizQuery = `
    UPDATE quiz SET
      title = $1,
      description = $2,
      open = $3
    WHERE quiz_id = $4 AND owner_id = $5
    RETURNING quiz_id;`;

  logger.silly(`QuizDAO.update@${JSON.stringify(quiz)}`);
  const args = [
    quiz.title,
    quiz.description,
    quiz.open,
    quiz.quiz_id,
    quiz.owner_id,
  ];
  const result = await pool.query(putQuizQuery, args);

  if (result.rowCount) return result.rows[0];
  throw createError.NotFound(`Cannot UPDATE quiz #${quiz.quiz_id}`);
}

async function del(quiz_id, user_id) {
  logger.silly(`QuizDAO.del@${JSON.stringify(quiz_id)}, ${user_id}`);

  const query = `
    DELETE FROM quiz
    WHERE quiz_id = $1 AND owner_id = $2
    RETURNING quiz_id;`;
  const result = await pool.query(query, [quiz_id, user_id]);

  if (result.rowCount) return result.rows[0];
  throw createError.NotFound(`Cannot DELETE quiz #${quiz_id}`);
}

module.exports = { selectAll, selectById, insert, update, del };
