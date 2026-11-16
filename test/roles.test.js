const request = require('supertest');
const app = require('../app');
const Role = require('../models/relationals/Role');
const { describeCrud } = require('./helpers/crud-suite');
const { Role } = require('./helpers/rbac-db');

 feat/automatized-jest-supertest
describeCrud('roles');

describe('API /api/roles casos específicos', () => {
  test('PUT /api/roles/:id cuando el rol no existe responde 404', async () => {
    Role.findByPk = jest.fn().mockResolvedValue(null);

    const res = await request(app)
      .put('/api/roles/9999')
      .send({ name: 'Inexistente' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('role not found');
  });

  test('DELETE /api/roles/:id cuando el rol no existe responde 404', async () => {
    Role.findByPk = jest.fn().mockResolvedValue(null);

    const res = await request(app).delete('/api/roles/9999');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('role not found');
  });

describeCrud('roles', {
  seed: async () => String((await Role.create({ name: 'spare', description: 'spare' })).id),
  createBody: { name: 'nuevo-rol', description: 'rol de prueba' },
 main
});
