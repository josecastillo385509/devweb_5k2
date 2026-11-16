const request = require('supertest');
const app = require('../../app');
const { resetDatabase, bearer } = require('./rbac-db');

/**
 * Batería de pruebas CRUD de un recurso, ejecutada como ADMIN (todos los endpoints están
 * protegidos con authenticate + authorize; la matriz por rol se prueba en test/rbac/).
 *
 * @param {string} resource  nombre del recurso (p. ej. 'users')
 * @param {object} [options]
 * @param {(users) => Promise<string>} [options.seed]  crea un registro existente y devuelve su id
 *                                      (por defecto el recurso es mock y se usa el id '5')
 * @param {object|((users) => object)} [options.createBody]  body válido para el POST
 */
function describeCrud(resource, options = {}) {
  const base = `/api/${resource}`;
  let auth;
  let id = '5';
  let createBody = { example: 'value' };

  describe(`API ${base}`, () => {
    beforeAll(async () => {
      const users = await resetDatabase();
      auth = bearer(users.admin);
      if (options.seed) id = await options.seed(users);
      if (options.createBody) {
        createBody = typeof options.createBody === 'function' ? options.createBody(users) : options.createBody;
      }
    });

    // AUTENTICACIÓN
    test('sin token responde 401', async () => {
      const res = await request(app).get(base);
      expect(res.status).toBe(401);
    });

    // READ
    test('GET / responde 200 con { message, data }', async () => {
      const res = await request(app).get(base).set(auth);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(typeof res.body.message).toBe('string');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /:id responde 200 con { message, data }', async () => {
      const res = await request(app).get(`${base}/${id}`).set(auth);
      expect(res.status).toBe(200);
      expect(typeof res.body.message).toBe('string');
      expect(res.body).toHaveProperty('data');
    });

    //CREATE
    test('POST / responde 201 con { message, data }', async () => {
      const res = await request(app).post(base).set(auth).send(createBody);
      expect(res.status).toBe(201);
      expect(typeof res.body.message).toBe('string');
      expect(res.body).toHaveProperty('data');
    });

    test('POST / con JSON mal formado responde 400', async () => {
      const res = await request(app)
        .post(base)
        .set(auth)
        .set('Content-Type', 'application/json')
        .send('{"broken":');
      expect(res.status).toBe(400);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body).toHaveProperty('message');
    });

    // UPDATE
    test('PUT /:id responde 200 con { message, data }', async () => {
      const res = await request(app).put(`${base}/${id}`).set(auth).send({ example: 'value' });
      expect(res.status).toBe(200);
      expect(typeof res.body.message).toBe('string');
      expect(res.body).toHaveProperty('data');
    });

    // DELETE
    test('DELETE /:id responde 200 con { message, data }', async () => {
      const res = await request(app).delete(`${base}/${id}`).set(auth);
      expect(res.status).toBe(200);
      expect(typeof res.body.message).toBe('string');
      expect(res.body).toHaveProperty('data');
    });

    // Rutas / métodos inexistentes
    test('una subruta desconocida responde 404 en JSON', async () => {
      const res = await request(app).get(`${base}/${id}/nada`).set(auth);
      expect(res.status).toBe(404);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body).toHaveProperty('message');
    });

    test('un método no implementado (PATCH) responde 404 en JSON', async () => {
      const res = await request(app).patch(`${base}/${id}`).set(auth).send({});
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });
  });
}

module.exports = { describeCrud };
