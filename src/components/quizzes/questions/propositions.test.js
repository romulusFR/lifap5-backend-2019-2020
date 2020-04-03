/* eslint-disable camelcase */
/**
 * @file End-to end (a.k.a., functional, blackbox, functional) tests for 'quizzes/:quizz_id/questions/:question_id/...'
 * @author Romuald THION
 */

/* eslint-disable node/no-unpublished-require */
const request = require('supertest');

const app = require('../../../app');
const { pool } = require('../../../config');

afterAll((done) => {
  pool.end(() => done());
});

describe('POST/DEL /quizzes/:quiz_id/questions/:question_id/answers/:proposition_id/', () => {
  it('should answer a question of a quiz when it exists', async () => {
    const res = await request(app)
      .post('/quizzes/0/questions/0/answers/0/')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /json/);

    const gold = {
      user_id: 'test.user',
      quiz_id: 0,
      question_id: 0,
      proposition_id: 0,
      answered_at: expect.any(String),
    };

    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject(gold);
  });

  let answered_at;
  it('should update a question of a quiz already answered', async () => {
    const res = await request(app)
      .post('/quizzes/0/questions/0/answers/1/')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /json/);

    const gold = {
      user_id: 'test.user',
      quiz_id: 0,
      question_id: 0,
      proposition_id: 1,
      answered_at: expect.any(String),
    };

    answered_at = res.body.answered_at;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject(gold);
  });

  it('should delete a question of a quiz previously answered', async () => {
    const res = await request(app)
      .delete('/quizzes/0/questions/0/answers/')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /json/);

    const gold = {
      user_id: 'test.user',
      quiz_id: 0,
      question_id: 0,
      proposition_id: 1,
      answered_at,
    };

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject(gold);
  });
});

describe('POST /quizzes/:quiz_id/questions/:question_id/answers/:proposition_id/', () => {
  it('should NOT answer a question of a quiz when it is closed', async () => {
    const res = await request(app)
      .post('/quizzes/1/questions/0/answers/0/')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(403);
  });
});


describe('POST /quizzes/:quiz_id/questions/:question_id/answers/:proposition_id/', () => {
  it('should NOT answer a question of an non  existent proposition', async () => {
    const res = await request(app)
      .post('/quizzes/0/questions/0/answers/42/')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(404);
  });

  it('should NOT answer a question of an invalid proposition', async () => {
    const res = await request(app)
      .post('/quizzes/0/questions/0/answers/none/')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(400);
  });
});


describe('DEL /quizzes/0/questions/0/answers/', () => {
  it('should NOT delete an answer a question of a quiz you did not answered', async () => {
    const res = await request(app)
      .post('/quizzes/0/questions/1/answers/')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(404);
  });
});
