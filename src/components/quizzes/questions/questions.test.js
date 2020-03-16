/**
 * @file End-to end (a.k.a., functional, blackbox, functional) tests for 'quizzes/:quizz_id/questions'
 * @author Romuald THION
 */

/* eslint-disable node/no-unpublished-require */
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

describe('GET /quizzes/:quiz_id/questions/:question_id', () => {
  it('should give the list of all questions of a quiz', async () => {
    const res = await request(app)
      .get('/quizzes/0/questions/0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const gold = {
      quiz_id: 0,
      question_id: 0,
      weight: 2,
      propositions: [
        {
          content: 'Alan Turing',
          correct: false,
          proposition_id: 0,
        },
        {
          answers: [
            {
              user_id: 'test.user',
              answered_at: expect.any(String),
            },
          ],
          content: 'Alonzo Church',
          correct: true,
          proposition_id: 1,
        },
      ],
    };

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject(gold);
  });
});
