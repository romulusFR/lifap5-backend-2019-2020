/**
 * @file The user data access object (DAO)
 * @author Romuald THION
 */

const { logger, pool, PaginatedResult } = require('../../config');

/**
 * @function Give the paginated list of all users
 * @todo : the OFFSET/FETCH method sucks, see
 *         https://www.citusdata.com/blog/2016/03/30/five-ways-to-paginate/
 * @param {*} currentPage
 * @param {*} pageSize
 */

async function selectAllUsers(currentPage = 1, pageSize) {
  logger.silly(`selectAllUsers@${currentPage}, ${pageSize}`);

  const selectAllUsersQuery = `
  SELECT user_id
  FROM quiz_user
  ORDER BY user_id
  OFFSET ${(currentPage - 1) * pageSize} ROWS
  FETCH FIRST ${pageSize} ROWS ONLY;
  `;

  // NB : THIS DO NOT USE TRANSACTION YET BUT CLIENT
  let client;
  try {
    // to have a transaction
    client = await pool.connect();

    const pagesInfoQuery = 'SELECT COUNT(*)::integer AS nb FROM quiz_user;';
    const pagesInfo = await client.query(pagesInfoQuery);
    const totalResults = pagesInfo.rows[0].nb;

    const result = await client.query(selectAllUsersQuery);

    client.release();
    return new PaginatedResult(
      currentPage,
      totalResults,
      pageSize,
      result.rows
    );
  } catch (err) {
    client.release();
    throw err;
  }
}

module.exports = { selectAllUsers };
