/* eslint-disable node/no-unpublished-require */
const request = require('supertest');

const app = require('../../app');
const { pool }= require('../../config');

afterAll((done) => {
  pool.end(() => done());
});


describe('GET /users/', () => {
  it('should give the list of all user_id\'s', async (done) => {
    const res = await request(app)
      .get('/users/')
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
    expect(res.body).toContainEqual({user_id: 'test.user'});
    expect(res.body).toContainEqual({user_id: 'other.user'});
    done();
  });
});
