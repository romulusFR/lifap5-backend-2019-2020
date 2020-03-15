/* eslint-disable node/no-unpublished-require */
const request = require('supertest');

const app = require('../../app');
const { pool } = require('../../config');

afterAll((done) => {
  pool.end(() => done());
});

beforeAll(() => {
  return pool.query('delete from quiz where quiz_id >2;');
});

// afterAll(() => {
//   return pool.query('delete from quiz where quiz_id >2;');
// });

describe('GET /quizzes/', () => {
  it('should give the detailed list of all quizzes', async () => {
    const res = await request(app)
      .get('/quizzes/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body.length).toBeLessThanOrEqual(app.locals.pageLimit);
  });

  it('should deal correctly with explicit pagination when out of bounds', async () => {
    const res = await request(app)
      .get('/quizzes/?page=999')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual([]);
  });
});

describe('GET /quizzes/:quiz_id', () => {
  it('should give the details of one quizz', async () => {
    const gold = {
      quiz_id: 0,
      title: 'QCM LIFAP5 #1',
      description: 'Des questions de JS et lambda calcul',
      owner_id: 'romuald.thion',
      open: false,
      // eslint-disable-next-line camelcase
      questions_number: 2,
      // eslint-disable-next-line camelcase
      questions_ids: [0, 1],
    };

    const res = await request(app)
      .get('/quizzes/0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject(gold);
  });
});

describe('POST /quizzes/', () => {
  const quizToCreate = {
    title: `Quiz test #${Math.floor(Math.random() * 1000000)}`,
    description: 'Description of test quiz',
    open: true,
  };
  let createdQuizId;

  it('should create a new quizz', async () => {
    const res = await request(app)
      .post('/quizzes/')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .send(quizToCreate) // sends a JSON post body
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject({ quiz_id: expect.any(Number) });

    // console.log(`POST createdQuizId=${createdQuizId}`);
    createdQuizId = res.body.quiz_id;
  });

  

  it('should detail the quiz we ve just created', async () => {
    // console.log(`GET createdQuizId=${createdQuizId}`);
    const gold = {
      quiz_id: createdQuizId,
      owner_id: 'test.user',
      ...quizToCreate,
    };

    const res = await request(app)
      .get(`/quizzes/${createdQuizId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject(gold);
  });

  describe('PUT /quizzes/:quiz_id (after POST /quizzes/)', () => {
    // console.log(`PUT createdQuizId=${createdQuizId}`);
    it('should update the previous quiz', async () => {
      const content = {
        title: `Quiz test #${Math.floor(Math.random() * 1000000)} - modified`,
        description: 'Description of test quiz - modified',
        open: false,
      };

      const res = await request(app)
        .put(`/quizzes/${createdQuizId}`)
        .set('Accept', 'application/json')
        .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
        .send(content) // sends a JSON post body
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject(content);
    });
  });

  describe('DEL /quizzes/:quiz_id (after POST /quizzes/)', () => {
    // console.log(`DEL createdQuizId=${createdQuizId}`);
    it('should delete the previous quiz', async () => {
      const res = await request(app)
        .delete(`/quizzes/${createdQuizId}`)
        .set('Accept', 'application/json')
        .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject({ quiz_id: createdQuizId });
    });
  });
});

// describe('GET /quizzes/:quiz_id (after POST /quizzes/)', () => {});
