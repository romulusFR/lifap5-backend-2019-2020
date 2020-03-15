/* eslint-disable node/no-unpublished-require */
const request = require('supertest');

const app = require('../../app');
const { pool } = require('../../config');

afterAll((done) => {
  pool.end(() => done());
});

describe('GET /quizzes/', () => {
  it("should give the detailed list of all quizzes", async () => {
    const res = await request(app)
      .get('/quizzes/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body.length).toBeLessThanOrEqual(app.locals.pageLimit);
  });

  it("should deal correctly with explicit pagination when out of bounds", async () => {
    const res = await request(app)
      .get('/quizzes/?page=999')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual([]);
  });
});
