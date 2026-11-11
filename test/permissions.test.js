const request = require('supertest');
const app = require('../app');
const Permission = require('../models/relationals/Permission');
const { describeCrud } = require('./helpers/crud-suite');

describeCrud('permissions');

describe('API /api/permissions casos específicos', () => {
  test('PUT /api/permissions/:id cuando el permiso no existe responde 404', async () => {
    Permission.findByPk = jest.fn().mockResolvedValue(null);

    const res = await request(app)
      .put('/api/permissions/9999')
      .send({ key: 'nueva_key' });

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('permission not found');
  });

  test('DELETE /api/permissions/:id cuando el permiso no existe responde 404', async () => {
    Permission.findByPk = jest.fn().mockResolvedValue(null);

    const res = await request(app).delete('/api/permissions/9999');

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('permission not found');
  });
});
