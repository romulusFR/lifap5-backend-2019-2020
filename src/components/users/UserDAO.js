/**
 * @file The user data access object (DAO)
 * @author Romuald THION
 */

const { logger, pool } = require('../../config');

/**
 *
 * @todo : the OFFSET/FETCH method sucks, see
 *         https://www.citusdata.com/blog/2016/03/30/five-ways-to-paginate/
 * @param {*} page
 * @param {*} pageLimit
 */
const selectAllUsersQuery = (page, pageLimit) => `
SELECT user_id
FROM quiz_user
ORDER BY user_id
OFFSET ${(page - 1) * pageLimit} ROWS
FETCH FIRST ${pageLimit} ROWS ONLY;
`;

/**
 * @class UserDAO
 * @todo Checks if it is a User model or not...
 * @todo Add order by clause to ensure unique order
 */
class UserDAO {
  // the list of all users
  static async selectAllUsers(page = 1, pageLimit) {
    logger.silly(`selectAllUsers@${page}, ${pageLimit}`);
    const result = await pool.query(selectAllUsersQuery(page, pageLimit));
    return result.rows;
  }
}

module.exports = { UserDAO };
