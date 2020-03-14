/**
 * @file The user data access object (DAO)
 * @author Romuald THION
 */

const { logger, pool } = require('../../config');

/**
 * @class UserDAO
 * @todo Checks if it is a User model or not...
 * @todo Add order by clause to ensure unique order
 */
class UserDAO {
  // the list of all users
  static async selectAllUsers() {
    logger.silly(`selectAllUsers@`);
    const result = await pool.query('SELECT user_id FROM quiz_user;');
    return result.rows;
  }
}

module.exports = { UserDAO };
