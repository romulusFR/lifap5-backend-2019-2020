/* eslint-disable camelcase */
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

describe('GET /quizzes/:quiz_id/questions/:question_id/', () => {
  it('should send an error on invalid question_id', async () => {
    const res = await request(app)
      .get('/quizzes/0/questions/test/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(400);
  });

  it('should send an error on non-esistent question_id', async () => {
    const res = await request(app)
      .get('/quizzes/0/questions/9999999/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(404);
  });

  it('should detail a question with its propositions but no answers and no correct attribute', async () => {
    const res = await request(app)
      .get('/quizzes/0/questions/0/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const gold = {
      quiz_id: 0,
      question_id: 0,
      sentence: expect.any(String),
      propositions_number: 2,
      correct_propositions_number: 1,
      propositions: [
        {
          content: 'Alan Turing',
          proposition_id: 0,
        },
        {
          content: 'Alonzo Church',
          proposition_id: 1,
        },
      ],
    };

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject(gold);
  });
});

describe('GET /quizzes/:quiz_id/questions/:question_id/answers', () => {
  it('should detail a question of a quiz when you re its owner', async () => {
    const res = await request(app)
      .get('/quizzes/0/questions/0/answers')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '4dd729fd-4709-427f-b371-9d177194c260')
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

describe('GET /quizzes/:quiz_id/questions/:question_id/answers', () => {
  it('should not detail a question of a quiz you do not own', async () => {
    const res = await request(app)
      .get(`/quizzes/0/questions/0/answers`)
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(403);
  });
});

describe('POST/PUT/DEL /quizzes/:quiz_id/questions/', () => {
  let createdQuizId;
  it('should create a fresh quizz you ll own', async () => {
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

  it('should NOT create a question if sentence is not defined', async () => {
    const res = await request(app)
      .post(`/quizzes/${createdQuizId}/questions`)
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .send({question_id : 42, propositions :[]})
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(400);
  });

  it('should NOT create a question if question_id is not defined', async () => {
    const res = await request(app)
      .post(`/quizzes/${createdQuizId}/questions`)
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .send({question_id : 'test', sentence: '', propositions : []})
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(400);
  });


  let createdQuestionId;

  it('should create a fresh question', async () => {
    const questionToCreate = {
      question_id: Math.floor(Math.random() * 1000000),
      sentence: 'What is the question?',
      propositions: [
        {
          content: 'Alan Turing',
          proposition_id: 0,
          correct: false,
        },
        {
          content: 'Alonzo Church',
          proposition_id: 1,
          correct: true,
        },
      ],
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

  it('should update the question', async () => {
    const questionToUpdate = {
      sentence: 'What is the question again?',
      propositions: [
        {
          content: 'Again Alan Turing',
          proposition_id: 0,
          correct: true,
        },
        {
          content: 'Again Alonzo Church',
          proposition_id: 1,
          correct: false,
        },
      ],
    };

    const res = await request(app)
      .put(`/quizzes/${createdQuizId}/questions/${createdQuestionId}`)
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .send(questionToUpdate)
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject({
      quiz_id: createdQuizId,
      question_id: createdQuestionId,
    });
  }); // it put quizz

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

describe('POST /quizzes/:quiz_id/questions/0', () => {
  it('cannot add a question to a quizz that you do not own', async () => {
    const res = await request(app)
      .post(`/quizzes/0/questions/`)
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .send({})
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(403);
  });
});

describe('DEL /quizzes/:quiz_id/questions/0', () => {
  it('cannot delete a question of quizz that you do not own', async () => {
    const res = await request(app)
      .delete(`/quizzes/0/questions/0`)
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(403);
  });
});
