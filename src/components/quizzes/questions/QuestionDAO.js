/**
 * @file The question data access object (DAO)
 * @author Romuald THION
 */

const { logger, pool } = require('../../../config');

class QuestionDAO {
  static async getAllQuestions(quiz_id) {
    logger.silly(`getAllQuestions@`);
    const query = 'SELECT * FROM v_question_info WHERE quiz_id = $1';
    const result = await pool.query(query, [quiz_id]);
    return result.rows;
  }

  static async getQuestionById(quiz_id, question_id) {
    logger.silly(`getQuestionById@${quiz_id} ${question_id}`);
    const query =
      'SELECT * FROM v_question_detailed WHERE quiz_id = $1 AND question_id = $2';
    const result = await pool.query(query, [quiz_id, question_id]);
    return result.rows[0];
  }
}

module.exports = { QuestionDAO };
