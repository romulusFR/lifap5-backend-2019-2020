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
  it('should detail aquestion of a quiz', async () => {
    const res = await request(app)
      .get('/quizzes/0/questions/0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const gold = {
      quiz_id: 0,
      question_id: 0,
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

describe('POST/DEL /quizzes/:quiz_id/questions/', () => {
  let createdQuizId;
  it('should create a fresh quizz', async () => {
    const quizToCreate = {
      title: `Quiz test #${Math.floor(Math.random() * 1000000)}`,
      description: 'Description of test quiz',
      open: true,
    };

    const quizz = await request(app)
      .post('/quizzes/')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .send(quizToCreate); // sends a JSON post body

    createdQuizId = quizz.body.quiz_id;
  });

  let createdQuestionId;
  it('should create a fresh question', async () => {
    const questionToCreate = {
      question_id: Math.floor(Math.random() * 1000000),
      content: 'What is the question?',
    };

    const res = await request(app)
      .post(`/quizzes/${createdQuizId}/questions`)
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .send(questionToCreate)
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject({
      quiz_id: createdQuizId,
      question_id: expect.any(Number),
    });

    createdQuestionId = res.body.question_id;
  }); // it quizz

  describe('DEL /quizzes/:quiz_id/questions/:question_id', () => {
    it('should delete the fresh question', async () => {
      const res = await request(app)
        .delete(`/quizzes/${createdQuizId}/questions/${createdQuestionId}`)
        .set('Accept', 'application/json')
        .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject({
        quiz_id: createdQuizId,
        question_id: createdQuestionId,
      });
    }); // it DEL
  }); // describe DEL
}); // describe outer POST/DEL
