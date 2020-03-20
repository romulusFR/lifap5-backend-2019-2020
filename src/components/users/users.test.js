/* eslint-disable camelcase */
/* eslint-disable node/no-unpublished-require */
const request = require('supertest');

const app = require('../../app');
const { pool } = require('../../config');

afterAll((done) => {
  pool.end(() => done());
});

describe('GET /users/', () => {
  it("should give the list of all user_id's", async () => {
    const res = await request(app)
      .get('/users/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe('object');

    expect(res.body).toMatchObject({
      currentPage: 1,
      pageSize: app.locals.pageLimit,
      nbResults: expect.any(Number),
      nbPages: expect.any(Number),
      results: expect.arrayContaining([
        { user_id: 'test.user' },
        { user_id: 'other.user' },
      ]),
    });
  });

  it('should deal correctly with explicit pagination when out of bounds', async () => {
    const res = await request(app)
      .get('/users/?page=999')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results).toEqual([]);
  });

  it('should return error on non positive integer', async () => {
    const res = await request(app)
      .get('/users/?page=0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(400);
  });
});

describe('GET /users/whoami', () => {
  it('should answer 200 when x-api-key is set with an exiting user', async () => {
    const res = await request(app)
      .get('/users/whoami')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      user_id: 'test.user',
      firstname: 'Test',
      lastname: 'User',
    });
  });

  it('shouldnegotiate text/html content', async () => {
    const res = await request(app)
      .get('/users/whoami')
      .set('Accept', 'text/html')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /html/);

    expect(res.statusCode).toEqual(200);
  });

  it('should answer 401 when x-api-key is not UUIDv4', async () => {
    const res = await request(app)
      .get('/users/whoami')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '00000000-0000-0000-0000-000000000000')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toMatchObject({
      name: 'UnauthorizedError',
      message: expect.any(String),
      status: 401,
    });
  });

  it('should answer 401 when no x-api-key is not set', async () => {
    const res = await request(app)
      .get('/users/whoami')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toMatchObject({
      name: 'UnauthorizedError',
      message: expect.any(String),
      status: 401,
    });
  });

  it('should answer 401 when x-api-key is not in the database', async () => {
    const res = await request(app)
      .get('/users/whoami')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147d0')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toMatchObject({
      name: 'UnauthorizedError',
      message: expect.any(String),
      status: 401,
    });
  });
  
});

describe('GET /users/answers', () => {
  it('should return all the answers from the current user', async () => {
    const res = await request(app)
      .get('/users/answers')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /json/);

    const gold = {
      answers: expect.any(Array),
      quiz_id: expect.any(Number),
    };

    const prop = {
      answered_at: expect.any(String), // '2020-03-20T09:58:23.392109+01:00',
      question_id: expect.any(Number),
      proposition_id: expect.any(Number),
    };

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.map((a) => {
      expect(a).toMatchObject(gold);
      a.answers.map((x) => expect(x).toMatchObject(prop));
      return true;
    });

    // expect(Date.parse(res.body[0].answers[0].answered_at)).not.toBe(NaN);
  });
});

describe('GET /users/quizzes', () => {
  it('should return all the quizzes from the current user', async () => {
    const res = await request(app)
      .get('/users/quizzes')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147da')
      .expect('Content-Type', /json/);

    const gold = {
      created_at: expect.any(String),
      description: expect.any(String),
      open: expect.any(Boolean),
      owner_id: 'test.user',
      questions_ids: expect.any(Array),
      questions_number: expect.any(Number),
      quiz_id: expect.any(Number),
      title: expect.any(String),
    };

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.map((a) => expect(a).toMatchObject(gold));
    // expect(Date.parse(res.body[0].created_at)).not.toBe(NaN);
  });
});
