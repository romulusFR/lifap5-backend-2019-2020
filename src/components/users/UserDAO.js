/**
 * @file The user data access object (DAO)
 * @author Romuald THION
 */

const { logger, pool } = require('../../config');

const selectAllUsersQuery = (page, pageLimit) => `
SELECT user_id
FROM quiz_user
ORDER BY user_id
OFFSET ${(page - 1) * pageLimit} ROWS
FETCH FIRST ${pageLimit} ROWS ONLY;
`;

/**
 * @function Give the paginated list of all users
 * @todo : the OFFSET/FETCH method sucks, see
 *         https://www.citusdata.com/blog/2016/03/30/five-ways-to-paginate/
 * @param {*} currentPage
 * @param {*} pageSize
 */

async function selectAllUsers(currentPage = 1, pageSize) {
  logger.silly(`selectAllUsers@${currentPage}, ${pageSize}`);

  // NB : THIS DO NOT USE TRANSACTION YET


  
  const pagesInfoQuery = 'SELECT COUNT(*)::integer AS nb FROM quiz_user;';
  const pagesInfo = await pool.query(pagesInfoQuery);

  const nbResults = pagesInfo.rows[0].nb;
  const result = await pool.query(selectAllUsersQuery(currentPage, pageSize));

  return {
    currentPage,
    pageSize,
    nbResults,
    nbPages: Math.ceil(nbResults / pageSize),
    results: result.rows,
  };
}

module.exports = { selectAllUsers };
