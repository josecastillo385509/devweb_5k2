const request = require('supertest');
const app = require('../../app');

const OBJECT_ID = '507f1f77bcf86cd799439011';

/**
 * Batería de pruebas CRUD para un recurso con respuestas mock.
 * @param {string} resource  nombre del recurso (p. ej. 'users')
 * @param {'numeric'|'objectId'} idType  formato de :id que acepta el recurso
 */
function describeCrud(resource, idType = 'numeric') {
  const base = `/api/${resource}`;
  const validId = idType === 'numeric' ? '5' : OBJECT_ID;
  const invalidIds = idType === 'numeric' ? ['abc', '0', '-1', '1.5'] : ['abc', '123', 'zzzzzzzzzzzzzzzzzzzzzzzz'];

  describe(`API ${base}`, () => {
    // ---------- READ ----------
    describe('GET /', () => {
      test('responde 200 con { message, data }', async () => {
        const res = await request(app).get(base);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body).toHaveProperty('message');
        expect(typeof res.body.message).toBe('string');
        expect(Array.isArray(res.body.data)).toBe(true);
      });
    });

    describe('GET /:id', () => {
      test('responde 200 e incluye el id de la ruta en el mensaje', async () => {
        const res = await request(app).get(`${base}/${validId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.message).toContain(validId);
      });

      test.each(invalidIds)('responde 400 con id inválido "%s"', async (id) => {
        const res = await request(app).get(`${base}/${id}`);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
      });
    });

    // ---------- CREATE ----------
    describe('POST /', () => {
      test('responde 201 con { message, data }', async () => {
        const res = await request(app).post(base).send({ example: 'value' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('data');
      });

      test('responde 400 si el JSON está mal formado', async () => {
        const res = await request(app)
          .post(base)
          .set('Content-Type', 'application/json')
          .send('{"broken":');
        expect(res.status).toBe(400);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.message).toBe('Invalid JSON body');
      });
    });

    // ---------- UPDATE ----------
    describe('PUT /:id', () => {
      test('responde 200 e incluye el id de la ruta en el mensaje', async () => {
        const res = await request(app).put(`${base}/${validId}`).send({ example: 'value' });
        expect(res.status).toBe(200);
        expect(res.body.message).toContain(validId);
        expect(res.body).toHaveProperty('data');
      });

      test('responde 400 con id inválido', async () => {
        const res = await request(app).put(`${base}/${invalidIds[0]}`).send({});
        expect(res.status).toBe(400);
      });
    });

    // ---------- DELETE ----------
    describe('DELETE /:id', () => {
      test('responde 200 e incluye el id de la ruta en el mensaje', async () => {
        const res = await request(app).delete(`${base}/${validId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain(validId);
        expect(res.body).toHaveProperty('data');
      });

      test('responde 400 con id inválido', async () => {
        const res = await request(app).delete(`${base}/${invalidIds[0]}`);
        expect(res.status).toBe(400);
      });
    });

    // ---------- Rutas / métodos inexistentes ----------
    describe('rutas inexistentes', () => {
      test('una subruta desconocida responde 404 en JSON', async () => {
        const res = await request(app).get(`${base}/${validId}/nada`);
        expect(res.status).toBe(404);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body).toHaveProperty('message');
      });

      test('un método no implementado (PATCH) responde 404 en JSON', async () => {
        const res = await request(app).patch(`${base}/${validId}`).send({});
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message');
      });
    });
  });
}

module.exports = { describeCrud };
