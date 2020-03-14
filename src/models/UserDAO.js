/**
 * @file The user data access object (DAO)
 * @author Romuald THION
 */

const { logger } = require('../utils');
const pool = require('./pool');

/**
 * @class UserDAO
 * @todo Checks if it is a User model or not...
 * @todo Add order by clause to ensure unique order
 */
class UserDAO {
  // the list of all users
  static async getAllUsers() {
    logger.silly(`getAllUsers@`);
    const result = await pool.query('SELECT user_id FROM quiz_user;');
    return result.rows;
  }

  // query to check an api_key
  static async getUserFromApiKey(apiKey) {
    logger.silly(`getUserFromApiKey@${apiKey}`);
    const result = await pool.query(
      'SELECT user_id, firstname, lastname FROM quiz_user WHERE api_key=$1;',
      [apiKey]
    );
    return result.rows[0];
  }
}

module.exports = UserDAO;
