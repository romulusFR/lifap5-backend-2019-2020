/**
 * @file End-to end (a.k.a., functional, blackbox, functional) tests for 'quizzes/:quizz_id/questions'
 * @author Romuald THION
 */

const request = require('supertest');

const app = require('../../../app');
const { pool } = require('../../../config');

afterAll((done) => {
  pool.end(() => done());
});


describe('GET /quizzes/:quiz_id/questions', () => {
  it('should give the list of all questions of a quiz', async () => {
    const res = await request(app)
      .get('/quizzes/0/questions')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });
});