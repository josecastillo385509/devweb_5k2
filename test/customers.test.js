const request = require('supertest');
const app = require('../app');
const { Customer } = require('../models/documents');
const { describeCrud } = require('./helpers/crud-suite');

describeCrud('customers');

describe('API /api/customers casos específicos', () => {
  test('PUT /api/customers/:id con formato de id inválido responde 400', async () => {
    const res = await request(app)
      .put('/api/customers/id-invalido')
      .send({ email: 'test@stride.co' });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid id');
  });

  test('PUT /api/customers/:id cuando el cliente no existe responde 404', async () => {
    Customer.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    const res = await request(app)
      .put('/api/customers/9999')
      .send({ email: 'inexistente@stride.co' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Customer not found');
  });

  test('DELETE /api/customers/:id cuando el cliente no existe responde 404', async () => {
    Customer.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    const res = await request(app).delete('/api/customers/9999');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Customer not found');
  });
});
