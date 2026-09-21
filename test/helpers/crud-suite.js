const request = require('supertest');
const app = require('../../app');

/**
 * Batería de pruebas CRUD para un recurso con respuestas mock.
 * @param {string} resource  nombre del recurso (p. ej. 'users')
 */
function describeCrud(resource) {
  const base = `/api/${resource}`;

  describe(`API ${base}`, () => {
    // READ
    test('GET / responde 200 con { message, data }', async () => {
      const res = await request(app).get(base);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(typeof res.body.message).toBe('string');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /:id responde 200 con { message, data }', async () => {
      const res = await request(app).get(`${base}/5`);
      expect(res.status).toBe(200);
      expect(typeof res.body.message).toBe('string');
      expect(res.body).toHaveProperty('data');
    });

    //CREATE
    test('POST / responde 201 con { message, data }', async () => {
      const res = await request(app).post(base).send({ example: 'value' });
      expect(res.status).toBe(201);
      expect(typeof res.body.message).toBe('string');
      expect(res.body).toHaveProperty('data');
    });

    test('POST / con JSON mal formado responde 400', async () => {
      const res = await request(app)
        .post(base)
        .set('Content-Type', 'application/json')
        .send('{"broken":');
      expect(res.status).toBe(400);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body).toHaveProperty('message');
    });

    // UPDATE
    test('PUT /:id responde 200 con { message, data }', async () => {
      const res = await request(app).put(`${base}/5`).send({ example: 'value' });
      expect(res.status).toBe(200);
      expect(typeof res.body.message).toBe('string');
      expect(res.body).toHaveProperty('data');
    });

    // DELETE
    test('DELETE /:id responde 200 con { message, data }', async () => {
      const res = await request(app).delete(`${base}/5`);
      expect(res.status).toBe(200);
      expect(typeof res.body.message).toBe('string');
      expect(res.body).toHaveProperty('data');
    });

    // Rutas / métodos inexistentes
    test('una subruta desconocida responde 404 en JSON', async () => {
      const res = await request(app).get(`${base}/5/nada`);
      expect(res.status).toBe(404);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body).toHaveProperty('message');
    });

    test('un método no implementado (PATCH) responde 404 en JSON', async () => {
      const res = await request(app).patch(`${base}/5`).send({});
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });
  });
}

module.exports = { describeCrud };
