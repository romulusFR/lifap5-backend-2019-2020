const { logger } = require('../utils');
const pool = require('./pool');

class UserDAO {
  // the list of all users
  static async getAllUsers() {
    logger.debug(`getAllUsers()`);
    const result = await pool.query('SELECT user_id FROM quiz_user;');
    return result.rows;
  }

  // query to check an api_key
  static async getUserFromApiKey(apiKey) {
    logger.debug(`getUserFromApiKey("${apiKey})`);
    const result = await pool.query(
      'SELECT user_id, firstname, lastname FROM users WHERE api_key=$1;',
      [apiKey]
    );
    return result.rows[0];
  }
}

module.exports = UserDAO;
