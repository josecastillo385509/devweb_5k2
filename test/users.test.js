const request = require('supertest');
const app = require('../app');
const User = require('../models/relationals/User');
const { describeCrud } = require('./helpers/crud-suite');

describeCrud('users');

describe('API /api/users validaciones y casos límite específicos', () => {
  test('POST /api/users sin password responde 400', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Sin', lastName: 'Password', email: 'nopass@stride.co' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('password is required');
  });

  test('PUT /api/users/:id cuando el usuario no existe responde 404', async () => {
    User.findByPk = jest.fn().mockResolvedValue(null);

    const res = await request(app)
      .put('/api/users/9999')
      .send({ name: 'Modificado' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

  test('DELETE /api/users/:id cuando el usuario no existe responde 404', async () => {
    User.findByPk = jest.fn().mockResolvedValue(null);

    const res = await request(app).delete('/api/users/9999');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});
