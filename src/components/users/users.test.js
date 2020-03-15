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
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
    expect(res.body.length).toBeLessThanOrEqual(app.locals.pageLimit);
    expect(res.body).toContainEqual({ user_id: 'test.user' });
    expect(res.body).toContainEqual({ user_id: 'other.user' });
  });

  it("should deal correctly with explicit pagination when out of bounds", async () => {
    const res = await request(app)
      .get('/users/?page=999')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual([]);
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

  it('should answer 400 when x-api-key is not UUIDv4', async () => {
    const res = await request(app)
      .get('/users/whoami')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '00000000-0000-0000-0000-000000000000')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toMatchObject({
      name: 'BadRequestError',
      message: expect.any(String),
      status: 400,
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

  it('should answer 403 when x-api-key is not in the database', async () => {
    const res = await request(app)
      .get('/users/whoami')
      .set('Accept', 'application/json')
      .set('X-API-KEY', '944c5fdd-af88-47c3-a7d2-5ea3ae3147d0')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toMatchObject({
      name: 'ForbiddenError',
      message: expect.any(String),
      status: 403,
    });
  });
});
