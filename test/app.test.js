const request = require('supertest');
const app = require('../app');

describe('Todo API', () => {
  it('GET / should return status message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('POST /todos should create a todo', async () => {
    const res = await request(app).post('/todos').send({ text: 'Learn DevOps' });
    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Learn DevOps');
  });
});
