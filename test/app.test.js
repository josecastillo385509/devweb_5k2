const request = require('supertest');
const app = require('../app');

describe('App general endpoints and error handling', () => {
  test('GET / debe responder 200 con contenido HTML', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  test('GET a ruta inexistente debe responder 404 en formato JSON', async () => {
    const res = await request(app).get('/ruta-totalmente-inexistente');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('message');
  });

  test('POST con cuerpo JSON malformado debe responder 400', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send('{ bad json ');

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('message');
  });
});
