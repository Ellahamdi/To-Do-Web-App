const request = require('supertest');
const app = require('./index'); // adapt path to your server app

describe('Todos API', () => {
  test('GET /api/todos returns 200 and array', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});